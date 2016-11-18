module.exports = function(environment){

  if(environment === 'production') {
    var redisUrl = 'redis://runverter.production:6380'
  }else if(environment === 'staging') {
    var redisUrl = 'redis://runverter.staging:6379'
  }

  var ENV = {
    'redis' : {
        url: redisUrl,
    },
    's3' : {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'runverter',
      region: 'eu-west-1'
    }
  };
  return ENV;
};
