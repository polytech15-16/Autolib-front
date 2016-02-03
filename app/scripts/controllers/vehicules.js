'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:VehiculesCtrl
 * @description
 * # VehiculesCtrl
 * Controller of the angularApp
 */
 var vehiculesApp = angular.module('angularApp');

 vehiculesApp.controller('VehiculesCtrl', function ($scope, $http, $routeParams, $location) {

    // initial value of creation/edition vehicule form
    $scope.vehicule = {};

    // reinitialize form
    $scope.reset = function() {
      $scope.vehicule = {
        RFID: '',
        Disponibilite: '',
        etatBatterie: '',
        latitude: '',
        longitude: '',
        type_vehicule: '',
      };
    };

    $scope.create = function(vehicule){
      $http({
        url: 'http://localhost:3000/api/vehicules',
        method: "POST",
        dataType: 'JSON',
        headers: {'Content-Type': 'application/json'},
        data: vehicule
      }).then(function (response) {
        if (response.data.status) {
          myAlert("Véhicule créé avec succès", "success");
        } else {
          $scope.errors = response.data.data;
          myAlert(response.data.data, "danger");
        }
      });
    };

    // Return a specific contact for edition
    $scope.edit = function(){
      var id = $routeParams.id;
    };

    // update a vehicule
    $scope.update = function(vehicule) {
      $http({
        url: 'http://localhost:3000/api/vehicules/'+vehicule.idVehicule,
        method: "PUT",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: vehicule
      }).then(function (response) {
        if (response.data.status) {

        } else {
          $scope.errors = response.data.data;
        }
      });
    };

    // save a vehicule
    $scope.save = function(vehicule){
      if(typeof vehicule.idVehicule !== 'undefined'){
        $scope.update(vehicule);
      } else {
        $scope.create(vehicule);
      }
      $scope.reset();
      $location.path('/vehicules');
    };

    $scope.delete = function(id, confirmation){
      confirmation = (typeof confirmation !== 'undefined') ? confirmation : true;
      if (confirmDelete(confirmation, id)) {
        $http({
          url: 'http://localhost:3000/api/vehicules/'+id,
          method: "DELETE",
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function (response) {
          if (response.data.status) {
            $scope.init();
            myAlert("Véhicule supprimé avec succès", "success");
          } else {
            $scope.errors = response.data.data;
            myAlert(response.data.data, "danger");
          }
        });
      }
    };

    var confirmDelete = function(confirmation, id){
      return confirmation ? confirm('This action is irreversible. Do you want to delete vehicule n°' + id + ' ?') : true;
    };


    $scope.init = function(){
      // on va chercher les types de véhicules
          $http({
        url: 'http://localhost:3000/api/type_vehicules',
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      }).then(function (response) {
        if (response.data.status) {
          $scope.types_vehicule = response.data.data;
        }
      });

      // on va chercher les véhicules et on crée la map
      $http({
        url: 'http://localhost:3000/api/vehicules',
        method: "GET",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      }).then(function (response) {

        if (response.data.status) {

          var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(response.data.data[0].latitude, response.data.data[0].longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
          }

          $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
          $scope.markers = [];
          $scope.infos = [];

          var infoWindow = new google.maps.InfoWindow();

          var createMarker = function (info, img) {
            var marker = new google.maps.Marker({
              map: $scope.map,
              position: new google.maps.LatLng(info.lat, info.long),
              title: info.city,
              icon: img
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
              infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
              infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);
          }

          var i = 0;
          //Pour chaque vehicule, on créer un marker sur la map
          for (i = 0; i < response.data.data.length; i++) {
            var id = response.data.data[i].idVehicule;
            var city = {
              city: id + ' - ' + response.data.data[i].RFID,
              desc: "Etat : " + response.data.data[i].Disponibilite + "</br>"
              + "Type : " + response.data.data[i].Type_vehicule.type_vehicule + "</br>"
              + "<button onclick=\"$('.vehicule_info').hide();$('.vehicule_info#" + id + "').show();\">Voir plus</button>",
              lat: response.data.data[i].latitude,
              long: response.data.data[i].longitude,
            };
            var img;
            if(response.data.data[i].Disponibilite === "LIBRE"){
              img = '../images/marker1.png';
            } else {
              img = '../images/marker2.png';
            }
            createMarker(city, img);

            var info = [];
            info.id = id;
            info.RFID = response.data.data[i].RFID;
            info.Disponibilite = response.data.data[i].Disponibilite;
            info.categorie = response.data.data[i].Type_vehicule.categorie;
            info.type_vehicule = response.data.data[i].Type_vehicule.type_vehicule;
            info.batterie = response.data.data[i].etatBatterie;

            $scope.infos.push(info);
          }

          $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
          }

        } else {
          $scope.errors = response.data.data;
        }
      },
      function (response) { // Failure : On n'arrive pas à appeler le webservice
      $scope.errors = response;
    });
};

$scope.init();

});
