module.exports = function(environment){
  var ENV = {
    'redis' : {
        url: 'redis://runverter.staging:6379',
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
