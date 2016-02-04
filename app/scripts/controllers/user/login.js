'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UserLoginCtrl
 * @description
 * # UserLoginCtrl
 * Controller of the angularApp
 */


angular.module('angularApp')
  .controller('UserLoginCtrl', function ($scope, $cookies, user, auth) {

    function handleRequest(res) {
      var token = res.data ? res.data.token : null;
      self.message = res.data.message;
    };

    $scope.login = function () {
      user.login($scope.user.login, $scope.user.password)
        .then(handleRequest, handleRequest);
    };

    $scope.reset = function () {
      $scope.user = angular.copy($scope.master);
    };
    $scope.register = function () {
      user.register($scope.login, $scope.password)
        .then(handleRequest, handleRequest)
    };

    $scope.getQuote = function () {
      user.getQuote()
        .then(handleRequest, handleRequest)
    };

    $scope.logout = function () {
      auth.logout && auth.logout()
    };

    $scope.isAuthed = function () {
      return auth.isAuthed();
    }

  }).factory('authInterceptor', authInterceptor)
  .service('user', userService)
  .service('auth', authService)
  .constant('API', 'http://localhost:3000/api/')
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });



