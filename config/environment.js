'use strict';

module.exports = function (environment) {
  let ENV = {
    i18n: {
      defaultLocale: 'en',
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
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    googleFonts: ['Open+Sans:400,700', 'Lato'],

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src':
        "'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com/ https://ssl.google-analytics.com http://www.pagespeed-mod.com",
      'font-src':
        "'self' https://fonts.googleapis.com http://fonts.gstatic.com",
      'connect-src': "'self' https://www.google-analytics.com/",
      'img-src':
        "'self' data: https://www.google-analytics.com/ http://www.google-analytics.com/",
      'style-src':
        "'self' 'unsafe-inline' https://fonts.googleapis.com http://fonts.gstatic.com",
      'media-src': "'self'",
      'manifest-src': "'self'",
    },
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
