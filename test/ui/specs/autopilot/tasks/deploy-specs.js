"use strict";
define([
    'jquery',
    'backbone',
    'when',
    'when/sequence',
    'app',
    'autopilot/tasks/Deploy'
], function ($, Backbone, when, sequence, app, DeployTask) {
    var requests = [];

    describe("Autopilot", function() {

        describe("Tasks", function() {

            describe("Deploy", function() {

                beforeAll(function() {
                    spyOn($, 'ajax').and.callFake(function (req) {
                        requests.push(req);
                        var d = $.Deferred();
                        d.resolve({ data: 1 });
                        return d.promise();
                    });
                });

                describe("given no retries on failure when executing deploy task", function() {
                    var vent;
                    var spy;
                    var promise;

                    beforeEach(function () {
                        var config = {
                            deployPostDelay: 0,
                            deployRetryOnFailure: false,
                            deployFailureRetries: 0
                        };

                        var taskData = {
                            agents: [
                                'machine-01'
                            ],
                            units: [
                                { unitName: 'webapp', versionId: '1' }
                            ]
                        };

                        vent = new Backbone.Wreqr.EventAggregator();
                        spy = jasmine.createSpy('event');
                        vent.on('autopilot:pause-deploy', spy);

                        var task = new DeployTask(config, vent);
                        promise = sequence([task.execute(taskData)]);
                    });

                    describe("when triggering deploy completed for agent and unit", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:deployCompleted', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);
                        });

                        it("task should finish", function (done) {
                            promise.then(done);
                        });
                    });

                    describe("when triggering deploy failed for agent and unit", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:deployFailed', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);
                        });

                        it("should trigger pause deploy", function (done) {
                            setTimeout(function () {
                                expect(spy).toHaveBeenCalled();
                                done();
                            }, 1);
                        });

                        describe("when triggering continue deploy", function() {
                            beforeEach(function () {
                                setTimeout(function () {
                                    vent.trigger('autopilot:continue-deploy');
                                }, 1);
                            });

                            it("task should finish", function (done) {
                                setTimeout(function () {
                                    promise.then(done);
                                }, 1);
                            });
                        });
                    });

                    describe("when triggering abort deploy", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('autopilot:abort-deploy');
                            }, 1);
                        });

                        it("task should abort", function (done) {
                            promise.otherwise(done);
                        });
                    });
                });

                describe("given 3 retries on failure when executing deploy task that fails", function() {
                    var vent;
                    var spy;
                    var promise;

                    beforeEach(function () {
                        var config = {
                            deployPostDelay: 0,
                            deployRetryOnFailure: true,
                            deployFailureRetries: 3
                        };

                        var taskData = {
                            agents: [
                                'machine-01'
                            ],
                            units: [
                                { unitName: 'webapp', versionId: '1' }
                            ]
                        };

                        vent = new Backbone.Wreqr.EventAggregator();
                        spy = jasmine.createSpy('event');
                        vent.on('autopilot:pause-deploy', spy);

                        var task = new DeployTask(config, vent);
                        promise = sequence([task.execute(taskData)]);

                        setTimeout(function () {
                            vent.trigger('agent:event:deployFailed', {
                                agentName: 'machine-01',
                                unitName: 'webapp'
                            });
                        }, 1);
                    });

                    it("should not trigger pause deploy", function (done) {
                        setTimeout(function () {
                            expect(spy).not.toHaveBeenCalled();
                            done();
                        }, 1);
                    });

                    describe("when triggering deploy failed 3 times for agent and unit", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:deployFailed', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:deployFailed', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:deployFailed', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);
                        });

                        it("should trigger pause deploy", function (done) {
                            setTimeout(function () {
                                expect(spy).toHaveBeenCalled();
                                done();
                            }, 1);
                        });
                    });

                    describe("when triggering deploy failed 2 times and deploy completed for agent and unit", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:deployFailed', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:deployFailed', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:deployCompleted', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp'
                                });
                            }, 1);
                        });

                        it("should not trigger pause deploy", function (done) {
                            setTimeout(function () {
                                expect(spy).not.toHaveBeenCalled();
                                done();
                            }, 1);
                        });

                        it("task should finish", function (done) {
                            setTimeout(function () {
                                promise.then(done);
                            }, 1);
                        });
                    });
                });
            });
        });
    });
});