(function(){

    angular.module('ionic-app').controller('HomeController', ['$scope', 'WeatherService', 'localStorageService', function($scope, WeatherService, localStorageService){

        $scope.WeatherList = [];
        $scope.NewCityForm = false;
        $scope.NewCity = '';
        $scope.shouldShowDelete = false;

        function init(){

            if(localStorageService.get('WeatherList')){
                var weatherList = localStorageService.get('WeatherList');
                console.log(weatherList);

                weatherList.forEach(function(weather){
                   WeatherService.getWeatherByCity(weather.city)
                       .then(function(newWeather){
                          $scope.WeatherList.push(newWeather);
                       });
                });
            }
            else{
                WeatherService.getWeatherByGeoLocation()
                    .then(function (weather) {
                        $scope.WeatherList.push(weather);
                        localStorageService.set('WeatherList', $scope.WeatherList);
                    });
            }
        }

        init();

        $scope.addCity = function(){
            $scope.NewCityForm = true;
        };

        $scope.findCity = function(){

            WeatherService.getWeatherByCity($scope.NewCity)
                .then(function(weather){
                    if(weather.name)
                        $scope.City = weather.name;
                    $scope.WeatherList.push(weather);
                    $scope.NewCity = '';
                    $scope.NewCityForm = false;
                    localStorageService.set('WeatherList', $scope.WeatherList);
                });
        }

        $scope.removeWeather = function(index){
            console.log(index);
            $scope.WeatherList.splice(index, 1);
            localStorageService.set('WeatherList', $scope.WeatherList);
        }
    }]);

}());