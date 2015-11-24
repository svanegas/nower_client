//var app = angular.module('create_store', ['ngMap']);

angular.module("create_store",['ui.bootstrap', 'LocalStorageModule'])

.controller('SendStoreCtrl', ['$scope','$http', 'localStorageService', '$window', function($scope, $http, localStorageService, $window) {
  loadCategories();


  $scope.createStore = function(store) {
    var formData = new FormData(), $input = $('#logo');
    formData.append('store[logo]', $input[0].files[0]);
    formData.append('store[name]', store.name);
    formData.append('store[email]', store.email);
    $scope.email = store.email;
    formData.append('store[password]', store.password);
    $scope.password = store.password;
    formData.append('store[password_confirmation]', store.password_confirmation);
    formData.append('store[main_phone]', store.phone);
    formData.append('store[category_id]', $scope.map[store.category]);
    formData.append('store[nit]', store.nit);
    sendData(formData);
  }

  function sendData(data, $http) {
    $.ajax({
      url: "//nowerserver.tk/stores",
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
        $scope.alerts = [{ type: 'success', msg: '¡Tienda creada! :)' }];
        login();
        document.forms["store_form"].reset();
        //$scope.move(2);
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

  function login(){
    var email = $scope.email;
    var password = $scope.password;
    var jsonStore = {
      "email": email,
      "password": password,
    }
    var store = {
      "store": jsonStore
    }
    console.log(jsonStore);
    sendDataLogin(store, $http, $window);
  }

  function sendDataLogin(data, $http, $window) {
    var req = {
      method: 'POST',
      url: '//nowerserver.tk/stores/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }
    $http(req).success(function(response) {
      console.log("ya");
      evaluteResponseLogin(response);
    }).error(function(response) {
      console.log("otra cosa");
      evaluteResponseLogin(response);
    });
  }

    function evaluteResponseLogin(response){
    console.log(JSON.stringify(response));
    state = response.success;
    if(state){
      //$scope.store_id = response.store.store_id;
      console.log(response.store.token);
      console.log(response.store.store_id);
      //Almacenamos el ID del cliente
      //localStorageService.set("Id", response.store.store_id);
      console.log(response.store.store_id);
      //Saving User Data
      //sessionStorage.setItem("token", response.store.token);
      //sessionStorage.setItem("storeId", response.store.store_id);
      $window.location = '../index.html';
    }else{
      $scope.alerts = [{ type: 'danger', msg: "Error: email o contraseña incorrectos"}];
    }
  }

  function loadCategories(){
    var req = {
      method: 'GET',
      url: '//nowerserver.tk/categories',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    $http(req).success(function(response) {
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
      //$scope.categories = [];
      $scope.map = new Object();
      $scope.categories = $scope.rawJSON.categories;
      $scope.arrayCategoriesNames = [];
      for(i = 0; i < $scope.categories.length; i++){
        //$scope.categories.push($scope.rawJSON.categories[i]);
        var jsonObject = $scope.rawJSON.categories[i];
        $scope.map[jsonObject.name] = jsonObject.id;
        $scope.arrayCategoriesNames.push(jsonObject.name);
      }
      fillDropDown();
    }

  function get(k) {
    return $scope.map[k];
  }

  function fillDropDown(){
    var sel = document.getElementById('categories');
    for(var i = 0; i < $scope.arrayCategoriesNames.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = $scope.arrayCategoriesNames[i];
      opt.value = $scope.arrayCategoriesNames[i];
      sel.appendChild(opt);
    }
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


  $(function(){
    $(".dropdown-menu").on('click', 'li a', function(){
      $(".btn:first-child").text($(this).text());
       $(".btn:first-child").val($(this).text());
    });
  });
}]);
