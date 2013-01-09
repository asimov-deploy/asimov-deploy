Asimov Deploy
=============

Asimov Deploy is a simple distributed deployment tool that enables you to deploy applications to multiple machines through a simple to use web interface. Actual deploymentents are handled on each machine by the locally installed deploy agent.

## Main Features
* Cross platform web interface for distributed deployment (written in nodejs, and single page web UI with backbone.js)
* Deploy windows services and IIS Web Applications or Sites
* Automate load balancer and view load balancer status together with deploy units / machine status.

## Windows deploy agent features
* HTTP API
* Talks to Deploy UI through HTTP
* Deploy Windows Services
* Deploy IIS Web Applications or Sites
* Execute Powershell scripts included in deploy package
* Automate load balancer (enable / disable machine in load balancer)
    * Currently only supports Alteon, but support for more is on the way.
* Execute phantomjs (& casper.js) verify & web site warmup scripts (and report progress & status to web UI)
* Deploy logs & history
* Package management
   * Hard drive / fileshare zip files (version / branch / commit can be extracted from filename)
   * Nuget support (not completed yet)
* Automatic update of deploy agent
* Automatic update of deploy agent config

## Deploy UI Features
* List deploy units from all agents that have reported in
* User can select a version to deploy to a specific machine
* Load balancer integration (optional feature)
** Shows all machines and deploy units along with the load balancer status
** Allows you to manually enable / disable machines in load balancer
* View live agent logs where agents can report in what they are doing.
* Execute verify step on each deploy unit / machine, what the verify step does is up to the agent and depends on the deploy unit type.

# Roadmap
* Documentation (Getting started Guide / Deploy Agent configuration guide)
* Demo & Project site
* Nuget package support
* Improve security
* Node.js deploy agent to enable deploy to unix machines
* Add support for more load balancers

