chatRoom.controller('userCtrl', function ($rootScope, $scope) {
  $rootScope.username = undefined

  $scope.createUser = function (username) {
    $scope.$emit('new-user', username)
  }
})
