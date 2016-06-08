  app.controller('workLogController', function($scope, Chats) {


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
