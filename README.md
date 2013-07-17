Asimov Deploy [![Build Status](https://api.travis-ci.org/asimov-deploy/asimov-deploy.png)](https://travis-ci.org/asimov-deploy/asimov-deploy)
=============

Asimov Deploy is a simple distributed deployment tool that enables you to deploy applications to multiple machines through central web interface. Actual deploymentents are handled on each machine by the locally installed deploy agent.

You can try it: [demo site](http://asimovdeploy.herokuapp.com/).

### Deploy web server / interface
* Cross platform (written in node.js, very simple install, no database required)
* List deploy units from all agents that have reported in
* User can select a version to deploy to a specific machine
* View deploy unit status (running / stopped / deploying / etc)
* View deploy logs (logs are fetched from the agents)
* Load balancer integration (optional feature)
   * Shows all machines and deploy units along with the load balancer status
   * Allows you to enable / disable machines in load balancer
* View live agent activity logs
* Execute verify/warmup steps on each deploy unit / machine, what the verify step does is up to the agent and depends on the deploy unit type.
* Authentication options
  * Anonymous
  * Local users specified in config
  * Google authentication (specify a list of allowed google account emails in config)


### Windows deploy agent
* Installs as a windows service
* HTTP API
* Talks to central deploy web interface through HTTP
* Deploy Windows Services
* Deploy IIS Web Applications or Sites
* Execute Powershell scripts included in deploy package
* Automate load balancer (enable / disable machine in load balancer)
    * Currently only supports Alteon, but support for more is on the way.
* Execute phantomjs (& casper.js) verify & web site warmup scripts (and report progress & status to central web ui)
* Deploy logs & history
* Package management
   * Hard drive / fileshare zip files (version / branch / commit can be extracted from filename)
   * Nuget support (not completed yet)
* Automatic update of deploy agent
* Automatic update of deploy agent config

### Demo
For a better understanding of how it works try the [demo](http://asimovdeploy.herokuapp.com/). The demo has faked agents, but gives you a good understanding how Asimov Deploy looks and behaves.

### Philosophy
Even though there is a central web interface, the core functionallity is handled by the deploy agents that are installed locally on each machine that has applications running that you want to update. The agents registers themselves with the central deploy web server which in turn query the agents for information (list deploy units, status of deploy units, what versions are available for deployment etc).

## Roadmap
* Documentation (Getting started Guide / Deploy Agent configuration guide)
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