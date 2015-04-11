//var app = angular.module('create_store', ['ngMap']);

angular.module("create_store",[])

.controller('SendStoreCtrl', ['$scope','$http', function($scope, $http) {
	$scope.createStore = function(store) {
    console.log(JSON.stringify(store));
		var name = store.name;
		var email = store.email;
		var password = store.password;                
		var password_confirmation = store.password_confirmation;                
		var phone = store.phone;
    var category = store.category;        
        
		var jsonStore = {
  		"name": name,
  		"email": email,
  		"password": password,
  		"password_confirmation": password_confirmation,
  		"main_phone": phone,
      "category": category
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
      url: 'http://nowerserver.herokuapp.com/stores',
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
    

  $(function(){
    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
       $(".btn:first-child").val($(this).text());
    });
  });   
}]);




