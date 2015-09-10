module.exports = {
  staging: {
    buildEnv: 'staging',
    store: {
      type: 'redis',
      host: 'runverter.staging',
      port: 6379
    },
    assets: {
      type: 's3',
      exclude: ['.DS_Store', '*-test.js'],
      accessKeyId: 'AKIAJQH4RE42AHIISVXQ',
      secretAccessKey: process.env['AWS_ACCESS_KEY'],
      bucket: 'runverter',
      region: "eu-west-1"
    }
  },
  production: {
    buildEnv: 'production',
    store: {
      type: 'redis',
      host: 'localhost',
      port: 6380
    },
    assets: {
      type: 's3',
      exclude: ['.DS_Store', '*-test.js'],
      accessKeyId: 'AKIAJQH4RE42AHIISVXQ',
      secretAccessKey: process.env['AWS_ACCESS_KEY'],
      bucket: 'runverter',
      region: "eu-west-1"
    }
  }
};
