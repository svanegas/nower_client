//var app = angular.module('myapp', ['ngMap','App.services','ui.bootstrap']);

angular.module("modify_branches",['ngMap','LocalStorageModule','ui.bootstrap'])
//angular.module("post_promotion",['ngMap','LocalStorageModule'])

//.controller('SendPromotionCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
.controller('EditPromotionCtrl', ['$scope','$http', function($scope, $http) {
  $scope.modifyBranch = function(promo) {
    console.log("***************************");
    setJson();
    console.log("***************************");
    console.log(JSON.stringify(promo));
    var title = promo.title;
    var description = promo.description;
    var terms = promo.terms;
    promo.date = document.getElementById('dateTime').value;
    var expiration_date = promo.date;
    var people_limit = promo.people_limit;
    var branches = $scope.arrayIds;
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
      evaluteResponse(response);
    }).error(function(response) {
      evaluteResponse(response);
    });
  }

  function evaluteResponse(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      $scope.alerts = [{ type: 'success', msg: '¡Promoción publicada! :)' }];
      document.forms["promotion_form"].reset();
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

  function setJson(){
    $scope.arrayIds = [];
    for(i = 0; i < $scope.listRight.options.length; i++){
      id = {}
      id ["id"] = $scope.listRight.options[i].value;
      $scope.arrayIds.push(id);
    }
    console.log(JSON.stringify($scope.arrayIds));
  }
}])

.controller('EventArgumentsCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  getData($http);
  $scope.$on('mapInitialized', function(evt, evtMap) {
    console.log("Entró al inicializador del mapa");
    $scope.map = evtMap;
  });

  //Esta función pone los marcadores en el mapa
  function createMarkers(){
    for(i = 0; i < $scope.rawJSON.branches.length; i++){
      var lat = $scope.rawJSON.branches[i].latitude;
      var long = $scope.rawJSON.branches[i].longitude;
      var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(long));
      var marker = new google.maps.Marker({position: myLatlng, map: $scope.map});
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
  //Llamamos al ID almacenado
  $scope.value = localStorageService.get("Id");
  var req = {
    method: 'GET',
    //url: 'http://nowerserver.herokuapp.com/stores/branches/'+SharedVars.getStoreId(),
    url: 'http://nowerserver.herokuapp.com/stores/branches/'+$scope.value,
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
  var listBranches = document.getElementById('selectBranch');
  $scope.branches = [];
  for(i = 0; i < $scope.rawJSON.branches.length; i++){
    $scope.branches.push($scope.rawJSON.branches[i]);
    create(listBranches, $scope.rawJSON.branches[i].id, $scope.rawJSON.branches[i].name);
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
  var listBranches=document.getElementById('selectLeft');
  $scope.listRight = document.getElementById('selectRight');
  if(side==1){
    if(listBranches.options.length==0){
      alert('Ya se movió todo para la derecha');
      return false;
    }else{
      var selectedCountry=listBranches.options.selectedIndex;
      move($scope.listRight,listBranches.options[selectedCountry].value,listBranches.options[selectedCountry].text);
      listBranches.remove(selectedCountry);
      if(listBranches.options.length>0){
        listBranches.options[0].selected=true;
      }
    }
  }else if(side==2){
    if($scope.listRight.options.length==0){
      alert('Ya se movió todo para la izquierda');
      return false;
    }else{
      var selectedCountry=$scope.listRight.options.selectedIndex;
      move(listBranches,$scope.listRight.options[selectedCountry].value,$scope.listRight.options[selectedCountry].text);
      $scope.listRight.remove(selectedCountry);
      if($scope.listRight.options.length>0){
        $scope.listRight.options[0].selected=true;
      }
    }
  }
}
//Mueve todo para un lado sea izq o der
$scope.move = function(side){
  var listBranches=document.getElementById('selectLeft');
  //var listRight=document.getElementById('selectRight');
  $scope.listRight = document.getElementById('selectRight');
  if(side == 1) {
    console.log("intento mover para la izquierda");
    while(listBranches.options.length > 0) {
      move($scope.listRight, listBranches.options[0].value, listBranches.options[0].text);
      listBranches.remove(listBranches.options[0]);
    }
  } else {
    while($scope.listRight.options.length > 0){
      move(listBranches, $scope.listRight.options[0].value, $scope.listRight.options[0].text);
      $scope.listRight.remove($scope.listRight.options[0]);
    }
  }
}
//No se que hace pero hace algo
function move(listBoxTo,optionValue,optionDisplayText){
  console.log("intento mover para la derecha");
  var newOption = document.createElement("option");
  newOption.value = optionValue;
  newOption.text = optionDisplayText;
  listBoxTo.add(newOption, null);
  return true;
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
