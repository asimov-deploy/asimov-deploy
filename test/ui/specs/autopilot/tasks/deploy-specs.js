"use strict";
define([
    'jquery',
    'backbone',
    'when',
    'when/sequence',
    'app',
    'autopilot/tasks/Deploy'
], function ($, Backbone, when, sequence, app, DeployTask) {
    describe("Autopilot", function() {

        describe("Tasks", function() {

            describe("Deploy", function() {
                var modelSpy;
                var config;
                var taskData;
                var vent;
                var promise;

                beforeAll(function() {
                    spyOn($, 'ajax').and.callFake(function (req) {
                        var d = $.Deferred();
                        d.resolve({ data: 1 });
                        return d.promise();
                    });
                });

                beforeEach(function() {
                    config = {
                        paused: false,
                        deployPostDelay: 0,
                        deployRetryOnFailure: false,
                        deployFailureRetries: 0
                    };

                    taskData = {
                        agents: [
                            'machine-01'
                        ],
                        units: [
                            { unitName: 'webapp', versionId: '1' }
                        ]
                    };
                });

                it("is just a function, so it can contain any code", function(done) {
                    vent = new Backbone.Wreqr.EventAggregator();
                    var task = new DeployTask(config, vent);
                    sequence([task.execute(taskData)])
                        .then(function (data) {
                            console.log('data', JSON.stringify(data));
                        })
                        .finally(done);

                    setTimeout(function () {
                        vent.trigger('agent:event:deployCompleted', {
                            agentName: 'machine-01',
                            unitName: 'webapp'
                        });
                    }, 1);
                });

            });
        });
    });
});