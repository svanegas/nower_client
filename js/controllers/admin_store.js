angular.module("admin_store",['ngMap','LocalStorageModule','ui.bootstrap'])

.controller('EditStoreCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  $scope.store={};
  loadCategories();
  $scope.modifyStore = function(store) {
    $scope.alerts =[];
    var formData = new FormData(), $input = $('#logoInput');
    $scope.value = localStorageService.get("Id");
    formData.append('store[logo]', $input[0].files[0]);
    formData.append('store[id]', $scope.value);
    formData.append('store[name]', store.name);
    formData.append('store[email]', store.email);
    formData.append('store[main_phone]', store.phone);
    formData.append('store[category_id]', $scope.categoriesIdsDropdown[store.category]);
    formData.append('store[nit]', store.nit);
    sendModifyStoreData(formData);
  }

  function sendModifyStoreData(data) {
    $scope.value = localStorageService.get("Id");
    $.ajax({
      url: "http://nowerserver.tk/stores",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'PATCH',
      success: function (response) {
        console.log(JSON.stringify(response));
        evaluateModyfyStoreResponse(response);
      },
      error: function(response) {
        evaluateModyfyStoreResponse(response.responseJSON);
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

  function evaluateModyfyStoreResponse(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      $scope.alerts = [{ type: 'success', msg: '¡Tienda modificada! :)' }];
      document.forms["modifyStoreForm"].reset();
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

  function getStoreData($http, $scope) {
    //Llamamos al ID almacenado
    $scope.value = localStorageService.get("Id");
    var req = {
      method: 'GET',
      url: 'http://nowerserver.tk/stores/' + $scope.value,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log("successful request to get store details");
      console.log(JSON.stringify(response));
      $scope.storeDetailsJSON = JSON.parse(JSON.stringify(response));
      fillStoreFields($scope);
    }).error(function() {
      console.log("failed request");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó los detalles de la tienda' }];
    });
  }

  function fillStoreFields($scope){
    var name = $scope.storeDetailsJSON.store.name;
    var email = $scope.storeDetailsJSON.store.email;
    // Será utilizado para actualzar la contraseña.
    $scope.storeEmail = email;
    //pendiente revisar cambio de la contraseña.
    var phone = $scope.storeDetailsJSON.store.main_phone;
    var nit = $scope.storeDetailsJSON.store.nit;
    category_id = $scope.storeDetailsJSON.store.category_id;
    $scope.store.name = name;
    $scope.store.email = email;
    //pendiente revisar cambio de la contraseña.
    $scope.store.phone = phone;
    $scope.store.nit = nit;
    var sel = document.getElementById("categories");
    console.log($scope.categoriesIndexesDropdown["132"]);
    sel.selectedIndex = $scope.categoriesIndexesDropdown[category_id];
    var logoURL = $scope.storeDetailsJSON.store.logo.medium.url;
    if(logoURL != null) {
      $("#logo").attr("src","http://nowerserver.tk" + logoURL);
    }
    $scope.store_id = $scope.storeDetailsJSON.store.id;
  }

  function loadCategories(){
    var req = {
      method: 'GET',
      url: 'http://nowerserver.tk/categories',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
      console.log(JSON.stringify(response));
      $scope.categoriesJSON = JSON.parse(JSON.stringify(response));
      createCatogriesArray();
      getStoreData($http, $scope);
    }).error(function() {
      console.log("Failed request");
      $scope.alerts = [{ type: 'danger', msg: 'No cargó las categorias' }];
    });
  }

  //Crea un array con las categorias
  function createCatogriesArray(){
    $scope.categoriesIdsDropdown = new Object();
    $scope.categories = $scope.categoriesJSON.categories;
    $scope.arrayCategoriesNames = [];
    for(i = 0; i < $scope.categories.length; i++){
      var jsonObject = $scope.categoriesJSON.categories[i];
      $scope.categoriesIdsDropdown[jsonObject.name] = jsonObject.id;
      $scope.arrayCategoriesNames.push(jsonObject.name);
    }
    fillDropDown();
  }
  //Agrega las categorias al dropdown.
  function fillDropDown(){
    var sel = document.getElementById('categories');
    $scope.categoriesIndexesDropdown = new Object();
    for(var i = 0; i < $scope.arrayCategoriesNames.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = $scope.arrayCategoriesNames[i];
      opt.value = $scope.arrayCategoriesNames[i];
      sel.appendChild(opt);
      $scope.categoriesIndexesDropdown[$scope.categories[i].id] = i+1;
    }
  }

  $scope.changePassword = function(store) {
    var formData = new FormData();
    $scope.value = localStorageService.get("Id");
    formData.append('store[password]', store.password);
    formData.append('store[password_confirmation]', store.password_confirmation);
    formData.append('store[id]', $scope.value);
    sendChangePasswordData(formData);
  }
  function sendChangePasswordData(data) {
    $scope.value = localStorageService.get("Id");
    $.ajax({
      url: "http://nowerserver.tk/stores",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'PATCH',
      success: function (response) {
        console.log(JSON.stringify(response));
        evaluteChangePasswordResponse(response);
      },
      error: function(response) {
        evaluteChangePasswordResponse(response.responseJSON);
      }
    });
  }

  function evaluteChangePasswordResponse(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      $scope.alerts = [{ type: 'success', msg: '¡La contraseña se cambió correctamente! :)' }];
      document.forms["changePasswordForm"].reset();
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
}])


.controller('deleteStoreCtrl', ['$scope','$http','localStorageService', function($scope, $http, localStorageService) {
  $scope.deleteStore = function(store) {
    $scope.storeToDelete = localStorageService.get("Id");
    console.log("storeId: " + $scope.storeToDelete);
    sendDeleteStoreRequest($http, $scope.storeToDelete);
  }

  function sendDeleteStoreRequest($http, id) {
    var req = {
      method: 'DELETE',
      url: 'http://nowerserver.tk/stores/' + id,
    }
    $http(req).success(function(response) {
      console.log("ya");
      console.log(JSON.stringify(response));
      //$scope.rawJSON = JSON.parse(JSON.stringify(response));
      evaluateResponseDelete(response);
    }).error(function(response) {
      console.log("otra cosa");
      evaluateResponseDelete(response);
    });
  }

  function evaluateResponseDelete(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      console.log("¡Tienda eliminada!");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("storeId");
      window.location.assign("../index.html");
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

}])
.controller('AlertDemoCtrl', function ($scope) {
  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
});
