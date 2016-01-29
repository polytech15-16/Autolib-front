'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:VehiculesCtrl
 * @description
 * # VehiculesCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('VehiculesCtrl', function ($scope, $http) {
    $http({
      url: 'http://localhost:3000/api/vehicules',
      method: "GET",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
      .then(function (response) {
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

          var createMarker = function (info) {

            var marker = new google.maps.Marker({
              map: $scope.map,
              position: new google.maps.LatLng(info.lat, info.long),
              title: info.city,
              icon: '../images/marker.png'
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
              infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
              infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);
          }

          var i = 0;
          console.log(response.data.data);
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
            createMarker(city);

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
        }
        else {
          $scope.errors = response.data.data;
        }
      },
      function (response) { // Failure : On n'arrive pas à appeler le webservice
        $scope.errors = response;
      });
  });
