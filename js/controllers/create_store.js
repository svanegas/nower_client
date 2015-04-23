//var app = angular.module('create_store', ['ngMap']);

angular.module("create_store",['ui.bootstrap'])

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
        $scope.alerts = [{ type: 'success', msg: '¡Tienda creada! :)' }];
        document.forms["store_form"].reset();
        $scope.move(2);
      }else{
        var errorName = [];
        var errorMsgs = [];
        var cont = 0;
        jQuery.each(response.errors, function(attr, errors) {
          errorName.push(attr);
          cont += 1;
          jQuery.each(errors, function() {
            errorMsgs.push(this);
          });
        });
        showErrorAlert(errorName, errorMsgs, cont);
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
    

  $(function(){
    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
       $(".btn:first-child").val($(this).text());
    });
  });   
}]);




