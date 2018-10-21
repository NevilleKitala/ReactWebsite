$(function(){
  /*
    variables to be used in the code
  */
  var welcome = $('.welcome');
  var clock = $('.clock');
  var col = $('.col-md-4');
  var register = "https://localhost:3000/register";

  if (location.href != register ){
    function SplashScreenIntro() {
      setTimeout(function(){
        welcome.removeClass('content-hidden');
        clock.removeClass('content-hidden');
        col.removeClass('content-hidden');
      }, 500);
    }

    function goToPage(href){
      setTimeout(function(){
        window.location = href;
      }, 6500, workspaceIntro());
    }

    function workspaceIntro(){
      setTimeout(function(){
        $('.workspace').removeClass("content-hidden");
      }, 300);
    }

    function clearContent(href){
      setTimeout(function(){
        welcome.addClass('content-hidden');
        clock.addClass('content-hidden');
        col.addClass('content-hidden');
      }, 500, workspaceIntro());
    }

    $('#facebook').submit(function(e){
      e.preventDefault();
      clearContent(this.href);
      return false;
    });

    SplashScreenIntro();
  }
});
