"use strict";
define([
    'backbone',
    'when/sequence',
    'app',
    'autopilot/tasks/Prompt'
], function (Backbone, sequence, app, PromptTask) {
    describe("Autopilot", function() {
        describe("Tasks", function() {
            describe("Prompt", function() {

                describe("given autopilot non-paused", function() {
                    var config = {
                        paused: false
                    };

                    var vent = new Backbone.Wreqr.EventAggregator();
                    var spy = jasmine.createSpy('event');
                    vent.on('autopilot:pause-deploy', spy);

                    describe("when executing prompt task", function() {
                        var task = new PromptTask(config, vent);
                        var promise = sequence([task.execute()])
                            .then(function () {
                                console.log('done');
                            })
                            .otherwise(function (e) {
                                console.log('error', e);
                            });

                        it("should trigger pause deploy", function() {
                            setTimeout(function () {
                                expect(spy).toHaveBeenCalled();
                            }, 1);
                        });
                    });
                });

                describe("given autopilot paused", function() {
                    var config = {
                        paused: true
                    };

                    var vent = new Backbone.Wreqr.EventAggregator();
                    var spy = jasmine.createSpy('event');
                    vent.on('autopilot:pause-deploy', spy);

                    var task = new PromptTask(config, vent);
                    var promise = sequence([task.execute()]);

                    describe("when executing prompt task", function() {

                        it("should not trigger pause deploy", function() {
                            expect(spy).not.toHaveBeenCalled();
                        });

                        describe("and then triggering continue deploy", function() {
                            setTimeout(function () {
                                vent.trigger('autopilot:continue-deploy');
                            }, 1);

                            it("task should finish", function() {
                                setTimeout(function () {
                                    expect(promise.inspect().state).toBe('fulfilled');
                                }, 1);
                            });
                        });
                    });
                });
            });
        });
    });
});