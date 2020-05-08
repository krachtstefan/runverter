var VALID_DEPLOY_TARGETS = [
  'production',
  'staging',
  'production-appcache',
  'staging-appcache',
];

module.exports = function (deployTarget) {
  if (deployTarget === 'production' || deployTarget === 'production-appcache') {
    var deployUser = process.env.RUNVERTER_DEPLOY_USER_PRODUCTION;
    var deployHost = 'runverter.production';
  } else if (
    deployTarget === 'staging' ||
    deployTarget === 'staging-appcache'
  ) {
    var deployUser = process.env.RUNVERTER_DEPLOY_USER_STAGING;
    var deployHost = 'runverter.staging';
  }

  var ENV = {
    redis: {
      allowOverwrite: true,
      keyPrefix: 'runverter:index',
    },
    s3: {
      accessKeyId: process.env.RUNVERTER_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.RUNVERTER_AWS_SECRET_ACCESS_KEY,
      bucket: 's.runverter.io',
      region: 'eu-central-1',
      filePattern:
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,appcache,json}',
    },
    scp: {
      username: deployUser,
      host: deployHost,
      path: '~/runverter/',
      exclude: '{*.html,*.png,*.svg,*.txt,*.xml,*.ico,assets,images}',
    },
    'ssh-tunnel': {
      username: deployUser,
      host: deployHost,
    },
  };

  if (
    deployTarget === 'production-appcache' ||
    deployTarget === 'staging-appcache'
  ) {
    ENV.pipeline = {
      disabled: {
        allExcept: ['build', 'gzip', 'manifest', 'scp'],
      },
    };
  }

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }
  return ENV;
};
