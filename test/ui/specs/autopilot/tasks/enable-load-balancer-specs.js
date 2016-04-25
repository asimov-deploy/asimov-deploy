"use strict";
define([
    'jquery',
    'backbone',
    'when',
    'when/sequence',
    'app',
    'autopilot/tasks/EnableLoadBalancerForAgents'
], function ($, Backbone, when, sequence, app, EnableLoadBalancerForAgentsTask) {
    var requests = [];

    describe("Autopilot", function() {

        describe("Tasks", function() {

            describe("EnableLoadBalancerForAgents", function() {

                beforeAll(function() {
                    spyOn($, 'ajax').and.callFake(function (req) {
                        requests.push(req);
                        var d = $.Deferred();
                        d.resolve({ data: 1 });
                        return d.promise();
                    });
                });

                describe("given two agents when executing enable load balancer task", function() {
                    var vent;
                    var spy;
                    var promise;

                    beforeEach(function () {
                        var config = {
                            loadBalancerTimeout: 10000,
                            enableLoadBalancerPostDelay: 0
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

                        var task = new EnableLoadBalancerForAgentsTask(config, vent);
                        promise = sequence([task.execute(taskData)]);
                    });

                    describe("when triggering load balancer state changed for both agents", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('agent:event:loadBalancerStateChanged', {
                                    agentName: 'machine-01',
                                    state: {
                                        enabled: true,
                                        connectionCount: 1
                                    }
                                });
                            }, 1);

                            setTimeout(function () {
                                vent.trigger('agent:event:loadBalancerStateChanged', {
                                    agentName: 'machine-02',
                                    state: {
                                        enabled: true,
                                        connectionCount: 1
                                    }
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