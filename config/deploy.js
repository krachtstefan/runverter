const deployConfig = {
  production: {
    s3KeyId: process.env.RUNVERTER_AWS_ACCESS_KEY_ID,
    s3Key: process.env.RUNVERTER_AWS_SECRET_ACCESS_KEY,
    mainBucket: {
      name: 'staging.runverter.io',
      region: 'eu-central-1',
    },
    assetUrl: 'http://s.runverter.io/',
    assetBucket: {
      name: 's.runverter.io',
      region: 'eu-central-1',
    },
  },
};

// eventuell app cache nach dem aktivieren hochladen
// http://ember-cli-deploy.com/docs/v1.0.x/pipeline-hooks/
// update docs
module.exports = function (deployTarget) {
  if (Object.keys(deployConfig).includes(deployTarget) === false) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }
  const { s3KeyId, s3Key, mainBucket, assetBucket, assetUrl } = deployConfig[
    deployTarget
  ];

  console.log('🎉', mainBucket.name, mainBucket.region);
  var ENV = {
    's3-index': {
      accessKeyId: s3KeyId,
      secretAccessKey: s3Key,
      bucket: mainBucket.name,
      region: mainBucket.region,
    },
    s3: {
      accessKeyId: s3KeyId,
      secretAccessKey: s3Key,
      bucket: assetBucket.name,
      region: assetBucket.region,
      filePattern:
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,appcache,json}',
    },
    'html-manifest': {
      filename: 'manifest.appcache',
      manifestRoot: '/',
      prependPath: assetUrl,
      excludePaths: ['index.html'],
      includePaths: [
        'https://fonts.googleapis.com/css?family=Open+Sans:400,700',
        'https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf',
      ],
      network: ['*'],
    },
  };

  return ENV;
};
