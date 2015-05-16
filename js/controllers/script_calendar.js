$(function () {
  $('#datePicker').datetimepicker({
    locale: moment.locale('es'),
    format: 'YYYY-MM-DD'
  });
});

$(function () {
  $('#timePicker').datetimepicker({
    locale: moment.locale('es'),
    format: 'HH:mm'
  });
});

/*$(function () {
  $('#datePicker').datetimepicker();
  $('#timePicker').datetimepicker();
  $("#datePicker").on("dp.change", function (e) {
    $('#timePicker').data("DateTimePicker").minDate(e.date);
  });
  $("#timePicker").on("dp.change", function (e) {
    $('#datePicker').data("DateTimePicker").minDate(e.time);
  });
});*/