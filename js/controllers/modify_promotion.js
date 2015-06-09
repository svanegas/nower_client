angular.module("modify_promotion",['ngMap','LocalStorageModule','ui.bootstrap'])

.controller('EditPromoCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  $scope.promo={};
  getData($http, $scope);
  $scope.modifyPromo = function(promo) {
    var confirmation = confirm("¿Estas seguro que deseas modificar esta promoción?");
    if(confirmation == true){
      $scope.alerts =[];
      if( document.getElementById('people_limit').value == '' &&
          document.getElementById('dateInput').value == ''){
        $scope.alerts.push({type: 'danger', msg: "Debes establecer un límite de personas"});
        $scope.alerts.push({type: 'danger', msg: "Debes establecer una fecha límite"});
      } else if (document.getElementById('dateInput').value == ''){
          $scope.alerts.push({type: 'danger', msg: "Debes establecer una fecha límite"});
      } else if (document.getElementById('people_limit').value == ''){
          $scope.alerts.push({type: 'danger', msg: "Debes establecer un límite de personas"});
      } else {
          setJson();
          var formData = new FormData(), $input = $('#pictureInput');
          var promo_id = $scope.promo_id;
          formData.append('promo[id]', promo_id);
          formData.append('promo[picture]', $input[0].files[0]);
          formData.append('promo[title]', promo.title);
          formData.append('promo[description]', promo.description);
          formData.append('promo[terms]', promo.terms);
          promo.date = document.getElementById('dateInput').value;
          promo.time = document.getElementById('timeInput').value;
          var dateTime = promo.date + ' ' + promo.time;
          console.log(dateTime);
          formData.append('promo[expiration_date]', dateTime);
          formData.append('promo[people_limit]', promo.people_limit);
          formData.append('promo[branches]', JSON.stringify($scope.arrayIds));
          sendData(formData);
      }
    }
    /*var promo_id = $scope.promo_id;
    console.log(promo_id);
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var terms = document.getElementById('terms').value;
    var expiration_date = document.getElementById('expiration_date').value;
    var people_limit = document.getElementById('people_limit').value;
    var jsonBranch = {
      "id": promo_id,
      "title": title,
      "description": description,
      "terms": terms,
      "expiration_date": expiration_date,
      "people_limit": people_limit
    }
    var promo = {
      "promo": jsonBranch
    }
    console.log(JSON.stringify(promo));
    sendData(promo, $http);
  }

  function sendData(data, $http) {
    var req = {
      method: 'PATCH',
      url: 'http://nowerserver.tk/promos',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      evaluteResponse(response);
    }).error(function(response) {
      evaluteResponse(response);
    });*/
  }

  function sendData(data) {
    $.ajax({
      url: "http://nowerserver.tk/promos",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'PUT',
      success: function (response) {
        console.log(JSON.stringify(response));
        evaluateResponse(response);
      },
      error: function(response) {
        evaluateResponse(response.responseJSON);
      }
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
      //id ["email"] = email;
      $scope.arrayIds.push(id);
    }
    console.log(JSON.stringify($scope.arrayIds));
  }

  function evaluateResponse(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      $scope.alerts = [{ type: 'success', msg: '¡Promoción modificada! :)' }];
      document.forms["modifyPromoForm"].reset();
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
    window.location.href=window.location.href;
  }

  function getData($http, $scope) {
    //Llamamos al ID almacenado
    var selectedPromo = sessionStorage.getItem("selectedPromo");
    var req = {
      method: 'GET',
      //url: 'http://nowerserver.tk/stores/branches/'+SharedVars.getStoreId(),
      url: 'http://nowerserver.tk/promos/'+selectedPromo,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.rawJSON = JSON.parse(JSON.stringify(response));
      fillPromoFields($scope);
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó los detalles de la promoción' }];
    });
  }

  function fillPromoFields($scope){
    var selectedPromo = sessionStorage.getItem("selectedPromo");
    //var indexSelectedBranch = $scope.rawJSON.branches[indexSelectedBranch].index;
    var title = $scope.rawJSON.promo.title;
    var description = $scope.rawJSON.promo.description;
    var terms = $scope.rawJSON.promo.terms;
    var expiration_date = $scope.rawJSON.promo.expiration_date;

    var expiration_date_split = expiration_date.split(" ");
    var date = expiration_date_split[0];
    var time = expiration_date_split[1];
    var people_limit = $scope.rawJSON.promo.people_limit;
    $scope.promo.title =title;
    $scope.promo.description =description;
    $scope.promo.terms =terms;
    document.getElementById('dateInput').value = date;
    document.getElementById('timeInput').value = time;
    $scope.promo.date =date;
    $scope.promo.time =time;
    $scope.promo.people_limit =people_limit;
    //document.getElementById('title').value = title;
    //document.getElementById('description').value = description;
    //document.getElementById('terms').value = terms;

    //document.getElementById('people_limit').value = people_limit;
    var pictureURL = $scope.rawJSON.promo.picture.extra_large.url;
    if(pictureURL != null) {
      $("#picture").attr("src","http://nowerserver.tk" + pictureURL);
    }
    setBranchesListRight();
    getBranches($http);
    $scope.promo_id = $scope.rawJSON.promo.id;
  }

  //Crea un array con las sucursales donde la promoción se encuentra registrada.
  function setBranchesListRight(){
    var listLeft = document.getElementById('selectLeft');
    //var listRight = document.getElementById('selectRight');
    $scope.listRight = document.getElementById('selectRight');
    $scope.promoBranches = [];
    $scope.promoBranchesIds = [];
    for(i = 0; i < $scope.rawJSON.promo.branches.length; i++){
      $scope.promoBranches.push($scope.rawJSON.promo.branches[i]);
      $scope.promoBranchesIds.push($scope.rawJSON.promo.branches[i].id);
      addBranchToSelect($scope.listRight, $scope.rawJSON.promo.branches[i].id, $scope.rawJSON.promo.branches[i].name);
    }
    createMarkers();
  }

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
    for(i = 0; i < $scope.rawJSON.promo.branches.length; i++){
      var lat = $scope.rawJSON.promo.branches[i].latitude;
      var lng = $scope.rawJSON.promo.branches[i].longitude;
      var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
      var marker = new google.maps.Marker({position: myLatlng, map: $scope.map});
      //console.log("creó marker: " + i );
    }
  }

  function getBranches($http) {
    //Llamamos al ID almacenado
    $scope.value = localStorageService.get("Id");
    var req = {
      method: 'GET',
      //url: 'http://nowerserver.tk/stores/branches/'+SharedVars.getStoreId(),
      url: 'http://nowerserver.tk/stores/branches/'+$scope.value,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.rawJSON = JSON.parse(JSON.stringify(response));
      setBranchesListLeft();
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
    });
  }
  //Crea un array con las sucursales donde la promoción no se encuentra registrada.
  function setBranchesListLeft(){
    var listLeft = document.getElementById('selectLeft');
    //var listRight = document.getElementById('selectRight');
    $scope.listRight = document.getElementById('selectRight');
    $scope.allBranches = [];
    for(i = 0; i < $scope.rawJSON.branches.length; i++){
      if(contains($scope.promoBranchesIds,$scope.rawJSON.branches[i].id) == false){
        $scope.allBranches.push($scope.rawJSON.branches[i]);
        addBranchToSelect(listLeft, $scope.rawJSON.branches[i].id, $scope.rawJSON.branches[i].name);
      }

    }
    //createMarkers();
  }

  function addBranchToSelect(listBoxTo,optionValue,optionDisplayText){
    var newOption = document.createElement("option");
    newOption.value = optionValue;
    newOption.text = optionDisplayText;
    listBoxTo.add(newOption, null);
    return true;
  }

  function contains(array, object) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === object) {
        return true;
      }
    }
    return false;
  }
  /*
  function showErrorAlert(errorName, errorMsgs, cont){
    if(cont > 1){
      $scope.alerts = [{ type: 'danger', msg: "Error: " + errorName[0] + " " + errorMsgs[0]}];
      for(i = 1; i < errorMsgs.length; i++){
        $scope.alerts.push({type: 'danger', msg: "Error: " + errorName[i] + " " + errorMsgs[i]});
      }
    } else {
      $scope.alerts = [{ type: 'danger', msg: "Error: " + errorName[0] + " " + errorMsgs[0]}];
    }
  }*/
}])

//.controller('EventArgumentsCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
.controller('PromoArgumenstCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  //getData($http, $scope);
  //Adding timer to feedback messages
  //setInterval(function () {$('#directions').hide();}, 5000);
  document.getElementById("closeDirections").addEventListener("click", closeWindows);
  $scope.$on('mapInitialized', function(evt, evtMap) {
    console.log("Entró al inicializador del mapa");
    $scope.map = evtMap;
  });

  //function getData($http, SharedVars) {
  /*function getData($http, $scope) {
    //Llamamos al ID almacenado
    var selectedPromo = sessionStorage.getItem("selectedPromo");
    var req = {
      method: 'GET',
      //url: 'http://nowerserver.tk/stores/branches/'+SharedVars.getStoreId(),
      url: 'http://nowerserver.tk/promos/'+selectedPromo,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.rawJSON = JSON.parse(JSON.stringify(response));
      fillPromoFields($scope);
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó los detalles de la promoción' }];
    });
  }

  function fillPromoFields($scope){
    var selectedPromo = sessionStorage.getItem("selectedPromo");
    //var indexSelectedBranch = $scope.rawJSON.branches[indexSelectedBranch].index;
    var title = $scope.rawJSON.promo.title;
    var description = $scope.rawJSON.promo.description;
    var terms = $scope.rawJSON.promo.terms;
    var expiration_date = $scope.rawJSON.promo.expiration_date;
    var people_limit = $scope.rawJSON.promo.people_limit;
    $scope.promo.title =title;
    //document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('terms').value = terms;
    document.getElementById('expiration_date').value = expiration_date;
    document.getElementById('people_limit').value = people_limit;
    var pictureURL = $scope.rawJSON.promo.picture.extra_large.url;
    if(pictureURL != null) {
      $("#picture").attr("src","http://nowerserver.tk" + pictureURL);
    }
    setBranchesListRight();
    getBranches($http);
    $scope.promo_id = $scope.rawJSON.promo.id;
  }

  //Crea un array con las sucursales donde la promoción se encuentra registrada.
  function setBranchesListRight(){
    var listLeft = document.getElementById('selectLeft');
    //var listRight = document.getElementById('selectRight');
    $scope.listRight = document.getElementById('selectRight');
    $scope.promoBranches = [];
    $scope.promoBranchesIds = [];
    for(i = 0; i < $scope.rawJSON.promo.branches.length; i++){
      $scope.promoBranches.push($scope.rawJSON.promo.branches[i]);
      $scope.promoBranchesIds.push($scope.rawJSON.promo.branches[i].id);
      addBranchToSelect($scope.listRight, $scope.rawJSON.promo.branches[i].id, $scope.rawJSON.promo.branches[i].name);
    }
    createMarkers();
  }


  function createMarkers(){
    for(i = 0; i < $scope.rawJSON.promo.branches.length; i++){
      var lat = $scope.rawJSON.promo.branches[i].latitude;
      var lng = $scope.rawJSON.promo.branches[i].longitude;
      var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
      var marker = new google.maps.Marker({position: myLatlng, map: $scope.map});
      //console.log("creó marker: " + i );
    }
  }

  function getBranches($http) {
    //Llamamos al ID almacenado
    $scope.value = localStorageService.get("Id");
    var req = {
      method: 'GET',
      //url: 'http://nowerserver.tk/stores/branches/'+SharedVars.getStoreId(),
      url: 'http://nowerserver.tk/stores/branches/'+$scope.value,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.rawJSON = JSON.parse(JSON.stringify(response));
      setBranchesListLeft();
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
    });
  }
  //Crea un array con las sucursales donde la promoción no se encuentra registrada.
  function setBranchesListLeft(){
    var listLeft = document.getElementById('selectLeft');
    //var listRight = document.getElementById('selectRight');
    $scope.listRight = document.getElementById('selectRight');
    $scope.allBranches = [];
    for(i = 0; i < $scope.rawJSON.branches.length; i++){
      if(contains($scope.promoBranchesIds,$scope.rawJSON.branches[i].id) == false){
        $scope.allBranches.push($scope.rawJSON.branches[i]);
        addBranchToSelect(listLeft, $scope.rawJSON.branches[i].id, $scope.rawJSON.branches[i].name);
      }

    }
    //createMarkers();
  }
  */
  /*
  //Esta función pone los marcadores en el mapa
  function createMarker(lat, long){
    var myLatlng = new google.maps.LatLng(parseFloat(lat),parseFloat(long));
    var marker = new google.maps.Marker({position: myLatlng, map: $scope.map, draggable:true});
    $scope.map.setCenter(myLatlng, 15);
    google.maps.event.addListener(marker, 'dragend', function(evt) {
      updateCoordinates(evt.latLng.lat(), evt.latLng.lng());
    });
  }

  function updateCoordinates(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  }
  //no hace nada pero la tengo ahí por si la necesito
  function updateCoordinates(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
  }*/

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
        addBranchToSelect($scope.listRight,listLeft.options[selectedCountry].value,listLeft.options[selectedCountry].text);
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
        addBranchToSelect(listLeft,$scope.listRight.options[selectedCountry].value,$scope.listRight.options[selectedCountry].text);
        $scope.listRight.remove(selectedCountry);
        if($scope.listRight.options.length>0){
          $scope.listRight.options[0].selected=true;
        }
      }
    }
  }

  //Agrega la sucursal a la lista de forma interactiva.
  function addBranchToSelect(listBoxTo,optionValue,optionDisplayText){
    var newOption = document.createElement("option");
    newOption.value = optionValue;
    newOption.text = optionDisplayText;
    listBoxTo.add(newOption, null);
    return true;
  }

  function closeWindows(){
    $('#directions').hide();
  }
  /*
  function contains(array, object) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === object) {
        return true;
      }
    }
    return false;
  }*/

  //Mueve todo para un lado sea izq o der
  $scope.move = function(side){
    var listLeft=document.getElementById('selectLeft');
    //var listRight=document.getElementById('selectRight');
    $scope.listRight = document.getElementById('selectRight');
    if(side == 1) {
      console.log("intento mover para la izquierda");
      while(listLeft.options.length > 0) {
        addBranchToSelect($scope.listRight, listLeft.options[0].value, listLeft.options[0].text);
        listLeft.remove(listLeft.options[0]);
      }
    } else {
      while($scope.listRight.options.length > 0){
        addBranchToSelect(listLeft, $scope.listRight.options[0].value, $scope.listRight.options[0].text);
        $scope.listRight.remove($scope.listRight.options[0]);
      }
    }
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
