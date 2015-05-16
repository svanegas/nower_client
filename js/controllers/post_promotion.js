angular.module("post_promotion",['ngMap','LocalStorageModule','ui.bootstrap']) 
  .controller('SendPromotionCtrl', ['$scope','$http', function($scope, $http) {
    $scope.createPromo = function(promo) {
      $scope.alerts =[];
      if( document.getElementById('people_limit').value == '' &&
          document.getElementById('dateTime').value == ''){        
        $scope.alerts.push({type: 'danger', msg: "Debes establecer un límite de personas"});
        $scope.alerts.push({type: 'danger', msg: "Debes establecer una fecha límite"});        
      } else if (document.getElementById('dateTime').value == ''){          
          $scope.alerts.push({type: 'danger', msg: "Debes establecer una fecha límite"});
      } else if (document.getElementById('people_limit').value == ''){
          $scope.alerts.push({type: 'danger', msg: "Debes establecer un límite de personas"});
      } else {
          setJson();
          var formData = new FormData(), $input = $('#picture');
          formData.append('promo[picture]', $input[0].files[0]);
          formData.append('promo[title]', promo.title);
          formData.append('promo[description]', promo.description);
          formData.append('promo[terms]', promo.terms);
          promo.date = document.getElementById('dateTime').value;
          formData.append('promo[expiration_date]', promo.date);
          formData.append('promo[people_limit]', promo.people_limit);
          formData.append('promo[branches]', JSON.stringify($scope.arrayIds));
          sendData(formData); 
      }
    }

    function sendData(data) {
      $.ajax({
        url: "http://nowerserver.tk/promos",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (response) {
          console.log(JSON.stringify(response));
          evaluateResponse(response);
        },
        error: function(response) {
          evaluateResponse(response.responseJSON);
        }
      });
    }

    function evaluateResponse(response){
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
        //id ["email"] = email;
        $scope.arrayIds.push(id);
      }
      console.log(JSON.stringify($scope.arrayIds));
    }
  }])

  //.controller('EventArgumentsCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
  .controller('EventArgumentsCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {


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
        console.log("intento mover para la izquierda");
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
