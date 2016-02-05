'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:StationsCtrl
 * @description
 * # StationsCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('StationsCtrl', function ($scope, $http, $location, $anchorScroll, $geolocation, $cookies) {
    if($cookies.get('token') != null){
      $scope.identified = true;
    }else{
      $scope.identified = false;
    }
    $scope.reserver = function (idVehicule) {
      $http({
        url: 'http://localhost:3000/api/reservations?idVehicule='+idVehicule+'&token='+$cookies.get('token'),
        method: "GET",
        dataType: 'json',
        //contentType: "application/json",
        headers: {'Content-Type': 'application/json'},
      })
        .then(function successCallback(response) {
          if(response.data.status){
            myAlert("Le véhicule a bien été reservé !", "success");
          }else{
            myAlert("Problème de réservation, veuillez ré-essayer.", "error");
          }
        }, function errorCallback(response) {
          myAlert("Problème de réservation, veuillez ré-essayer.", "error");
        });
    };

    //Récupère les informations sur les stations
    $http({
      url: 'http://localhost:3000/api/stations',
      method: "GET",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })
      .then(function (response) {
        if (response.data.status) {
          //Récupère la géolocalisation de l'utilisateur
          $geolocation.getCurrentPosition({
            timeout: 2000,
            maximumAge: 250,
            enableHighAccuracy: true
          }).then(function (position) {
            var mapOptions;
            var userPosition = null;
            console.log(position.error);
            if (position.error != null || position.error == undefined) {
              //Si on obtien la géolocalisation, on centre sur l'utilisateur

              userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

              mapOptions = {
                zoom: 13,
                center: userPosition,
                mapTypeId: google.maps.MapTypeId.TERRAIN
              }

            } else {
              //Sinon on centre la map sur la première station trouvée
              mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(response.data.data[0].latitude, response.data.data[0].longitude),
                mapTypeId: google.maps.MapTypeId.TERRAIN
              }
            }


            //Initialise la google MAP
            $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

            //Ajoute le marker pour la position de l'utilisateur
            if (userPosition != null) {
              var marker = new google.maps.Marker({
                position: userPosition,
                map: $scope.map
              });
            }


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
              var p = new google.maps.LatLng(station.latitude, station.longitude);
              if (bornesLibres > 0) {
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  position: p,
                  title: station.numero + ' - ' + station.ville,
                  icon: '../images/marker1.png'
                });
              } else {
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  position: p,
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

            //Calcul le marker le plus proche de notre position
            if (userPosition != null) {
              if ($scope.markers.length > 0) {
                var minDistance = google.maps.geometry.spherical.computeDistanceBetween(userPosition, $scope.markers[0].position);
                var nearestStation = $scope.markers[0];
                for (var i = 0; i < $scope.markers.length; i++) {
                  if (google.maps.geometry.spherical.computeDistanceBetween(userPosition, $scope.markers[i].position) < minDistance) {
                    minDistance = google.maps.geometry.spherical.computeDistanceBetween(userPosition, $scope.markers[i].position);
                    nearestStation = $scope.markers[i];
                  }
                }
                $scope.nearestStation = nearestStation;
              }
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
          });//Fin geolocalisation

        }//Fin infomrations correctes sur les stations
        else {
          //Si on n'arrive pas à avoir les infos sur les stations
          $scope.errors = response.data.data;
        }
      },
      function (response) { // Failure : On n'arrive pas à appeler le webservice
        $scope.errors = response;
      }
    );
  });
