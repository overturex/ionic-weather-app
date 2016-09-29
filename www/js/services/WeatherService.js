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