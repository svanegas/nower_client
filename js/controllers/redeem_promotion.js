//var app = angular.module('redeem_promotion', []);

angular.module("redeem_promotion",[])

.controller('SendRedeemPromotionCtrl', ['$scope','$http','$window', function($scope, $http, $window) {
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
    sendData(code, $http, $window);
  } 
    
  function sendData(data, $http, $window) {
    var req = {
      method: 'POST',
      url: 'http://nowerserver.herokuapp.com/redemptions/redeem',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      $window.location='./detail_promotion.html';
      console.log("ya");
      console.log(JSON.stringify(response));
    }).error(function() {
      console.log("otra cosa");
    });
  }  
}]);


