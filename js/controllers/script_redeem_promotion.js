var app = angular.module('redeem_promotion', ['ngMap']);

app.controller('JsonCtrl', ['$scope','$http', function($scope, $http) {
  $scope.redeem_promotion = function(promotion) {
        console.log(JSON.stringify(promotion));

   
    var code = promotion.code;
        
    var jsonCode = {
          "code": code
      }
      var code = {
          "redemption": jsonCode
      }
    console.log(JSON.stringify(code));          
        sendData(code, $http);
  } 
    
    function sendData(data, $http) {
      var req = {
        method: 'POST',
        url: 'http://nowerserver.herokuapp.com/redemptions/redeem',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
      $http(req).success(function(response) {
        console.log("ya");
        console.log(JSON.stringify(response));
      }).error(function() {
        console.log("otra cosa");
      });
    }
    
}]);


