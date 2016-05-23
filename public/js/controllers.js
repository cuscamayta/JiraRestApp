angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, userService, $location) {
        $scope.signIn = function(user) {
            var response = userService.signIn(user);
            response.then(function(data) {
                if (data.hasBeenLogged)
                    $location.path('/tab');
                else
                    alert('user or password incorrect');
            });
        };
    })
    .controller('TimeSheetController', function($scope, timeSheetService) {
        init();

        $scope.worksLogs = [];

        $scope.currentUser = { name: 'cuscamayta' };



        function init() {
            var fromDate = moment(new Date('05/03/2016')),
                toDate = moment(new Date('05/20/2016'));
            var datesSprint = enumerateDaysBetweenDates(fromDate, toDate);

            var response = timeSheetService.getTimeSheet();
            response.then(function(data) {
                console.log('data isues');
                console.log(data);
                loadTimeSheet(data.issues, datesSprint);
            });
        }

        function getWorkLogs(worklogs) {
            var worklogsResult = worklogs.select(function(worklog) {
                return {
                    timeSpent: worklog.timeSpent,
                    timeSpentSeconds: worklog.timeSpentSeconds,
                    updated: moment(worklog.started).format('DD/MM/YYYY'),
                    userUpdated: worklog.updateAuthor.name,
                    author: {
                        name: worklog.author.name,
                        displayName: worklog.author.displayName,
                        avatarUrl: worklog.author.avatarUrls["48x48"]
                    }
                };
            })
            return worklogsResult;
        }


        function getIssuesWithWorkLog(issues) {
            var worklogsResult = issues.select(function(issue) {
                return { key: issue.key, id: issue.id, worklogs: getWorkLogs(issue.fields.worklog.worklogs) };
            });
            return worklogsResult;
        }

        function loadTimeSheet(issues, datesSprint) {
            var issuesResult = getIssuesWithWorkLog(issues);
            console.log('worklogs');
            console.log(issuesResult);

            var countDay = 0;
            angular.forEach(datesSprint, function(date) {
                countDay++;
                searchAndCountWorkLoggedInDate(issuesResult, date, 'Dia : '.concat(countDay));
            });
            console.log($scope.worksLogs);
        }

        function searchAndCountWorkLoggedInDate(issues, date, numberDay) {
            var dateWorkLogs = [];

            angular.forEach(issues, function(issue) {
                var worklogsInDate = issue.worklogs.where(function(worklog) {
                    return worklog.userUpdated == $scope.currentUser.name && worklog.updated == date;
                });
                dateWorkLogs.concat(worklogsInDate);
            });

            var dateWork = {
                totalWorkLogged: dateWorkLogs.sum(function(datework) {
                    return dateWork.timeSpentSeconds;
                }),
                date: date.dateWorkLog,
                dayNumber: numberDay,
                userAvatar: dateWorkLogs.first().author.avatarUrl,
                issues: dateWorkLogs.where(function(datework) {
                    return datework.updated == date;
                })
            }

            $scope.worksLogs.push(dateWork);


            // countDays++;
            // var dateWork = {
            //     date: '12/12/2016',
            //     totalWorkLogged: '14h 5m',
            //     dayNumber: 'Dia : '.concat(countDays),
            //     userAvatar: 'http://avatar.com/user',
            //     issues: []
            // };

            //verificar si worklog esta entre las fechas
            //verificar si worklog es del usuario actual
            //sumar worklogg
            //mantener la referencia de la fecha
            //guardar lo issues relacionados a la fecha

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
