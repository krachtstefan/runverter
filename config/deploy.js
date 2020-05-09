const deployConfig = {
  production: {
    s3KeyId: process.env.RUNVERTER_AWS_ACCESS_KEY_ID,
    s3Key: process.env.RUNVERTER_AWS_SECRET_ACCESS_KEY,
    mainBucket: {
      name: 'staging.runverter.io',
      region: 'eu-central-1',
    },
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
  const { s3KeyId, s3Key, mainBucket, assetBucket } = deployConfig[
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
  };

  return ENV;
};
