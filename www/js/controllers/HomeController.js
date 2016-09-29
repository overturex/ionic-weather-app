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