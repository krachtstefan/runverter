'use strict';

module.exports = function(environment) {
  let ENV = {
    i18n : {
      defaultLocale: 'en'
    },

    modulePrefix: 'runverter',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    googleFonts: [
      'Open+Sans:400,700',
      'Lato'
    ],

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' https://www.google-analytics.com",
      'font-src': "'self' https://fonts.googleapis.com http://fonts.gstatic.com",
      'connect-src': "'self'",
      'img-src': "'self' data:",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com http://fonts.gstatic.com",
      'media-src': "'self'",
      'manifest-src': "'self'"
    },
    manifest : {
      enabled: true,
      appcacheFile: "/manifest.appcache",
      excludePaths: ['index.html', 'tests/index.html', 'testem.js'],
      includePaths: ['https://fonts.googleapis.com/css?family=Open+Sans:400,700', 'https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf'],
      prepend: "https://s.runverter.io/",
      showCreateDate: true
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {

  }

  return ENV;
};
