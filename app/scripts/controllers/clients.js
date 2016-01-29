'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:ClientsCtrl
 * @description
 * # ClientsCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('ClientsCtrl', function ($scope, $http) {
    $http({
      url: 'http://localhost:3000/api/clients',
      method: "GET",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
      .then(function (response) {//Appel webservice reussi
        if (response.data.status) {//On a les résultat
          $scope.clients = response.data.data;
        }
        else {//On n'obtient pas résultat
          $scope.errors = response.data.data;
        }
      },
      function (response) { // Failure : On ne peut pas appeler le webservice, on génère une erreur
        console.log(response);
        //TODO voir comment traiter les erreurs avec le webservice
        $scope.errors = response;
      });
  });
