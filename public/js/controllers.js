angular.module('starter.controllers', ['onezone-datepicker'])

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
    .controller('TimeSheetController', function($scope, $location, $rootScope, timeSheetService, commonService) {

        function initialize() {
            $scope.user = commonService.getUser();
            $scope.settings = commonService.getSettings();
            $scope.worksLogs = [];
            $scope.datesSprint = getDatesWorkLogged();

            init();
        }

        $scope.$on("$ionicView.beforeEnter", function(event, data) {
            initialize();
        });



        function getDatesWorkLogged() {
            var fromDate = moment(new Date($scope.settings.startDate)),
                toDate = moment(new Date($scope.settings.endDate));
            var datesSprint = enumerateDaysBetweenDates(fromDate, toDate);
            return datesSprint;
        }



        function init() {
            if (commonService.isSettingValid()) {
                var response = timeSheetService.getTimeSheet($scope.settings);
                response.then(function(data) {
                    if (data.issues.length <= 0) alert('No tiene datos para mostrar');
                    loadTimeSheet(data.issues, $scope.datesSprint);
                });
            } else {
                alert('los datos de configuracion no son validos revise porfavor');
                $location.path('/tab/setting');
            }
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
                return worklog.author.name.toUpperCase() == $scope.settings.userName.toUpperCase();
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
                        timeSpent: 0,
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

        function getDateWorkLogDefault(date, numberDay, userAvatar) {
            return {
                totalWorkLogged: convertSecondsToTime(0),
                key: '0',
                date: date,
                dayNumber: numberDay,
                userAvatar: userAvatar,
                issues: [],
                timeSpentSeconds: 0,
                dateUrl: ''
            };
        }

        function dateIsMajorToCurrentDate(dateString) {
            var SpecialToDate = '13/6/2016'; // DD/MM/YYYY

            var SpecialTo = moment(dateString, "D/M/YYYY");
            if (SpecialTo > moment()) {
                // alert('la fecha es mayor a la actual');
                return true;
            } else {
                return false;
                // alert('la fecha es menor a la actual');
            }
        }

        function searchAndCountWorkLoggedInDate(issues, date, numberDay) {
            var dateWorkLogs = [];

            angular.forEach(issues, function(issue) {
                var worklogsInDate = issue.worklogs.where(function(worklog) {
                    return worklog.userUpdated.toUpperCase() == $scope.settings.userName.toUpperCase() && worklog.updated == date;
                });
                dateWorkLogs = dateWorkLogs.concat(worklogsInDate);
            });

            var dateWork = dateWorkLogs.length > 0 ? {
                totalWorkLogged: convertSecondsToTime(dateWorkLogs.sum(function(datework) {
                    return datework.timeSpentSeconds;
                })),
                key: dateWorkLogs.length,
                date: date,
                dayNumber: numberDay,
                userAvatar: dateWorkLogs.first().author.avatarUrl,
                timeSpentSeconds: dateWorkLogs.sum(function(datework) {
                    return datework.timeSpentSeconds;
                }),
                issues: dateWorkLogs.select(function(dateWorklog) {
                    dateWorklog.issue.timeSpent = convertSecondsToTime(dateWorklog.timeSpentSeconds);
                    return dateWorklog.issue;
                }),

                dateUrl: moment(date).format('DDMMYYYY')
            } : getDateWorkLogDefault(date, numberDay, $scope.worksLogs.length > 0 ? $scope.worksLogs[1].userAvatar : '');

            if (!dateIsMajorToCurrentDate(date)) {
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

.controller('SettingController', function($scope, commonService) {
        $scope.currentUser = commonService.getUser();
        $scope.$watch('settings', function(newValue, oldValue) {
            $scope.settings.userName = newValue.useCurrentUser ? $scope.currentUser.data.name : newValue.userName;
            $scope.settings.projectName = newValue.useDefaultProject ? 'RMTOOLS' : newValue.projectName;

            setInLocalStorage('settings', $scope.settings);
        }, true);

        $scope.settings = commonService.getSettings();

        $scope.onezoneDatepicker = { date: new Date() }
            // $scope.onezoneDatepicker = {
            //     date: new Date(),
            //     mondayFirst: false,
            //     // months: months,
            //     // daysOfTheWeek: daysOfTheWeek,
            //     // startDate: '12/06/2015',
            //     // endDate: '12/06/2015',
            //     disablePastDays: false,
            //     disableSwipe: false,
            //     disableWeekend: false,
            //     disableDates: false,
            //     disableDaysOfWeek: false,
            //     showDatepicker: false,
            //     showTodayButton: true,
            //     calendarMode: false,
            //     hideCancelButton: false,
            //     hideSetButton: false,
            //     highlights: [],
            //     callback: function(value) {
            //         // your code
            //     }
            // };


    })
    .directive('backcolor', function() {
        return function(scope, element, attrs) {
            var timeSpent = attrs.backcolor;
            if (timeSpent < 21600) {
                var content = element.find('a');
                content.addClass('log-atention')
            }
        };
    });
