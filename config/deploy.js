module.exports = {
  development: {
    buildEnv: 'development',
    store: {
      type: 'redis',
      host: 'docker.dev',
      port: 6379
    },
    assets: {
      type: 's3',
      gzip: false,
      gzipExtensions: ['js', 'css', 'svg'], // if undefined, js, css & svg files are gziped
      exclude: ['.DS_Store', '*-test.js'],
      accessKeyId: 'AKIAJQH4RE42AHIISVXQ',
      secretAccessKey: process.env['AWS_ACCESS_KEY'],
      bucket: 'runverter-development',  
      region: "eu-west-1"
    }
  }
};