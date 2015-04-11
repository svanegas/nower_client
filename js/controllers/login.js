//var app = angular.module('index', ['ngMap','App.services','ui.bootstrap']);

angular.module("login",[])

//.controller('SendLoginCtrl', ['$scope','$http','$window','SharedVars', function($scope, $http, $window, SharedVars) {
.controller('SendLoginCtrl', ['$scope','$http','$window', function($scope, $http, $window) {//
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
      url: 'http://nowerserver.herokuapp.com/stores/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      rawJSON = JSON.parse(JSON.stringify(response));
      $scope.store_id = rawJSON.store.store_id;
      console.log(rawJSON.store.token);        
      console.log(rawJSON.store.store_id);        
      //SharedVars.setStoreId(rawJSON.store.store_id);
      $window.location='./views/post_promotion.html'; 
    }).error(function() {
      console.log("otra cosa");
    });
  }   
}]);


