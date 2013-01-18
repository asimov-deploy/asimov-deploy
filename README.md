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
* View deploy unit status (running / stopped / deploying / etc)
* View deploy logs (logs are fetched from the agents)
* Load balancer integration (optional feature)
   * Shows all machines and deploy units along with the load balancer status
   * Allows you to enable / disable machines in load balancer
* View live agent logs where agents can report in what they are currently doing.
* Execute verify step on each deploy unit / machine, what the verify step does is up to the agent and depends on the deploy unit type.

## Screenshots
Until a full project page is created and a demo site, you can view these screenshots to get an idea of how it looks and behaves.
* [Deploy dashboard](https://raw.github.com/asimov-deploy/asimov-deploy/gh-pages/images/screenshots/screenshot-1.png)
* [Version selection](https://github.com/asimov-deploy/asimov-deploy/raw/gh-pages/images/screenshots/screenshot-2-select-version.PNG)
* [Deploy dialog](https://github.com/asimov-deploy/asimov-deploy/raw/gh-pages/images/screenshots/screenshot-3-confirm-deploy.PNG)
* [Load balancer action](https://github.com/asimov-deploy/asimov-deploy/raw/gh-pages/images/screenshots/screenshot-4-loadbalancer.PNG)

## Roadmap
* Documentation (Getting started Guide / Deploy Agent configuration guide)
* Demo & Project site
* Nuget package support
* Improve security
* Node.js deploy agent to enable deploy to unix machines
* Add support for more load balancers

## Bugs and Feedback
For bugs, questions and discussions please use the [Github Issues](asimov-deploy/issues).

## LICENSE
Copyright 2013 Ebay Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.