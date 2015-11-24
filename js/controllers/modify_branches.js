angular.module("modify_branches",['ngMap','LocalStorageModule','ui.bootstrap'])

.controller('EditPromotionCtrl', ['$scope','$http', function($scope, $http) {
  $scope.modifyBranch = function(branch) {
    var confirmation = confirm("¿Estas seguro que deseas modificar esta sucursal?");
    if(confirmation == true){
      var branch_id = $scope.branch_id;
      console.log(branch_id);
      var name = document.getElementById('name').value;
      var address = document.getElementById('address').value;
      var phone = document.getElementById('phone').value;
      var lat = document.getElementById('latitude').value;
      var lng = document.getElementById('longitude').value;
      var jsonBranch = {
        "id": branch_id,
        "name": name,
        "address": address,
        "phone": phone,
        "latitude": lat,
        "longitude": lng
      }
      var branch = {
        "branch": jsonBranch
      }
      console.log(JSON.stringify(branch));
      sendData(branch, $http);
    }
  }

  function sendData(data, $http) {
    var req = {
      method: 'PATCH',
      url: '//nowerserver.tk/branches',
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
      $scope.alerts = [{ type: 'success', msg: '¡Sucursal modificada! :)' }];
      document.forms["createBranchForm"].reset();
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
    window.location.href = window.location.href;
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
}])

//.controller('EventArgumentsCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
.controller('BranchesArgumenstCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  //Adding timer to feedback messages
  //setInterval(function () {$('#directions').hide();}, 5000);
  document.getElementById("closeDirections").addEventListener("click", closeWindows);
  getData($http);
  $scope.$on('mapInitialized', function(evt, evtMap) {
    console.log("Entró al inicializador del mapa");
    $scope.map = evtMap;
  });
  function fillBranchFields(){
    var selectedBranch = sessionStorage.getItem("selectedBranch");
    //var indexSelectedBranch = $scope.rawJSON.branches[indexSelectedBranch].index;
    console.log(selectedBranch);
    var name = $scope.rawJSON.branches[selectedBranch].name;
    var address = $scope.rawJSON.branches[selectedBranch].address;
    var latitude = $scope.rawJSON.branches[selectedBranch].latitude;
    var longitude = $scope.rawJSON.branches[selectedBranch].longitude;
    var phone = $scope.rawJSON.branches[selectedBranch].phone;
    document.getElementById('name').value = name;
    document.getElementById('address').value = address;
    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;
    document.getElementById('phone').value = phone;
    createMarker(latitude, longitude);
    $scope.branch_id = $scope.rawJSON.branches[selectedBranch].id;
    console.log($scope.rawJSON.branches[0]);
  }
  //Esta función pone los marcadores en el mapa
  function createMarker(lat, long){
    var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(long));
    var marker = new google.maps.Marker({position: myLatlng, map: $scope.map, draggable:true});
    $scope.map.setCenter(myLatlng, 15);
    google.maps.event.addListener(marker, 'dragend', function(evt) {
      updateCoordinates(evt.latLng.lat(), evt.latLng.lng());
    });
  }

  function closeWindows(){
    $('#directions').hide();
  }

  function updateCoordinates(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  }
//no hace nada pero la tengo ahí por si la necesito
  function updateCoordinates(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  }
  //function getData($http, SharedVars) {
  function getData($http) {
    //Llamamos al ID almacenado
    $scope.value = localStorageService.get("Id");
    var req = {
      method: 'GET',
      //url: '//nowerserver.tk/stores/branches/'+SharedVars.getStoreId(),
      url: '//nowerserver.tk/stores/branches/'+$scope.value,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.rawJSON = JSON.parse(JSON.stringify(response));
      fillBranchFields();
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
    });
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
