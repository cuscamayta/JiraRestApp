app.service('commonService', ['$http', '$q', '$ionicPopup', function($http, $q, $ionicPopup) {

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


        if (!user && !settings) return null;

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

    this.isUserLogged = function() {
        var user = this.getUser();
        return user ? true : false;
    }

    this.isSettingValid = function() {
        var settings = this.getSettings();
        if (!settings) return false;

        if (settings.userName && settings.projectName)
            return true;
        return false;

    }
}])
