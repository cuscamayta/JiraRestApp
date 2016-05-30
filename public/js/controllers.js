angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, userService, $location) {
        $scope.signIn = function(user) {
            var response = userService.signIn(user);
            response.then(function(data) {
                if (data.hasBeenLogged) {
                    setInLocalStorage('currentUser', data);
                    $location.path('/tab');
                } else
                    alert('user or password incorrect');
            });
        };
    })
    .controller('TimeSheetController', function($scope, $location, $rootScope, timeSheetService) {

        function getCurrentUser() {
            return {
                key: 'cuscamayta',
                name: 'Geovana Serrano'
            };
        }

        function getTimeSheetConfiguration() {
            return {
                dateInit: moment('05/09/2016').format('YYYY/M/D'),
                finalDate: moment('05/27/2016').format('YYYY/M/D'),
                userName: getCurrentUser().key,
                projectName: 'RMTOOLS'
            };
        }

        function getDatesWorkLogged() {
            var fromDate = moment(new Date('05/09/2016')),
                toDate = moment(new Date('05/27/2016'));
            var datesSprint = enumerateDaysBetweenDates(fromDate, toDate);
            return datesSprint;
        }

        $scope.worksLogs = [];
        $scope.currentUser = getCurrentUser();
        $scope.timeSheetConf = getTimeSheetConfiguration();
        $scope.datesSprint = getDatesWorkLogged();
        init();

        function init() {
            var response = timeSheetService.getTimeSheet($scope.timeSheetConf);
            response.then(function(data) {
                loadTimeSheet(data.issues, $scope.datesSprint);
            });
        }

        function getWorkLogs(worklogs, issue) {
            var worklogsResult = worklogs.select(function(worklog) {
                return {
                    timeSpent: worklog.timeSpent,
                    timeSpentSeconds: worklog.timeSpentSeconds,
                    updated: moment(worklog.started).format('D/M/YYYY'),
                    userUpdated: worklog.updateAuthor.name,
                    author: {
                        name: worklog.author.name,
                        displayName: worklog.author.displayName,
                        avatarUrl: worklog.author.avatarUrls["48x48"]
                    },
                    issue: issue
                };
            });
            return worklogsResult;
        }

        function getTimeSpentInSecondForIssue(issue) {
            var worklogs = issue.fields.worklog.worklogs.where(function(worklog) {
                return worklog.author.name == $scope.currentUser.key;
            });
            if (worklogs && worklogs.length > 0)
                return worklogs.sum(function(item) {
                    return item.timeSpentSeconds;
                });
            else
                return 0;
        }


        function getIssuesWithWorkLog(issues) {
            var worklogsResult = issues.select(function(issue) {
                return {
                    worklogs: getWorkLogs(issue.fields.worklog.worklogs, {
                        key: issue.key,
                        id: issue.id,
                        timeLogged: 0,
                        timeSpent: 0, // convertSecondsToTime(getTimeSpentInSecondForIssue(issue)),
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
            console.log('worklogs');
            console.log($scope.worksLogs);
        }

        function searchAndCountWorkLoggedInDate(issues, date, numberDay) {
            var dateWorkLogs = [];

            angular.forEach(issues, function(issue) {
                var worklogsInDate = issue.worklogs.where(function(worklog) {
                    return worklog.userUpdated == $scope.currentUser.key && worklog.updated == date;
                });
                dateWorkLogs = dateWorkLogs.concat(worklogsInDate);
            });

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
                        debugger;
                        dateWorklog.issue
                            .timeSpent = convertSecondsToTime(dateWorklog.timeSpentSeconds);
                        return dateWorklog.issue;
                    }),

                    dateUrl: moment(date).format('DDMMYYYY')
                };

                $scope.worksLogs.push(dateWork);

                $rootScope.workLogsList = $scope.worksLogs;
            }
        }
    })
    .controller('LogworkCtrl', function($scope, Chats) {


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
    .controller('TimesheetDetailCtrl', function($scope, $stateParams, $rootScope, worklogService) {

        init();

        function init() {
            var worklog = $rootScope.workLogsList.where(function(worklog) {
                return worklog.key == $stateParams.key;
            }).first();


            if (worklog)
                $scope.issues = worklog.issues;
        }
        $scope.saveWorkLog = function(issue) {
            var response = worklogService.saveWorkLog(issue.timeLogged);
            response.then(function(data) {
                if (data.isSuccess)
                    alert('guardado correctamente');
                else
                    alert('error al guardar intente nuevamente');
            });
        };

        $scope.updateTimeLogged = function(issue, timeLogged) {
            issue.timeLogged = issue.timeLogged + timeLogged;
            issue.timeLogged = issue.timeLogged > 0 ? issue.timeLogged : 0;
            issue.timeLoggedLabel = convertSecondsToTime(issue.timeLogged);
        };

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

.controller('SettingController', function($scope) {
    $scope.currentUser = getItemFromLocalstorage('currentUser');
    $scope.$watch('settings', function(newValue, oldValue) {
        $scope.settings.userName = newValue.useCurrentUser ? $scope.currentUser.data.name : newValue.userName;
        $scope.settings.projectName = newValue.useDefaultProject ? 'RMTOOLS' : newValue.projectName;
        if (newValue.useDefaultDate) {
            $scope.settings.startDate = convertDate(new Date());
            $scope.settings.endDate = addDaysToday(10);
        } else {
            $scope.settings.startDate = isValidDate(newValue.startDate) ? newValue.startDate : new Date();
            $scope.settings.endDate = isValidDate(newValue.endDate) ? newValue.endDate : addDaysToday(10);
        }
    }, true);


    debugger;
    $scope.settings = {
        useCurrentUser: true,
        userName: $scope.currentUser.data.name,
        useDefaultProject: true,
        projectName: 'RMTOOLS',
        useDefaultDate: true,
        startDate: moment(new Date()).format('d/m/yyyy'),
        endDate: addDaysToday(10)
    };

    // $ionicModal.fromTemplateUrl('templates/datemodal.html',
    //     function(modal) {
    //         $scope.datemodal = modal;
    //     }, {
    //         // Use our scope for the scope of the modal to keep it simple
    //         scope: $scope,
    //         // The animation we want to use for the modal entrance
    //         animation: 'slide-in-up'
    //     }
    // );
    // $scope.opendateModal = function() {
    //     $scope.datemodal.show();
    // };
    // $scope.closedateModal = function(modal) {
    //     $scope.datemodal.hide();
    //     $scope.datepicker = modal;
    // };


});
