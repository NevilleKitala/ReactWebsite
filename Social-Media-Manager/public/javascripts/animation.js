$(function(){
  var welcome = $('.welcome');
  var auth = $('.auth');
  var selection = $('.selection');
  var option = $('.logo');

  if (location.href == "https://localhost:3000/home"){
  function SplashScreenIntro() {
    setTimeout(function(){
      welcome.removeClass('content-hidden');
    }, 500, SplashScreenOutro());
  }
  function SplashScreenOutro() {
    setTimeout(function(){
      welcome.addClass("disappear")
    }, 3000,loadCards(4000));
  }

    function loadCards() {
    setTimeout(function(){
      selection.removeClass("hidden")
    }, 4000 ,loadLogos());
  }

  function loadCardsRecursive() {
  setTimeout(function(){
    selection.removeClass("hidden")
  }, 400 ,loadLogos());
}

    function loadLogos(){
      setTimeout(function(){
        option.removeClass("transparent")
      }, 2500);
    }

    if(!Cookies.get("visits")){
      SplashScreenIntro();
      Cookies.set("visits", 1);
    }
    else {
      loadCardsRecursive();
    }
  }

  else if (location.href == "https://localhost:3000/register") {
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

    $('.submit-signin').click(function(){
      setTimeout(function(){
      auth.addClass('content-hidden');
      $('form-login').submit();
      }, 300);
      setTimeout(function(){
      auth.addClass('disappear');
    }, 800);
    setTimeout(function(){
      $('form-signin').submit();
    }, 1000);
    });

    $('.submit-login').click(function(){
      setTimeout(function(){
      auth.addClass('content-hidden');
      $('form-login').submit();
      }, 300);
      setTimeout(function(){
      auth.addClass('disappear');
    }, 800);
    setTimeout(function(){
      $('form-login').submit();
    }, 1000);

    });

  }
});
