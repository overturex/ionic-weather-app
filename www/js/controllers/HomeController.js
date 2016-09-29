(function(){

    angular.module('ionic-app').controller('HomeController', ['$scope', 'WeatherService', 'localStorageService', function($scope, WeatherService, localStorageService){

        $scope.WeatherList = [];
        $scope.NewCityForm = false;
        $scope.NewCity = '';

        function init(){

            // if(localStorageService.get('ionic-weather-app')){
            //     console.log(localStorageService.get('ionic-weather-app'));
            //     localStorageService.clearAll();
            // }
            // else {
                WeatherService.getWeatherByGeoLocation()
                    .then(function (weather) {
                        $scope.WeatherList.push(weather);

                        localStorageService.set('WeatherList', $scope.WeatherList);
                        console.log(localStorageService.get('WeatherList'));
                    });
            //}
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