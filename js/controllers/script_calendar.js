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