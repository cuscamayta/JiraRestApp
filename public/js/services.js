angular.module('starter.services', [])
    .service('userService', ['$http', '$q', function($http, $q) {

        this.signIn = function(user) {
            var defer = $q.defer();
            $http.post('/login', user).success(function(response) {
                defer.resolve(response);
            });
            return defer.promise;
        };
    }])
    .service('timeSheetService', ['$http', '$q', function($http, $q) {

        this.getTimeSheet = function(user) {
            var defer = $q.defer();
            // $http.post('/getWorkLogs', user).success(function(response) {
            $http.get('/js/data.json', user).success(function(response) {
                defer.resolve(response);
            });
            return defer.promise;
        };
    }])
    .service('worklogService', function($http, $q) {

    });
