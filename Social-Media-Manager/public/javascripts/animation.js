$(function(){
  var welcome = $('.welcome');
  var auth = $('.auth');

  if (location.href == "https://localhost:3000/home"){
  function SplashScreenIntro() {
    setTimeout(function(){
      welcome.removeClass('content-hidden');
    }, 500, SplashScreenOutro());
  }
  function SplashScreenOutro() {
    setTimeout(function(){
      welcome.addClass("disappear")
    }, 3000,SplashScreenOutroRemove());
  }

  function SplashScreenOutroRemove() {
    setTimeout(function(){
      welcome.addClass("remove")
    }, 4000);
  }

  SplashScreenIntro();
  }

  else if (location.href == "https://localhost:3000/signup") {
    function SplashScreenIntro() {
      setTimeout(function(){
        auth.removeClass('content-hidden');
      }, 500);
    }

    SplashScreenIntro();

    $('#login').click(function(){
      setTimeout(function(){
      auth.addClass('content-hidden');
      SplashScreenIntro();
      }, 300);
      setTimeout(function(){
      $('.login-form').removeClass('swipe');
      $('.login-form').addClass('swipeback');
      $('.signup-form').removeClass('swipeback');
      $('.signup-form').addClass('swipe');

    }, 750);

    });

    $('#signup').click(function(){
      setTimeout(function(){
      auth.addClass('content-hidden');
      SplashScreenIntro();
    }, 300);
      setTimeout(function(){
      $('.login-form').removeClass('swipeback');
      $('.login-form').addClass('swipe');
      $('.signup-form').removeClass('swipe');
      $('.signup-form').addClass('swipeback');
    }, 800);
    });

  }
});
