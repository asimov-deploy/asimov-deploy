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

                describe("given autopilot not paused and executing prompt task", function() {
                    var config = {
                        paused: false
                    };

                    var vent = new Backbone.Wreqr.EventAggregator();
                    var spy = jasmine.createSpy('event');
                    vent.on('autopilot:pause-deploy', spy);

                    var task = new PromptTask(config, vent);
                    sequence([task.execute()]);

                    it("should trigger pause deploy", function () {
                        setTimeout(function () {
                            expect(spy).toHaveBeenCalled();
                        }, 1);
                    });
                });

                describe("given autopilot paused and executing prompt task", function() {
                    var vent;
                    var spy;
                    var promise;

                    beforeEach(function () {
                        var config = {
                            paused: true
                        };

                        vent = new Backbone.Wreqr.EventAggregator();
                        spy = jasmine.createSpy('event');
                        vent.on('autopilot:pause-deploy', spy);

                        var task = new PromptTask(config, vent);
                        promise = sequence([task.execute()]);
                    });

                    it("should not trigger pause deploy", function() {
                        expect(spy).not.toHaveBeenCalled();
                    });

                    describe("when triggering continue deploy", function() {
                        beforeEach(function () {
                            setTimeout(function () {
                                vent.trigger('autopilot:continue-deploy');
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