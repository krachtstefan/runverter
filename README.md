# Runverter [![Build Status](https://travis-ci.org/krachtstefan/runverter.svg?branch=master)](https://travis-ci.org/krachtstefan/runverter)

Runverter is a toolset for runners that helps to convert metrics, calculate times and speed and much more.

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
- Preview the version with a secret url like http://runverter.io/?index_key=XXXXXX.
- Activate the deployed version by copying the value of runverter:index:XXXXXX key to runverter:index:current-content.

### Requirements

- The hostname ```runverter.staging``` and ```runverter.production``` need to be added to your ```/etc/hosts``` file and point to the proper deployment server running the docker setup described in [runverter-server repository](https://github.com/krachtstefan/runverter-server).
- The assets will be uploaded to Amazon S3, so you need a bucket called ```runverter```, your Access key ID in an environment variable named ```AWS_ACCESS_KEY_ID``` and your access key in an environment variable named ```AWS_SECRET_ACCESS_KEY```. You may want to add the lines ```export AWS_SECRET_ACCESS_KEY=XXXXXX``` and ```export AWS_ACCESS_KEY_ID=XXXXXX``` to your ```~/.bash_profile``` or ```~/.zshrc```.
- Deploying to production server requires a tunnel to access the remote redis instance: ```ssh -f -L 6380:localhost:6379 -N user@runverter.production```

### Deploy

- ```ember deploy staging``` will compile the app, upload the assets and publish the index page to redis. It will return the key of the deployed version ```runverter:XXXXXXX```. Replace ``` staging```  with ```production``` for production deploy and make sure the remote redis is available on your local port ```6380```.
- preview the deploy on http://runverter.dev/?index_key=XXXXXX
- ```ember deploy:list production``` lists all available revisions in redis
- activate the version with ```ember deploy:activate production --revision=XXXXXXX```
