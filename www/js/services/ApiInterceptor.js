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