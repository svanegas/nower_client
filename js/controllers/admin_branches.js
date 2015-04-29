//var app = angular.module('myapp', ['ngMap','App.services','ui.bootstrap']);

angular.module("admin_branches",['ngMap','LocalStorageModule','ui.bootstrap'])
//angular.module("post_promotion",['ngMap','LocalStorageModule'])

//.controller('EventArgumentsCtrl', ['$scope','$http','SharedVars', function($scope, $http, SharedVars) {
.controller('AdminBranchesCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  $scope.value = localStorageService.get("Id");
  //$http.get('http://nowerserver.tk/stores/branches/'+ $scope.value)
  //.success(function (response) {$scope.names = response.branches;});
  getData($http);
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
      createBranchesTable();
    }).error(function() {
      console.log("otra cosa");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
    });
  }
  //Crea un array con los branches
  function createBranchesTable(){
    /*var listBranches = document.getElementById('selectBranch');
    $scope.branches = [];
    tableElem = document.getElementById("branches");
    for(i = 0; i < $scope.rawJSON.branches.length; i++){
      rowElem = document.createElement('tr');
      var name = $scope.rawJSON.branches[i].name;
      for (var j = 0; j < 3; j++) {
        colElem = document.createElement('td');
        switch(j) {
          case 0:
            colElem.appendChild(document.createTextNode(i + 1)); //to print cell number
            rowElem.appendChild(colElem);
            break;
          case 1:
            colElem.appendChild(document.createTextNode(name)); //to print cell number
            rowElem.appendChild(colElem);
            break;
          case 2:
            var oImg = document.createElement("img");
            oImg.setAttribute('src', '../rs/img/edit.png');
            oImg.setAttribute('alt', 'na');
            oImg.setAttribute('height', '20');
            oImg.setAttribute('width', '30');
            oImg.onclick = modifyItem(rowElem);
            colElem.appendChild(oImg); //to print cell number
            rowElem.appendChild(colElem);
          case 3:
            var oImg = document.createElement("img");
            oImg.setAttribute('src', '../rs/img/trash.png');
            oImg.setAttribute('alt', 'na');
            oImg.setAttribute('height', '20');
            oImg.setAttribute('width', '30');
            oImg.onclick = deleteItem(rowElem);
            colElem.appendChild(oImg); //to print cell number
            rowElem.appendChild(colElem);
          }
        }
        tableElem.appendChild(rowElem);
      }*/
  }
  function deleteItem(row){
    var idBranch = $scope.rawJSON.branches[row - 1].id;
    deleteBranch($http, idBranch);
  }
  function modifyItem(row){
    var idBranch = $scope.rawJSON.branches[row - 1].id;
    sessionStorage.setItem("selectedBranch", row - 1);
    window.location.href = "modify_branches.html";
  }
  function deleteBranch($http, id) {
    var req = {
      method: 'DELETE',
      //url: 'http://nowerserver.tk/stores/branches/'+SharedVars.getStoreId(),
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
      //$scope.alerts = [{ type: 'danger', msg: 'No cargó las sucursales' }];
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
