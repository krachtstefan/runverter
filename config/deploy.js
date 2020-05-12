const accessKeyId = process.env.RUNVERTER_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.RUNVERTER_AWS_SECRET_ACCESS_KEY;
const sharedConfig = {
  'html-manifest': {
    filename: 'manifest.appcache',
    manifestRoot: '',
    prependPath: 'http://s.runverter.io/',
    excludePaths: ['index.html'],
    includePaths: [
      'https://fonts.googleapis.com/css?family=Open+Sans:400,700',
      'https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf',
    ],
    network: ['*'],
  },
};

const deployConfig = {
  production: {
    's3-index': {
      accessKeyId,
      secretAccessKey,
      bucket: 'runverter.io',
      region: 'eu-central-1',
    },
    ['s3']: {
      accessKeyId,
      secretAccessKey,
      bucket: 's.runverter.io',
      region: 'eu-central-1',
      filePattern:
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,appcache,json}',
    },
    ...sharedConfig,
  },
  'production-appcache': {
    ['s3']: {
      accessKeyId,
      secretAccessKey,
      bucket: 'runverter.io',
      region: 'eu-central-1',
      filePattern: '**/*.appcache', // only upload .appcache
    },
    pipeline: {
      disabled: {
        allExcept: ['build', 'gzip', 'html-manifest', 's3'],
      },
    },
    ...sharedConfig,
  },
  staging: {
    's3-index': {
      accessKeyId,
      secretAccessKey,
      bucket: 'staging.runverter.io',
      region: 'eu-central-1',
    },
    ['s3']: {
      accessKeyId,
      secretAccessKey,
      bucket: 's.runverter.io',
      region: 'eu-central-1',
      filePattern:
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,appcache,json}',
    },
    ...sharedConfig,
  },
  'staging-appcache': {
    ['s3']: {
      accessKeyId,
      secretAccessKey,
      bucket: 'staging.runverter.io',
      region: 'eu-central-1',
      filePattern: '**/*.appcache', // only upload .appcache
    },
    pipeline: {
      disabled: {
        allExcept: ['build', 'gzip', 'html-manifest', 's3'],
      },
    },
    ...sharedConfig,
  },
};

module.exports = function (deployTarget) {
  if (Object.keys(deployConfig).includes(deployTarget) === false) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }
  return deployConfig[deployTarget];
};
