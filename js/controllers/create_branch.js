angular.module("create_branch",['ngMap','LocalStorageModule','ui.bootstrap'])
.controller('SendBranchCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  $scope.createBranch = function(branch) {
    var confirmation = confirm("¿Estas seguro que deseas crear esta sucursal?");
    if(confirmation == true){
      console.log(JSON.stringify(branch));
      var store_id = localStorageService.get("Id"); ;
      var name = branch.name;
      var address = branch.address;
      var phone = branch.phone;
      var lat = document.getElementById('latitude').value;
      var lng = document.getElementById('longitude').value;
      var jsonBranch = {
       "store_id": store_id,
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
      method: 'POST',
      url: '//nowerserver.tk/branches',
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

  /**
  function getData($http) {
    console.log("holi");
    var req = {
      method: 'GET',
      url: '//nowerserver.tk/stores/branches/42',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      rawJSON = JSON.parse(JSON.stringify(response));
      console.log(rawJSON);
    }).error(function() {
      console.log("otra cosa");
    });
  }
  **/


    function evaluteResponse(response){
      console.log(JSON.stringify(response));
      state = response.success;
      if(state){
        $scope.alerts = [{ type: 'success', msg: '¡Sucursal creada! :)' }];
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
      $("#alert").ready(function(){
        $("html, body").delay(0).animate({
            scrollTop: $('#alert').offset().top - 100
        }, 0);
      });
  }


  function showErrorAlert(errorName, errorMsgs, cont){
    if(cont > 1){
      $scope.alerts = [{ type: 'danger', msg: "Error: " + errorName[0] + " " + errorMsgs[0]}];
      console.log("mostró alerta");
      for(i = 1; i < errorMsgs.length; i++){
          $scope.alerts.push({type: 'danger', msg: "Error: " + errorName[i] + " " + errorMsgs[i]});
      }
    } else {
          $scope.alerts = [{ type: 'danger', msg: "Error: " + errorName[0] + " " + errorMsgs[0]}];
    }

  }




}])



.controller('BranchMapCtrl', ['$scope', function($scope) {
	//setInterval(function () {$('#directions').hide();}, 5000);
  document.getElementById("closeDirections").addEventListener("click", closeWindows);
	var map;
	$scope.justOne = true;
	$scope.$on('mapInitialized', function(evt, evtMap) {
		map = evtMap;
		$scope.placeMarker = function(e) {
      if($scope.justOne) {
				console.log(JSON.stringify(e));
        console.log(e.latLng);
				var marker = new google.maps.Marker({position: e.latLng, map: map, draggable:true});
				updateCoordinates(e.latLng.A, e.latLng.F);
				map.panTo(e.latLng);
				$scope.justOne = false;
				google.maps.event.addListener(marker, 'dragend', function(evt) {
				  updateCoordinates(evt.latLng.lat(), evt.latLng.lng());
				});
			}
		}
	});

  function closeWindows(){
    $('#directions').hide();
  }

	function updateCoordinates(lat, lng) {
		document.getElementById('latitude').value = lat;
		document.getElementById('longitude').value = lng;
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
