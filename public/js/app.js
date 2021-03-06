var app = angular.module('jiraRestApp', ['ionic', 'pickadate'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginController'
    })

    .state('tab.timesheet', {
            url: '/timesheet',
            views: {
                'tab-timesheet': {
                    templateUrl: 'templates/tab-timesheet.html',
                    controller: 'timeSheetController'
                }
            }
        })
        .state('tab.timesheet-detail', {
            url: '/timesheet/:key',
            views: {
                'tab-timesheet': {
                    templateUrl: 'templates/timesheet-detail.html',
                    controller: 'timesheetDetailController'
                }
            }
        })

    .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/tab-setting.html',
                    controller: 'settingController'
                }
            }
        })
        .state('tab.logwork', {
            url: '/logwork',
            views: {
                'tab-logwork': {
                    templateUrl: 'templates/tab-logwork.html',
                    controller: 'workLogController'
                }
            }
        });

    $urlRouterProvider.otherwise('/tab/timesheet');

});
