angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, userService, $location) {
        $scope.signIn = function(user) {
            var response = userService.signIn(user);
            response.then(function(data) {
                console.log('data');
                console.log(data);
                if (data.hasBeenLogged)
                    $location.path('/tab');
                else
                    alert('user or password incorrect');
            });
        };
    })
    .controller('TimeSheetController', function($scope, timeSheetService, Chats) {
        init();

        $scope.chats = Chats.all();

        function enumerateDaysBetweenDates(startDate, endDate) {
            var dates = [];

            var currDate = startDate.clone().startOf('day');
            var lastDate = endDate.clone().startOf('day');

            dates.push(startDate.format('D/M/YYYY'));

            while (currDate.add('days', 1).diff(lastDate) < 0) {
                dates.push(moment(currDate.clone().toDate()).format('D/M/YYYY'));
            }

            dates.push(endDate.format('D/M/YYYY'));
            return dates;
        }



        function init() {
            var fromDate = moment(new Date('05/03/2016')),
                toDate = moment(new Date('05/20/2016'));
            var datesSprint = enumerateDaysBetweenDates(fromDate, toDate);

            var response = timeSheetService.getTimeSheet();
            response.then(function(data) {
                loadTimeSheet(data.issues, datesSprint);
            });
        }

        function loadTimeSheet(issues, datesSprint) {
            console.log(issues);
            angular.forEach(datesSprint, function(date) {
                searchAndCountWorkLoggedInDate(issues, date);
            });
        }

        function searchAndCountWorkLoggedInDate(issues, dates) {
            //verificar si worklog esta entre las fechas
            //verificar si worklog es del usuario actual
            //sumar worklogg
            //mantener la referencia de la fecha
            //guardar lo issues relacionados a la fecha
            var dateWork = {
                date: '12/12/2016',
                totalWorkLogged: '14h 5m',
                dayNumber: 1,
                userAvatar: 'http://avatar.com/user',
                issues: []
            }
        }
    })
    .controller('DashCtrl', function($scope) {})
    .controller('LogworkCtrl', function($scope) {

        $scope.groups = [];
        for (var i = 0; i < 10; i++) {
            $scope.groups[i] = {
                name: i * 5,
                items: []
            };
            for (var j = 0; j < 1; j++) {
                $scope.groups[i].items.push(i + '-' + j);
            }
        }

        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };

    })

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('TimesheetDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);

    $scope.groups = [];
    for (var i = 0; i < 10; i++) {
        $scope.groups[i] = {
            name: i * 5,
            items: []
        };
        for (var j = 0; j < 1; j++) {
            $scope.groups[i].items.push(i + '-' + j);
        }
    }

    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
