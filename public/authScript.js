$(document).ready(function(){
  $("#registerBtn").click(function(e){
    let registrationMessage = $('#registrationMessage');
    e.preventDefault();
    $.ajax({
      url:'/api/auth/register',
      type:'post',
      data:{
        email    : $('#registerEmail').val(),
        password : $('#registerPwd').val(),
        username : $('#registerUserName').val(),
        dob      : $('#registerDob').val(),
        role     : $('#registerRole').val()
      },
      success : function(result){
        registrationMessage.removeClass('text-danger');
        registrationMessage.addClass('text-success');
        registrationMessage.html('Registration Successfully')
      },
      error : function(error){
        registrationMessage.removeClass('text-success');
        registrationMessage.addClass('text-danger');
        registrationMessage.html('Registration Failure');
      }
    });
  });

  $("#loginBtn").click(function(e){
    let loginMessage = $('#loginMessage')
    e.preventDefault();
    $.ajax({
      url:'/api/auth/login',
      type:'post',
      data:{
        password : $('#loginPwd').val(),
        username : $('#loginUserName').val(),
      },
      success : function(result){
        window.location.replace('/user');
      },
      error : function(error){
        loginMessage.addClass('text-danger');
        loginMessage.html('Authentication Failed');
      }
    });
  });
});
