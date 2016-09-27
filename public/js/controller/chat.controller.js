chatRoom.controller('chatCtrl', function ($rootScope, $scope, $http) {
  $scope.username = undefined
  $scope.newMessage = undefined
  $scope.messages = []

  var socket = window.io('localhost:1337/')
  socket.emit('test', 'we are passing a message')

  socket.on('recieve-message', function (msg, sentiment) {
    console.log(sentiment.high)
    $scope.$apply($rootScope.sentimentHeart = sentiment.heart)
    $scope.$apply($rootScope.sentimentShocked = sentiment.shocked)
    $scope.$apply($rootScope.sentimentHigh = sentiment.high)
    $scope.$apply($rootScope.sentimentColor = sentiment.color)
    $scope.$apply(function () {
      $scope.messages.push(msg)
    })
  })

  $scope.sendMessage = function () {
    var newMessage = {
      userName: $scope.username,
      message: $scope.newMessage
    }
    $http.post('/indico', newMessage)

      .success(function (data) {
        $rootScope.sentimentHeart = false
        $rootScope.sentimentShocked = false
        $rootScope.sentimentHigh = false
        $rootScope.sentimentColor = false
        $rootScope.sentimentHow = false
        if (parseFloat(data.sentiments) >= parseFloat(0.9517896143000001)) {
          $rootScope.sentimentHeart = true
        }
        if (parseFloat(data.sentiments) < parseFloat(0.2)) {
          $rootScope.sentimentShocked = true
        }
        if (parseFloat(data.sentiments) === parseFloat(0.8423908205)) {
          $rootScope.sentimentHigh = true
        }
        if (parseFloat(0.3) < parseFloat(data.sentiments) > parseFloat(0.6)) {
          $rootScope.sentimentColor = true
        }
        socket.emit('new-message', newMessage, {heart: $rootScope.sentimentHeart, shocked: $rootScope.sentimentShocked, high: $rootScope.sentimentHigh,color: $rootScope.sentimentColor})
      }).error(function (data) {
      console.error('error in posting')
    })

    $scope.newMessage = undefined
  }

  $rootScope.$on('new-user', function (event, username) {
    $scope.username = username
  })
})
