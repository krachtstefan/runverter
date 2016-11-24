var VALID_DEPLOY_TARGETS = [
  'production',
  'staging',
];

module.exports = function(deployTarget) {

  if(deployTarget === 'production') {
    var redisUrl = 'redis://localhost:6380'
  }else if(deployTarget === 'staging') {
    var redisUrl = 'redis://localhost:6381'
  }

  var ENV = {
    build: {},
    redis : {
      allowOverwrite: true,
      keyPrefix: 'runverter:index',
      url: redisUrl,
    },
    s3 : {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 's.runverter.io',
      region: 'eu-central-1',
      filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,appcache}'
    }
  };

  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }
  return ENV;
};
