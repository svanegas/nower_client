var app = angular.module('index', ['ngMap']);

app.controller('JsonCtrl', ['$scope','$http', function($scope, $http) {
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
        sendData(store, $http);
	} 
    
    function sendData(data, $http) {
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
      }).error(function() {
        console.log("otra cosa");
      });
    }
    

    
}]);


