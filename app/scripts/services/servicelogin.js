'use strict';

/**
 * @ngdoc service
 * @name angularApp.serviceLogin
 * @description
 * # serviceLogin
 * Factory in the angularApp.
 */
angular.module('angularApp')
  .factory('serviceLogin', function ($http) {
    return {
      authInterceptor: function (API, auth) {
        return {
          // automatically attach Authorization header
          request: function (config) {
            return config;
          },
          // If a token was sent back, save it
          response: function (res) {
            return res;
          },
        }
      },
      authService: function ($window) {
        var self = this;

        // Add JWT methods here
      },

      userService: function ($http, API, auth) {
        var self = this;
        self.getQuote = function () {
          return $http.get(API + '/auth/quote')
        }

        // add authentication methods here
      }
    }
  });

