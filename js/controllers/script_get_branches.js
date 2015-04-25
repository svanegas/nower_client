//var app = angular.module('get_branches', ['ngMap']);

app.controller('ListCtrl', ['$scope','$http', function($scope, $http) {

  function getData($http) {
    var req = {
      method: 'GET',
      url: 'http://nowerserver.tk/stores/branches/42',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      rawJSON = JSON.parse(JSON.stringify(response));
      console.log(rawJSON);
    }).error(function() {
      console.log("otra cosa");
    });
  }
}]);
