//var app = angular.module('create_store', ['ngMap']);

angular.module("create_store",['ui.bootstrap'])

.controller('SendStoreCtrl', ['$scope','$http', function($scope, $http) {
  $scope.createStore = function(store) {
    var formData = new FormData(), $input = $('#logo');
    formData.append('store[logo]', $input[0].files[0]);
    formData.append('store[name]', store.name);
    formData.append('store[email]', store.email);
    formData.append('store[password]', store.password);
    formData.append('store[password_confirmation]', store.password_confirmation);
    formData.append('store[main_phone]', store.phone);
    formData.append('store[category_id]', 1);

    sendData(formData);
  }

  function sendData(data, $http) {
    $.ajax({
      url: "http://nowerserver.tk/stores",
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
