angular.module('App.services', [])

//Este servicio almacena los valores de latitud y longitud registradas por
//el marcador del mapa.
.service('SharedVars', function () {
  var lat;
  var lng;

  return {
    getLat: function () {
      return lat;
    },
    setLat: function(value) {
      lat = value;
    },
    getLng: function () {
      return lng;
    },
    setLng: function(value) {
      lng = value;
    }
  };
});