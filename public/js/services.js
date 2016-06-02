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
            $http.post('/getWorkLogs', user).success(function(response) {
                // $http.get('/js/data.json', user).success(function(response) {
                defer.resolve(response);
            });
            return defer.promise;
        };
    }])
    .service('commonService', ['$http', '$q', function($http, $q) {

        this.getSettings = function() {
            var settings = getItemFromLocalstorage('settings');
            if (settings)
                return settings;
            else
                return {
                    useCurrentUser: true,
                    userName: $scope.currentUser.data.name,
                    useDefaultProject: true,
                    projectName: 'RMTOOLS',
                    useDefaultDate: true,
                    startDate: convertDate(new Date()),
                    endDate: addDaysToday(10)
                };
        };

        this.getUser = function() {
            return getItemFromLocalstorage('currentUser');
        }

        this.isSettingValid = function() {
            debugger;
            var settings = this.getSettings();

            // var isStartDateValid = isValidDate(settings.startDate),
            //     isEndDateValid = isValidDate(settings.endDate);
            if (settings.userName && settings.projectName)
                return true;
            return false;

        }
        2016
    }])
    .service('worklogService', function($http, $q) {

    });
