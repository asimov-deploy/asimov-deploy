define([], function() {

	return [
		{
			"name": "TIME-MACHINE",
			"loadBalancerId": 11,
			"units": [
				{
					"name": "UberWeb",
					"url": "http://server1:8822",
					"version": "13.02.0.96",
					"branch": "paymentmatching",
					"status": "NA",
					"lastDeployed": "Deployed ",
					"hasDeployParameters": true,
					"actions": []
				},
				{
					"name": "TouchWeb",
					"url": null,
					"version": "0.0.0.0",
					"branch": null,
					"status": "Running",
					"lastDeployed": "Deployed 2013 years ago",
					"hasDeployParameters": false,
					"actions": [
						"Verify",
						"Start",
						"Stop"
					]
				}
			]
		},
		{
			"name": "STAGING",
			"loadBalancerId": 10,
			"units": [
				{
					"name": "UberWeb",
					"url": "http://server2:8822",
					"version": "13.22.0.71",
					"branch": "metrics",
					"status": "NA",
					"lastDeployed": "Deployed 2 months ago",
					"hasDeployParameters": true,
					"actions": []
				},
				{
					"name": "TouchWeb",
					"url": null,
					"version": "0.0.0.0",
					"branch": null,
					"status": "Running",
					"lastDeployed": "Deployed 2013 years ago",
					"hasDeployParameters": false,
					"actions": [
						"Verify",
						"Start",
						"Stop"
					]
				}
			]
		},
		{
			"name": "AGENT-03",
			"loadBalancerId": 11,
			"units": [
				{
					"name": "MetricsApp",
					"url": "http://AGENT-03:8822",
					"version": "1.0.1.0",
					"branch": "metrics",
					"status": "NA",
					"lastDeployed": "Deployed 2 months ago",
					"hasDeployParameters": true,
					"actions": []
				}
			]
		}
	];

});

