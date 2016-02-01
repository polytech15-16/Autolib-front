'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:UserRegisterCtrl
 * @description
 * # UserRegisterCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('UserRegisterCtrl', function ($scope, $http) {
    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };

    $scope.reset = function () {
      $scope.user = angular.copy($scope.master);
    };

    $scope.register = function () {
      var client = {
        'nom': $scope.user.nom,
        'prenom': $scope.user.prenom,
        'date_naissance': $scope.user.date_naissance
      };

      $http({
        url: 'http://localhost:3000/api/client',
        method: "POST",
        dataType: 'json',
        contentType: "application/json",
        data: client,
      })
        .then(function successCallback(response) {
          if (response.data.status) {
            $scope.reset();
            $scope.addAlert("Le client a bien été enregistré !", "success");
          } else {
            $scope.addAlert("Une erreur est survenue", "error");
          }
        }, function errorCallback(response) {
          $scope.addAlert("Une erreur est survenue", "error");
        });
    };

    $scope.alerts = [];

    $scope.addAlert = function (msg, type) {
      $scope.alerts.push({msg: msg, type: type});
    };

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };


    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.popup2 = {
      opened: false
    };
  });
