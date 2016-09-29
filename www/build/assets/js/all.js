// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

(function(){

  var app = angular.module('ionic-app', ['ionic']);

  app.config(['$httpProvider', function($httpProvider){

    $httpProvider.interceptors.push('APIInterceptor');

  }]);

  app.run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }]);


}());

(function(){

    angular.module('ionic-app').controller('HomeController', ['$scope', 'WeatherService', function($scope, WeatherService){

        $scope.WeatherList = [];
        $scope.NewCityForm = false;
        $scope.NewCity = '';

        function init(){

            WeatherService.getWeatherByGeoLocation()
                .then(function(weather){
                    if(weather.name)
                        $scope.City = weather.name;
                    $scope.WeatherList.push(weather);
                });
        };
        init();

        $scope.addCity = function(){
            $scope.NewCityForm = true;
        }

        $scope.findCity = function(){

            WeatherService.getWeatherByCity($scope.NewCity)
                .then(function(weather){
                    if(weather.name)
                        $scope.City = weather.name;
                    $scope.WeatherList.push(weather);
                    $scope.NewCity = '';
                    $scope.NewCityForm = false;
                });
        }



    }]);

}());
(function(){

    angular.module('ionic-app').service('APIInterceptor', [function(){

        var numberOfRequests = 0;
        var APIInterceptor = this;

        APIInterceptor.request = function(config){

            numberOfRequests++;

            document.getElementById('layout').style.display = 'none';
            document.getElementById('loading').style.display = 'block';

            return config;
        }

        APIInterceptor.response = function(response){

            numberOfRequests--;

            if(numberOfRequests == 0) {
                document.getElementById('layout').style.display = 'block';
                document.getElementById('loading').style.display = 'none';
            }

            return response;
        }

        APIInterceptor.responseError = function(response) {
            if (response.status === 401) {
                console.log('interceptor response error');
            }
            return response;
        };

        return APIInterceptor;
    }]);

}());
(function(){

    angular.module('ionic-app').factory('WeatherService', ['$http','$q', function($http, $q){

        var API_KEY = 'e11af50148682cadb8b81ee1e1f1df4d';
        var API_URL = 'http://api.openweathermap.org/data/2.5/weather?units=metric&APPID=' + API_KEY;
        var ICON_URL = 'http://openweathermap.org/img/w/';

        var WeatherService = {};

        WeatherService.getIconUrl = function(icon){
            return ICON_URL + icon + '.png';
        };
        WeatherService.mapData = function(data){
            var weather = {};
            weather.temperature = data.main;
            weather.icon = WeatherService.getIconUrl(data.weather[0].icon);
            weather.description = data.weather[0].description;
            weather.city = data.name;

            return weather;
        }
        WeatherService.getWeatherByCity = function(city){

            var deferred = $q.defer();

            $http({
                method: 'GET',
                url: API_URL + '&q=' + city
            }).then(function(response){
                deferred.resolve(WeatherService.mapData(response.data));
            }, function(error){
               deferred.reject(error);
            });

            return deferred.promise;
        };
        WeatherService.getWeatherByGeoLocation = function(){

            var deferred = $q.defer();

            navigator.geolocation.getCurrentPosition(function(location){
                if(location) {
                    console.log(location);
                    var lat = location.coords.latitude;
                    var lon = location.coords.longitude;

                    $http({
                        method: 'GET',
                        url: API_URL + '&lat=' + lat + '&lon=' + lon
                    }).then(function (response) {
                        deferred.resolve(WeatherService.mapData(response.data));
                    }, function (error) {
                        deferred.reject(error);
                    });
                }
                else{
                    deferred.resolve('location is not found!');
                }
            });

            return deferred.promise;
        };

        return WeatherService;

    }]);

}());