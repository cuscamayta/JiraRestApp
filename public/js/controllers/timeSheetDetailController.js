app.controller('timesheetDetailController', function($scope, $stateParams, $rootScope, worklogService) {

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
