var app = angular.module('create_branch', ['ngMap']);

app.controller('JsonCtrl', ['$scope','$http', function($scope, $http) {
	$scope.createBranch = function(branch) {
        console.log(JSON.stringify(branch));
		var store_id = "42";
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
    
    function sendData(data, $http) {
      var req = {
        method: 'POST',
        url: 'http://nowerserver.herokuapp.com/branches',
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



app.controller('EventArgumentsCtrl', ['$scope', function($scope) {
	var map;	
	$scope.justOne = true;
	//$scope.mesa = "gola";	
	$scope.$on('mapInitialized', function(evt, evtMap) {			  
		map = evtMap;
		$scope.placeMarker = function(e) {
            if($scope.justOne) {
				console.log(JSON.stringify(e));
				var marker = new google.maps.Marker({position: e.latLng, map: map, draggable:true});		 				
				updateCoordinates(e.latLng.k, e.latLng.D);
				map.panTo(e.latLng);			  				
				$scope.justOne = false;
				google.maps.event.addListener(marker, 'dragend', function(evt) {
				  updateCoordinates(evt.latLng.lat(), evt.latLng.lng());															
				});
			}				
		}
	});

	function updateCoordinates(lat, lng) {
		document.getElementById('latitude').value = lat;
		document.getElementById('longitude').value = lng;
	}
}]);
