angular.module("detail_promotion",['LocalStorageModule'])

  .controller('GetDataJson', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {

    //Get var with Json from LocalStorageModule
  //  $scope.value = localStorageService.get("details");

    document.getElementById('user').innerHTML = localStorageService.get("user");
    document.getElementById('title').innerHTML = localStorageService.get("title");
    document.getElementById('description').innerHTML = localStorageService.get("description");
    document.getElementById('expiration_date').innerHTML = localStorageService.get("expiration_date");
    document.getElementById('available_redemptions').innerHTML = localStorageService.get("available_redemptions");

    /*console.log(localStorageService.get("user"));
    console.log(localStorageService.get("title"));
    console.log(localStorageService.get("description"));
    console.log(localStorageService.get("expiration_date"));
    console.log(localStorageService.get("available_redemptions"));
    console.log(localStorageService.get("picture"));*/
    var pictureURL = localStorageService.get("picture");
    if(pictureURL != null) {
      $("#picture").attr("src","http://nowerserver.tk" + pictureURL);
    }

    $scope.alerts = [{ type: 'success', msg: '¡Promoción redimida correctamente! ✓' }];

  }]);
