angular.module("admin_promotions",['ngMap','LocalStorageModule','ui.bootstrap'])

.controller('AdminPromotionCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  $scope.value = localStorageService.get("Id");
  getData($http);
  function getData($http) {
    //Llamamos al ID almacenado
    $scope.value = localStorageService.get("Id");
    var req = {
      method: 'GET',      
      url: 'http://nowerserver.tk/stores/branches/'+$scope.value,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.names = response.branches;
      $("#branchesTable").delegate("td", "click", function(e) {
        var col = $(this).parent().children().index($(this));
        var row = $(this).parent().parent().children().index($(this).parent());
        console.log("col: " + col + " row: " + row);
        console.log("voy");
        if(col == 3){
          modifyItem(row);
        }
        if(col == 4){
          deleteItem(row);
        }
      });
      $scope.rawJSON = JSON.parse(JSON.stringify(response));      
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
    });
  }
  //Crea un array con los branches
  function deleteItem(row){
    var idBranch = $scope.rawJSON.branches[row - 1].id;
    deleteBranch($http, idBranch);
  }
  function modifyItem(row){
    var idBranch = $scope.rawJSON.branches[row - 1].id;
    sessionStorage.setItem("selectedBranch", row - 1);
    window.location.href = "modify_promotions.html";
  }
  function deleteBranch($http, id) {
    var req = {
      method: 'DELETE',      
      url: 'http://nowerserver.tk/branches/'+ id,
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      $scope.rawJSON = JSON.parse(JSON.stringify(response));
      evaluateResponse(response);
    }).error(function(response) {
      console.log("otra cosa");
      evaluateResponse(response);      
    });
  }
  function evaluateResponse(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      console.log("El estado es bueno");
      location.reload();
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
}])

.controller('AlertDemoCtrl', function ($scope) {
  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});
