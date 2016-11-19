import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let Runverter;

Ember.MODEL_FACTORY_INJECTIONS = true;

Runverter = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(Runverter, config.modulePrefix);

export default Runverter;
