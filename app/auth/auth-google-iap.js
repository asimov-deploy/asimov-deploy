/*******************************************************************************
 * Copyright (C) 2012 eBay Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

const restify = require("restify-clients");
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;
const jwt = require('jsonwebtoken');

const iapAssertionHeader = 'x-goog-iap-jwt-assertion';


var keyCache = {};
// https://cloud.google.com/iap/docs/signed-headers-howto
function getIapKey(request, rawJwtToken, done) {
    var token = jwt.decode(rawJwtToken, {
        complete: true
    });
    const keyId = token.header.kid;
    var key = keyCache[keyId];
    if (key) {
        done(null, key);
    }
    // Re-fetch the key file.
    var publicKeyClient = restify.createJsonClient({
        url: 'https://www.gstatic.com'
    });
    publicKeyClient.get('/iap/verify/public_key', function (err, req, _, data) {
        if (err) {
            done(err);
            return;
        }
        keyCache = data;
        var key = keyCache[keyId];
        if (key) {
            done(null, key);
        } else {
            done(`Key ${keyId} not found in Google's key list. Available keys: ${JSON.stringify(keyCache)}`);
        }
    });
}

module.exports = function (app, passport, config) {

    var audience = config['auth-google-iap'].audience;
    if (!audience) {
        console.warn('auth-google-iap configured without audience. The jwt payload audience will not be verified. See https://cloud.google.com/iap/docs/signed-headers-howto#verify_the_jwt_payload');
    }

    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromHeader(iapAssertionHeader);
    opts.secretOrKeyProvider = getIapKey;
    opts.issuer = 'https://cloud.google.com/iap';
    opts.algorithms = 'ES256';
    if(audience) {
        opts.audience = audience;
    }
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        var user = jwt_payload.email;
        if (user) {
            done(null, {
                name: user,
                email: user,
                id: user
            });
        } else {
            done(`No user in jwt token ${JSON.stringify(jwt_payload)}`);
        }
    }));

    app.use(function (req, res, next) {
        if (!req.headers[iapAssertionHeader]) {
            next();
            return;
        }
        //Always authenticate when there is an authentication header
        passport.authenticate('jwt', {
            session: false
        }, function (err, user, info) {
            if (!user) {
                if (err) {
                    console.error("Failed iap login", err);
                }
                if (info) {
                    console.log("Failed iap login", info);
                }
                next(err);
                return;
            }

            req.login(user, function (err) {
                if (err) {
                    console.error(err);
                }
                next();
            });
        })(req, res, next);
    });
};