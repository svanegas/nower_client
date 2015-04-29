//var app = angular.module('redeem_promotion', []);

angular.module("redeem_promotion",['ui.bootstrap','LocalStorageModule'])

.controller('SendRedeemPromotionCtrl', ['$scope','$http','$window','localStorageService', function($scope, $http, $window, localStorageService) {
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
      url: 'http://nowerserver.tk/redemptions/redeem',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      console.log(JSON.stringify(response));
      evaluteResponse(response);
    }).error(function(response) {
      console.log("otra cosa");
      evaluteResponse(response);
    });
  }

    function evaluteResponse(response){
        console.log(JSON.stringify(response));
        state = response.success;
        if(state){
          localStorageService.set("picture", response.promo.picture.extra_large.url);
          localStorageService.set("user", response.user.name);
          localStorageService.set("title", response.promo.title);
          localStorageService.set("description", response.promo.description);
          localStorageService.set("expiration_date", response.promo.expiration_date);
          localStorageService.set("people_limit", response.promo.people_limit);
          localStorageService.set("available_redemptions", response.promo.available_redemptions);
          $window.location='./detail_promotion.html';
          //console.log(localStorageService.get("user"));
          //console.log(localStorageService.get("title"));
          //console.log(localStorageService.get("description"));
          //console.log(localStorageService.get("expiration_date"));
          //console.log(localStorageService.get("people_limit"));
        }else{
          $scope.alerts = [{ type: 'danger', msg: "Error: " + response.errors["code"]}];
        }
        $("#alert").ready(function(){
          $("html, body").delay(0).animate({
              scrollTop: $('#alert').offset().top - 100
          }, 0);
        });
    }


    function showErrorAlert(errorName, errorMsgs, cont){
      if(cont > 1){
        $scope.alerts = [{ type: 'danger', msg: "Error: " + errorName[0] + " " + errorMsgs[0]}];
        for(i = 1; i < errorMsgs.length; i++){
            $scope.alerts.push({type: 'danger', msg: "Error: " + errorName[i] + " " + errorMsgs[i]});
        }
      } else {
            $scope.alerts = [{ type: 'danger', msg: "Error: " + errorName[0] + " " + errorMsgs[0]}];
      }

    }




}]);
