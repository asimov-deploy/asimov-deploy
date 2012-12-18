define([
    "underscore",
    "app",
    "./deploy-unit-list-view",
    "./deploy-unit-collection"
],
function(_, app, DeployUnitListView, DeployUnitCollection) {

    var deployUnitList = new DeployUnitCollection();
    var dashboard = {};

    // events
    app.vent.on("agent:event:deployStarted", function(data) {
        var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
        unit.deployStarted(data);
    });

    app.vent.on("agent:event:deployFailed", function(data) {
       var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
       unit.deployFailed(data);
    });

    app.vent.on("agent:event:deployCompleted", function(data) {
        var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
        unit.deployCompleted(data);
    });

    app.vent.on("agent:event:loadBalancerStateChanged", function(data) {
        deployUnitList.forEach(function(unit) {
            if (unit.get('loadBalancerId') === data.id) {
                unit.set({ loadBalancerEnabled: data.enabled });
            }
        });
    });

    app.vent.on("agent:event:verify-progress", function(data) {
        var unit = deployUnitList.getDeployUnit(data.unitName, data.agentName);
        var info = unit.get("info");
        var steps = info.steps ? info.steps.slice(0) : [];

        steps.push({ pass: data.pass, completed: data.completed, message: data.message });

        var update = {
            info: {
                verifying: true,
                steps: steps
            },
            verified: data.completed && data.pass
        };

        unit.set(update);
    });

    app.vent.on("dashboard:show", function(filter) {

        var view = new DeployUnitListView({ collection: deployUnitList });
        app.mainRegion.show(view);

        if (deployUnitList.length === 0) {
            deployUnitList.fetch();
        }

        app.router.showRoute("dashboard");
    });

    return dashboard;

});