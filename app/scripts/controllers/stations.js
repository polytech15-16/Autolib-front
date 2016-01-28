'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:StationsCtrl
 * @description
 * # StationsCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('StationsCtrl', function ($scope, $http, $location, $anchorScroll) {
    $http({
      url: 'http://localhost:3000/api/stations',
      method: "GET",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
      .then(function (response) {
        if (response.data.status) {

          //On centre la map sur la première station trouvée
          var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(response.data.data[0].latitude, response.data.data[0].longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
          }

          //Initialise la google MAP
          $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

          $scope.markers = [];

          var infoWindow = new google.maps.InfoWindow();

          //On créer la fonction pour créer les markers pour chaque station
          var createMarker = function (station) {
//Calcul les bornes libres
            var bornesLibres = 0;
            var bornesOccupees = 0;
            for (var i = 0; i < station.Bornes.length; i++) {
              if (station.Bornes[i].etatBorne) {
                bornesLibres++;
              } else {
                bornesOccupees++;
              }
            }

            //Si il y a des bornes libres, on affiche l'icon verte, sinon la rouge
            if (bornesLibres > 0) {
              var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(station.latitude, station.longitude),
                title: station.numero + ' - ' + station.ville,
                icon: '../images/marker1.png'
              });
            } else {
              var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(station.latitude, station.longitude),
                title: station.numero + ' - ' + station.ville,
                icon: '../images/marker2.png'
              });
            }


            marker.content = '<div class="infoWindowContent">' + station.adresse + '</br>' + station.code_postal + ' ' + station.ville + '</div>';
            marker.station = station;

            marker.bornes = '<div class=""><p>Bornes occupées :' + bornesOccupees + '</p><p>Bornes libres :' + bornesLibres + '</p></div>';

            google.maps.event.addListener(marker, 'click', function () {
              infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content + '<hr>' + marker.bornes);
              infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);
          }

          //Pour chaque station, on créer un marker sur la map
          for (var i = 0; i < response.data.data.length; i++) {
            createMarker(response.data.data[i]);
          }


          $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');

            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('top');

            // call $anchorScroll()
            $anchorScroll();
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
