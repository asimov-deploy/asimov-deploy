"use strict";
define([
    'jquery',
    'backbone',
    'when',
    'when/sequence',
    'app',
    'autopilot/tasks/Verify'
], function ($, Backbone, when, sequence, app, VerifyTask) {
    var requests = [];

    return;// Disable

    describe("Autopilot", function() {

        describe("Tasks", function() {

            describe("Verify", function() {

                beforeAll(function() {
                    spyOn($, 'ajax').and.callFake(function (req) {
                        requests.push(req);
                        var d = $.Deferred();
                        d.resolve({ data: 1 });
                        return d.promise();
                    });
                });

                describe("given two agents and one unit when executing verify task", function() {
                    var vent;
                    var spy;
                    var promise;

                    beforeEach(function () {
                        var config = {
                            verifyPostDelay: 0
                        };

                        var taskData = {
                            agents: [
                                'machine-01',
                                'machine-02'
                            ],
                            units: [
                                { unitName: 'webapp', versionId: '1' }
                            ]
                        };

                        vent = new Backbone.Wreqr.EventAggregator();
                        spy = jasmine.createSpy('event');
                        vent.on('autopilot:pause-deploy', spy);

                        var task = new VerifyTask(config, vent);
                        promise = sequence([task.execute(taskData)]);
                    });

                    describe("when triggering verify progress completed for agents and unit", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:verify-progress', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp',
                                    completed: true
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:verify-progress', {
                                    agentName: 'machine-02',
                                    unitName: 'webapp',
                                    completed: true
                                });
                            }, 1);
                        });

                        it("task should finish", function (done) {
                            promise.then(done);
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

                describe("given two agents and one unit when executing verify task without inital verify step", function() {
                    var vent;
                    var spy;
                    var promise;

                    beforeEach(function () {
                        var config = {
                            verifyPostDelay: 0
                        };

                        var taskData = {
                            agents: [
                                'machine-01',
                                'machine-02'
                            ],
                            units: [
                                { unitName: 'webapp', versionId: '1' }
                            ]
                        };

                        vent = new Backbone.Wreqr.EventAggregator();
                        spy = jasmine.createSpy('event');
                        vent.on('autopilot:pause-deploy', spy);

                        var task = new VerifyTask(config, vent);
                        promise = sequence([task.executeAndSkipInitialVerifyStep(taskData)]);

                    });

                    describe("when triggering verify progress completed for agents and unit", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:verify-progress', {
                                    agentName: 'machine-01',
                                    unitName: 'webapp',
                                    completed: true
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:verify-progress', {
                                    agentName: 'machine-02',
                                    unitName: 'webapp',
                                    completed: true
                                });
                            }, 1);
                        });

                        it("task should finish", function (done) {
                            promise.then(done);
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
            });
        });
    });
});