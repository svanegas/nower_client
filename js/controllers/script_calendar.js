$(document).ready(function(){

$(function(){
  
  $(".dropdown-menu li a").click(function(){
    
    $(".btn:first-child").text($(this).text());
    $(".btn:first-child").val($(this).text());
  });

});

$('#datePicker').datepicker({
    format: 'mm/dd/yyyy'
  }).on('changeDate', function(e) {
    // Revalidate the date field
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
          format: 'MM/DD/YYYY',
          message: 'The date is not a valid'
        }
      }
    }
  }
});

});
