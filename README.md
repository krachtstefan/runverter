# Runverter

Runverter is a toolset for runners that helps to convert metrics, calculate times and speed and much more. For more information about this project please check out the [detailed blog post](https://stefankracht.de/p/runverter).

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

The app is hosted on two aws buckets. One serves the main website at runverter.io and the other one provides all assets via s.runverter.io. There's is also an additional staging.runverter.io bucket for testing releases. This also uses the assets from s.runverter.io, since all files have a unique hashed filename.

The deploy process itself is done with [ember-cli-deploy](https://github.com/ember-cli/ember-cli-deploy) and the [ember-cli-deploy-s3-pack](https://github.com/Gaurav0/ember-cli-deploy-s3-pack) plugin.

### Workflow of a deploy

As described in this [video](https://youtu.be/MT0LKcVh6Rw) the deployment process is a combination of the following steps:

- Compile the ember app locally.
- Upload all files to the Amazon S3 asset bucket.
- upload the index.html with a hidden filename like `index.html:XXXXXX`.
- Preview the version with a secret url like `https://runverter.io/index.html:XXXXXX`.
- Activate the deployed version by copying the content of `index.html:XXXXXX` to the `index.html` file.
- Since the `manifest.appcache` can not be delivered via CDN and must be available under the same origin as the app, we upload the manifest.appcache as the last step of the deploy routine to the S3 bucket where the index.html is hosted (not the asset bucket).
- it might need some time until all apps are recognizing the new manifest
- open [chrome://appcache-internals/](chrome://appcache-internals/) in chrome to inspect the stored appcache and clear it manually

### Requirements

- The assets will be uploaded to Amazon S3, so you need a bucket called `s.runverter.io`, `staging.runverter.io`, `runverter.io`.
- All these buckets need to be public and connected with the related domain via amazon cloudfront.
- There are some environment variables that need to be present to deploy the app. Environment variables can be defined by adding lines like `export AWS_SECRET_ACCESS_KEY=XXXXXX` to your `~/.bash_profile` or `~/.zshrc`.
  - `RUNVERTER_AWS_ACCESS_KEY_ID`: Access key ID to access all s3 buckets.
  - `RUNVERTER_AWS_SECRET_ACCESS_KEY`: Access key to access all s3 buckets.

### Staging deploy

- `ember deploy staging` will compile the app, upload the assets and publish the index page on the `staging.runverter.io` bucket. It will display the key of the deployed version like `XXXXXXX`.
- preview the build on http://staging.runverter.io/index.html:XXXXXX.
- `ember deploy:list staging` lists all available revisions.
- activate the version with `ember deploy:activate staging --revision=XXXXXXX`.
- at last we deploy the `manifest.appcache file` with `ember deploy staging-appcache`

### Production deploy

- Repeat the steps described for staging but replace `staging` with `production`.
