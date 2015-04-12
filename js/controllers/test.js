//var app = angular.module('index', ['ngMap','App.services','ui.bootstrap']);

angular.module("test",['LocalStorageModule'])

//.controller('SendLoginCtrl', ['$scope','$http','$window','SharedVars', function($scope, $http, $window, SharedVars) {
.controller('SendLoginCtrl', ['$scope','$http','$window','localStorageService', function($scope, $http, $window, localStorageService) {//  
  
  //$cookieStore.put("ID", "hola");  
  localStorageService.set("ID", 42);
  alert(localStorageService.get("ID"));
  
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
}])



 //.controller('SendPromotionCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
  .controller('SendPromotionCtrl', ['$scope','$http', function($scope, $http) {
  	$scope.createPromo = function(promo) { 
      console.log("***************************");
      setJson();
      console.log("***************************");
      console.log(JSON.stringify(promo));
  		var title = promo.title;
  		var description = promo.description;
      var terms = promo.terms;
      var expiration_date = promo.date;
      var people_limit = promo.people_limit;
      var branches = $scope.arrayIds;
  		//var lat = promo.lat;
  		//var lng = promo.lng;
      //var lat = document.getElementById('latitude').value;
  		//var lng = document.getElementById('longitude').value;
  		var jsonPromo = {
    		"title": title,
    		"description": description,
    		"terms": terms,
    		"expiration_date": expiration_date,
    		"people_limit": people_limit,
    		"branches": branches          
      }
    	var promo = {
      	"promo": jsonPromo
    	}
  		console.log(JSON.stringify(jsonPromo));
  		//console.log($scope.listRight.options[0].value);        
  		//$http.post(url, branch);
      sendData(promo, $http);
  	} 
      
    function sendData(data, $http) {
      var req = {
        method: 'POST',
        url: 'http://nowerserver.herokuapp.com/promos',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }
      $http(req).success(function(response) {
        console.log("ya");
        console.log(JSON.stringify(response));
        state = response.success;
        if(state){
          $scope.alerts = [{ type: 'success', msg: '¡Anuncio publicado! :)' }];          
        }else{
        $scope.alerts = [{ type: 'danger', msg: 'No se pudo publicar la promoción :( ' + state.errors}];            
        }
      }).error(function() {
        console.log("otra cosa");
      });
    } 
    
    function setJson(){    
      $scope.arrayIds = [];
      for(i = 0; i < $scope.listRight.options.length; i++){
        id = {}
        id ["id"] = $scope.listRight.options[i].value;
        //id ["email"] = email;
        $scope.arrayIds.push(id); 
      }
      console.log(JSON.stringify($scope.arrayIds));
    } 
  }])

  //.controller('EventArgumentsCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
  .controller('EventArgumentsCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
    
    
    $scope.value = localStorageService.get("ID");
    alert($scope.value);
    
    
    //$scope.storeId = getStoreId();        
    //console.log("-----------------------------------");
    //console.log(SharedVars.getStoreId());
    //console.log("-----------------------------------");  
    
    
    
    
    //getData($http, SharedVars);       
    getData($http);       
    
    
    
    
    
    $scope.$on('mapInitialized', function(evt, evtMap) {			  
      console.log("Entró al inicializador del mapa");
      $scope.map = evtMap;      
    });
    
    //Esta función pone los marcadores en el mapa
    function createMarkers(){
      //console.log("Entró a crear marker");
      //console.log($scope.rawJSON.branches[0].name);      
      /**
      var jsonLatLng = {
          "k": k,
          "D": D
      }
      **/
      //console.log(jsonLatLng);
      for(i = 0; i < $scope.rawJSON.branches.length; i++){
        var lat = $scope.rawJSON.branches[i].latitude;
        var long = $scope.rawJSON.branches[i].longitude;
        var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(long));
        var marker = new google.maps.Marker({position: myLatlng, map: $scope.map});
        //console.log("creó marker: " + i );
      }                    
    }
    //no hace nada pero la tengo ahí por si la necesito
  	function updateCoordinates(lat, lng) {
  		document.getElementById('latitude').value = lat;
  		document.getElementById('longitude').value = lng;
  	}            
    //Esta función trae el JSON del servicio
    
    //function getData($http, SharedVars) {
    function getData($http) {
      //console.log("holi");
      var req = {
        method: 'GET',
        //url: 'http://nowerserver.herokuapp.com/stores/branches/'+SharedVars.getStoreId(),
        url: 'http://nowerserver.herokuapp.com/stores/branches/42',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      $http(req).success(function(response) {
        console.log("ya");
        console.log(JSON.stringify(response));        
        $scope.rawJSON = JSON.parse(JSON.stringify(response));
        createArray();        
      }).error(function() {
        console.log("otra cosa");
        $scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
      });
    } 
    
    //Crea un array con los branches
    function createArray(){
      var listLeft = document.getElementById('selectLeft');
      //var listRight = document.getElementById('selectRight'); 
      $scope.listRight = document.getElementById('selectRight'); 
      $scope.branches = [];               
      for(i = 0; i < $scope.rawJSON.branches.length; i++){  
        $scope.branches.push($scope.rawJSON.branches[i]);
        create(listLeft, $scope.rawJSON.branches[i].id, $scope.rawJSON.branches[i].name);
      }    
      createMarkers();
    }
    //Mete las branches a la lista tipo interactiva
    function create(listBoxTo,optionValue,optionDisplayText){
      var newOption = document.createElement("option");
      newOption.value = optionValue;
      newOption.text = optionDisplayText;
      listBoxTo.add(newOption, null);
      return true;
    }
    //Mueve el elemento seleccionado a la derecha o izquierda
    $scope.moveToRightOrLeft = function (side){
      var listLeft=document.getElementById('selectLeft');
      //var listRight=document.getElementById('selectRight');
      $scope.listRight = document.getElementById('selectRight');
      if(side==1){
        if(listLeft.options.length==0){
          alert('Ya se movió todo para la derecha');
          return false;
        }else{
          var selectedCountry=listLeft.options.selectedIndex;
          move($scope.listRight,listLeft.options[selectedCountry].value,listLeft.options[selectedCountry].text);
          listLeft.remove(selectedCountry);
          if(listLeft.options.length>0){
            listLeft.options[0].selected=true;
          }
        }
      }else if(side==2){
        if($scope.listRight.options.length==0){
          alert('Ya se movió todo para la izquierda');
          return false;
        }else{
          var selectedCountry=$scope.listRight.options.selectedIndex;
          move(listLeft,$scope.listRight.options[selectedCountry].value,$scope.listRight.options[selectedCountry].text);
          $scope.listRight.remove(selectedCountry);
          if($scope.listRight.options.length>0){
            $scope.listRight.options[0].selected=true;
          }
        }
      }
    }
    //Mueve todo para un lado sea izq o der
    $scope.move = function(side){
      var listLeft=document.getElementById('selectLeft');
      //var listRight=document.getElementById('selectRight');
      $scope.listRight = document.getElementById('selectRight');
      if(side == 1) {
        console.log("intento mover para un lado");        
        while(listLeft.options.length > 0) {          
          move($scope.listRight, listLeft.options[0].value, listLeft.options[0].text);
          listLeft.remove(listLeft.options[0]);
        }
      } else {        
        while($scope.listRight.options.length > 0){
          move(listLeft, $scope.listRight.options[0].value, $scope.listRight.options[0].text);
          $scope.listRight.remove($scope.listRight.options[0]);
        }
      }
    }
    //No se que hace pero hace algo
    function move(listBoxTo,optionValue,optionDisplayText){
      console.log("intento mover para un lado");
      var newOption = document.createElement("option");
      newOption.value = optionValue;
      newOption.text = optionDisplayText;
      listBoxTo.add(newOption, null);
      return true;
    }  
  }])

  .controller('AlertDemoCtrl', function ($scope) {
    /**
    $scope.alerts = [
      { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];
  **/
    $scope.addAlert = function() {
      $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });








