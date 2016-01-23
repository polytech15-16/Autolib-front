'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UserLoginCtrl
 * @description
 * # UserLoginCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('UserLoginCtrl', function (user, auth) {
    var self = this;

    function handleRequest(res) {
      var token = res.data ? res.data.token : null;
      if (token) {
        console.log('JWT:', token);
      }
      self.message = res.data.message;
    }

    self.login = function () {
      user.login(self.username, self.password)
        .then(handleRequest, handleRequest)
    }
    self.register = function () {
      user.register(self.username, self.password)
        .then(handleRequest, handleRequest)
    }
    self.getQuote = function () {
      user.getQuote()
        .then(handleRequest, handleRequest)
    }
    self.logout = function () {
      auth.logout && auth.logout()
    }
    self.isAuthed = function () {
      return auth.isAuthed ? auth.isAuthed() : false
    }
  });

angular.module('app', [])
  .factory('authInterceptor', authInterceptor)
  .service('user', userService)
  .service('auth', authService)
  .constant('API', 'http://test-routes.herokuapp.com')
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });

