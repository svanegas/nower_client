var app = angular.module('myapp', ['ngMap']);

app.controller('JsonCtrl', ['$scope', function($scope) {
	$scope.createPromo = function(promo) {
        console.log(JSON.stringify(promo));
		var name = promo.name;
		var address = promo.address;
		var phone = promo.phone;
		//var lat = promo.lat;
		//var lng = promo.lng;
        var lat = document.getElementById('latitude').value;
		var lng = document.getElementById('longitude').value;
		var jsonPromo = {
      		"name": name,
      		"address": address,
      		"phone": phone,
      		"latitude": lat,
      		"longitude": lng
    	}
    	var branch = {
      		"branch": jsonPromo
    	}
		console.log(jsonPromo);
		//$http.post(url, branch);
        //sendData(branch, $http
	} 
    
    function sendData(data, $http){
            $http.post('/someUrl', {msg:'hello word!'}).
            success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            }).
            error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }
    
}]);



app.controller('EventArgumentsCtrl', ['$scope', function($scope) {
	var map;	
	$scope.justOne = true;
	//$scope.mesa = "gola";	
	$scope.$on('mapInitialized', function(evt, evtMap) {			  
		map = evtMap;
        /**
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
        **/
        
	});

	function updateCoordinates(lat, lng) {
		document.getElementById('latitude').value = lat;
		document.getElementById('longitude').value = lng;
	}
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
}]);


