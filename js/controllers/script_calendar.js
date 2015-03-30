$(document).ready(function(){

$(function(){
  
  $(".dropdown-menu li a").click(function(){
    $(".btn:first-child").text($(this).text());
    $(".btn:first-child").val($(this).text());
  });
});

$('#datePicker').datepicker({
    format: 'dd/mm/yyyy'
  }).on('changeDate', function(e) {
    $('#eventForm').formValidation('revalidateField', 'date');
});

$('#eventForm').formValidation({
  framework: 'bootstrap',
  icon: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  fields: {
    name: {
      validators: {
        notEmpty: {
          message: 'The name is required'
        }
      }
    },
    date: {
      validators: {
        notEmpty: {
          message: 'The date is required'
        },
        date: {
          format: 'DD/MM/YYYY',
          message: 'The date is not a valid'
        }
      }
    }
  }
});

});
