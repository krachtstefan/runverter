const accessKeyId = process.env.RUNVERTER_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.RUNVERTER_AWS_SECRET_ACCESS_KEY;

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
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,json}',
    },
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
        '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,json}',
    },
  },
};

module.exports = function (deployTarget) {
  if (Object.keys(deployConfig).includes(deployTarget) === false) {
    throw new Error('Invalid deployTarget ' + deployTarget);
  }
  return deployConfig[deployTarget];
};
