'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */
angular.module('angularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/stations', {
        templateUrl: 'views/stations.html',
        controller: 'StationsCtrl',
        controllerAs: 'stations'
      })
      .when('/clients', {
        templateUrl: 'views/clients.html',
        controller: 'ClientsCtrl',
        controllerAs: 'clients'
      })
      .when('/user/login', {
        templateUrl: 'views/user/login.html',
        controller: 'UserLoginCtrl',
        controllerAs: 'user/login'
      })
      .when('/user/register', {
        templateUrl: 'views/user/register.html',
        controller: 'UserRegisterCtrl',
        controllerAs: 'user/register'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
