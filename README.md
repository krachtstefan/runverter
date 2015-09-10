#Runverter

[Runverter](http://runverter.io) is a web app providing a set of tools to convert different running metrics.

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
- Publish the index.html page in a dedicated Redis key (like runverter:XXXXXX)
- Preview the version with a secret url like http://runverter.io/?index_key=XXXXXX
- Activate the deployed version by copying the value of runverter:XXXXXX key to runverter:current

### Requirements

- The hostname ```runverter.staging```  and ```runverter.production``` need to be added to your ```/etc/hosts``` file to point to the proper deployment server. 
- The assets will be uploaded to Amazon S3, so you need a bucket called ```runverter``` and your access key in a environment variable named ```AWS_ACCESS_KEY```. You may want to add the line ```export AWS_ACCESS_KEY=XXXXXX``` to your ```~/.bash_profile``` or ```~/.zshrc```.
- Deploying to production server requires a tunnel to access the remote redis instance: ```ssh -f -L 6380:localhost:6379 -N user@runverter.production```

### Deploy

- ```ember deploy --environment staging``` will compile the app, upload the assets and publish the index page to redis. It will return the key of the deployed version ```runverter:XXXXXXX```. Replace ``` staging```  with ```production``` for production deploy and make sure the remote redis is available on your local port ```6380```. 
- preview the deploy on http://runverter.dev/?index_key=XXXXXX
- activate the version with ```ember deploy:activate --revision runverter:XXXXXXX --environment staging```



