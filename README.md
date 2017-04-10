# Runverter [![Build Status](https://travis-ci.org/krachtstefan/runverter.svg?branch=master)](https://travis-ci.org/krachtstefan/runverter)

Runverter is a toolset for runners that helps to convert metrics, calculate times and speed and much more. For more information about this project please check out the [detailed blog post](http://stefankracht.de/news/runverter).

## Installation

```
$ git clone https://github.com/krachtstefan/runverter.git
$ cd runverter
$ npm install && bower install
```

## Start the app

Run `ember server` and open [http://localhost:8000](http://localhost:8000).

## Run Tests

Run `ember test` for a one time test and `ember test --server` to trigger tests on every file change.

## Deploy

The server setup is maintained in the [runverter-server repository](https://github.com/krachtstefan/runverter-server) and the deploy process is done with [ember-cli-deploy](https://github.com/ember-cli/ember-cli-deploy).

### Workflow of a deploy

As described in this [video](https://youtu.be/MT0LKcVh6Rw) the deployment process is a combination of the following steps:

- Compile the ember app locally.
- Upload all files to Amazon S3 asset server.
- Publish the index.html page in a dedicated Redis key (like runverter:index:XXXXXX).
- Preview the version with a secret url like https://runverter.io/?index_key=XXXXXX.
- Activate the deployed version by copying the value of runverter:index:XXXXXX key to runverter:index:current-content.
- Since the ```manifest.appcache``` can not be delivered via CDN and must be available under the same origin as the app, we additionally upload the static files to the docker machine.

### Requirements

- The hostname ```runverter.staging``` and ```runverter.production``` need to be added to your ```/etc/hosts``` file and point to the proper deployment server running the docker setup described in [runverter-server repository](https://github.com/krachtstefan/runverter-server).
- The assets will be uploaded to Amazon S3, so you need a bucket called ```s.runverter.io```.
- There are a bunch of environment variables that need to be present to deploy the app. Environment variables can be defined by adding lines like ```export AWS_SECRET_ACCESS_KEY=XXXXXX``` to your ```~/.bash_profile``` or ```~/.zshrc```.
  - ```RUNVERTER_AWS_ACCESS_KEY_ID```: Access key ID to access ```s.runverter.io``` bucket.
  - ```RUNVERTER_AWS_SECRET_ACCESS_KEY```: Access key to access ```s.runverter.io``` bucket.
  - ```RUNVERTER_DEPLOY_USER_STAGING```: SSH user to deploy on ```runverter.staging```.
  - ```RUNVERTER_DEPLOY_USER_PRODUCTION```: SSH user to deploy on ```runverter.production```.



### Staging deploy
- ```ember deploy staging``` will compile the app, upload the assets and publish the index page to redis. It will display the key of the deployed version like ```XXXXXXX```.
- preview the build on http://runverter.staging/?index_key=XXXXXX.
- ```ember deploy:list staging``` lists all available revisions from redis.
- activate the version with ```ember deploy:activate staging --revision=XXXXXXX```.
- at last we deploy the ```manifest.appcache file``` with ```ember deploy staging-appcache```

### Production deploy
- Repeat the steps described for staging but replace ```staging``` with ```production```.
