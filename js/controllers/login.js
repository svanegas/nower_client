//var app = angular.module('index', ['ngMap','App.services','ui.bootstrap']);

angular.module("login",['LocalStorageModule','ui.bootstrap'])

//.controller('SendLoginCtrl', ['$scope','$http','$window','SharedVars', function($scope, $http, $window, SharedVars) {
.controller('SendLoginCtrl', ['$scope','$http','$window','localStorageService', function($scope, $http, $window, localStorageService) {//

  $scope.loginStore = function(store) {
    console.log(JSON.stringify(store));
    var email = store.email;
    var password = store.password;
    var jsonStore = {
      "email": email,
      "password": password,
    }
    var store = {
      "store": jsonStore
    }
    console.log(jsonStore);
    sendData(store, $http, $window);
  }
  function sendData(data, $http, $window) {
    var req = {
      method: 'POST',
      url: 'http://nowerserver.tk/stores/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      console.log("ya");
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
      $scope.store_id = response.store.id;
      console.log(response.store.token);
      console.log($scope.store_id);
      //Almacenamos el ID del cliente
      localStorageService.set("Id", $scope.store_id);
      console.log($scope.store_id);
      //Saving User Data
      sessionStorage.setItem("token", response.store.token);
      sessionStorage.setItem("storeId", $scope.store_id);
      $window.location='./views/post_promotion.html';
    }else{
      $scope.alerts = [{ type: 'danger', msg: "Error: email o contraseña incorrectos"}];
      document.forms["loginForm"].reset();
    }
  }

  function evaluateSession(){
    if(sessionStorage.getItem("token") != null)$window.location='./views/post_promotion.html';
  }

}])

  .controller('AlertDemoCtrl', function ($scope) {
    $scope.addAlert = function() {
      $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });
