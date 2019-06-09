$(document).ready(function(){
  $('#parenthesisBtn').click(function(e){
    e.preventDefault();
    $.ajax({
      url :'/balanced',
      type:'post',
      data:{
        parenthesis:$('#parenthesis').val()
      },
      success: function(data){

      },
      error: function(error){

      }
    });
  });
});
