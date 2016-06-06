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
    .service('commonService', ['$http', '$q', '$ionicPopup', function($http, $q, $ionicPopup) {

        this.showAlert = function(message, onFinish) {
            var alertPopup = $ionicPopup.alert({
                title: 'Jira Says.',
                template: message,
                buttons: [{
                    text: 'Close',
                    type: 'button-assertive'
                }]
            });

            alertPopup.then(function(res) {
                if (onFinish)
                    onFinish();
            });
        };

        this.getSettings = function() {
            var settings = getItemFromLocalstorage('settings'),
                user = this.getUser();

            if (settings)
                return settings;
            else
                return {
                    useCurrentUser: true,
                    userName: user.data.name,
                    useDefaultProject: true,
                    projectName: 'RMTOOLS',
                    useDefaultDate: true,
                    startDate: formatDateJira(new Date()),
                    endDate: addDaysToday(10)
                };
        };

        this.getUser = function() {
            return getItemFromLocalstorage('currentUser');
        }

        this.isSettingValid = function() {
            var settings = this.getSettings();

            if (settings.userName && settings.projectName)
                return true;
            return false;

        }
    }])
    .service('worklogService', function($http, $q) {

    });
