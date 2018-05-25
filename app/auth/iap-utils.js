var crypto = require('crypto');

var getUserFromRequest = function(req) {
    var iapUser = req.headers['x-goog-authenticated-user-email'];
    if (iapUser) {
        iapUser = iapUser.replace('accounts.google.com:', '');
        var user = {};
        user.name = iapUser;
        user.email = iapUser;

        var md5sum = crypto.createHash('md5');
        user.emailHash = md5sum.update(user.email).digest('hex');

        return user;
    }
    return null;
};

module.exports = {
    getUserFromRequest: getUserFromRequest
};
