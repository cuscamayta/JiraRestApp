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
    .controller('TimeSheetController', function($scope, $location, $rootScope, timeSheetService) {
        init();

        $scope.worksLogs = [];
        $scope.currentUser = { name: 'cuscamayta' };

        $scope.goToIssues = function(worklog) {
            $rootScope.currentWorkLog = worklog;
            location
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

        function getWorkLogs(worklogs, issue) {
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
                    },
                    issue: issue
                };
            })
            return worklogsResult;
        }


        function getIssuesWithWorkLog(issues) {
            var worklogsResult = issues.select(function(issue) {
                return {
                    worklogs: getWorkLogs(issue.fields.worklog.worklogs, {
                        key: issue.key,
                        id: issue.id,
                        timeLogged: 0,
                        timeLoggedLabel: '0h 0m'
                    })
                };
            });
            return worklogsResult;
        }

        function loadTimeSheet(issues, datesSprint) {
            var issuesResult = getIssuesWithWorkLog(issues);

            var countDay = 0;
            angular.forEach(datesSprint, function(date) {
                countDay++;
                searchAndCountWorkLoggedInDate(issuesResult, date, 'Dia : '.concat(countDay));
            });
        }

        function searchAndCountWorkLoggedInDate(issues, date, numberDay) {
            var dateWorkLogs = [];

            angular.forEach(issues, function(issue) {
                var worklogsInDate = issue.worklogs.where(function(worklog) {
                    return worklog.userUpdated == $scope.currentUser.name && moment(worklog.updated).isSame(date);
                });
                dateWorkLogs = dateWorkLogs.concat(worklogsInDate);
            });


            // console.log('worklogs');
            // console.log(dateWorkLogs);
            if (dateWorkLogs.length > 0) {
                var dateWork = {
                    totalWorkLogged: convertSecondsToTime(dateWorkLogs.sum(function(datework) {
                        return datework.timeSpentSeconds;
                    })),
                    key: dateWorkLogs.length,
                    date: date,
                    dayNumber: numberDay,
                    userAvatar: dateWorkLogs.first().author.avatarUrl,
                    issues: dateWorkLogs.select(function(dateWorklog) {
                        return dateWorklog.issue;
                    }),
                    // issues: dateWorkLogs.where(function(datework) {
                    //     return moment(datework.updated).isSame(date);
                    // }),
                    dateUrl: moment(date).format('DDMMYYYY')
                }

                $scope.worksLogs.push(dateWork);

                $rootScope.workLogsList = $scope.worksLogs;
            }


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
        $scope.toggleGroup = function(issue) {
            if ($scope.isGroupShown(issue)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = issue;
            }
        };
        $scope.isGroupShown = function(issue) {
            return $scope.shownGroup === issue;
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

.controller('TimesheetDetailCtrl', function($scope, $stateParams, $rootScope) {

    init();

    function init() {
        var worklog = $rootScope.workLogsList.where(function(worklog) {
            return worklog.key == $stateParams.key;
        }).first();


        if (worklog)
            $scope.issues = worklog.issues;
    }

    $scope.updateTimeLogged = function(issue, timeLogged) {
        // issue.timeLogged = issue.timeLogged ? issue.timeLogged : 0;
        issue.timeLogged = issue.timeLogged + timeLogged;
        issue.timeLoggedLabel = convertSecondsToTime(issue.timeLogged);
    }

    $scope.toggleGroup = function(issue) {
        if ($scope.isGroupShown(issue)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = issue;
        }
    };

    $scope.isGroupShown = function(issue) {
        return $scope.shownGroup === issue;
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
