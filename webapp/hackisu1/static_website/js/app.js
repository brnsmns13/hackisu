'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('surveyorApp',
  [ 'surveyorApp.config'
  , 'surveyorApp.controllers.header'
  , 'surveyorApp.controllers.signin'
  , 'surveyorApp.controllers.signup'
  , 'firebase', 'ui.bootstrap', 'ngRoute']
  )
