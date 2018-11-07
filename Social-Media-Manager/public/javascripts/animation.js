$(function(){
  /*
    variables to be used in the code
  */
  var welcome = $('.welcome');
  var clock = $('.clock');
  var col = $('.col-md-4');
  var home = "https://localhost:3000/home";
  var homeRedirected = "https://localhost:3000/home#_=_";
  var started = "https://localhost:3000/getStarted";
  var fade = $('.fade-in');

  if (location.href == started ){
    fade.removeClass('content-hidden');
  }
  if (location.href == home || location.href == homeRedirected){
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
      $('.fb.column').removeClass('content-hidden');
      $('#fb-btn').addClass("content-hidden");
      return false;
    });

    $('#instagram').submit(function(e){
      e.preventDefault();
      clearContent(this.href);
      $('.insta.column').removeClass('content-hidden');
      $('#insta-btn').addClass("content-hidden");
      return false;
    });

    $('.fb.close').click(function(e) {
      e.preventDefault();
      console.log(this.href);
      $(this).closest('.column').addClass('content-hidden');
      $('#fb-btn').removeClass("content-hidden");
    });

    $('.insta.close').click(function(e) {
      e.preventDefault();
      console.log(this.href);
      $(this).closest('.column').addClass('content-hidden');
      $('#insta-btn').removeClass("content-hidden");
    });

    $('#fb-btn').click(function(e){
      e.preventDefault();
      $('#fb-btn').addClass("content-hidden");
      $('.fb.column').removeClass("content-hidden");
    })

    $('#insta-btn').click(function(e){
      e.preventDefault();
      $('#insta-btn').addClass("content-hidden");
      $('.insta.column').removeClass("content-hidden");
    })

    SplashScreenIntro();
  }

});
