angular.module('App.services', [])

//Este servicio almacena los valores de latitud y longitud registradas por
//el marcador del mapa.
.service('SharedVars', function () {
  var storeId;
    return {
    getStoreId: function () {
      console.log("Llego a get");
      return storeId;
    },
    setStoreId: function(value) {
      console.log("Llego a set");
      storeId = value;
    }
  };  
});