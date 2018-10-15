$(function(){
  /*
    variables to be used in the code
  */
  var welcome = $('.welcome');
  var dashboardcontent = $('.content');
  var auth = $('.auth');
  var selection = $('.selection');
  var option = $('.logo');
  var option_bar = $('.option_bar');
  var content_section = $('.content_section');
  var home = "https://localhost:3000/home";
  var register = "https://localhost:3000/register";

  /*
    Check if it is the home page of the facebook accounts page
  */
  if (location.href != register ){

  function SplashScreenIntro() {
    setTimeout(function(){
      welcome.removeClass('content-hidden');
    }, 500, SplashScreenOutro());
  }

  function SplashScreenOutro() {
    setTimeout(function(){
      welcome.addClass("disappear")
    }, 3000, reveal());
  }

  function reveal() {
    setTimeout(function(){
      dashboardcontent.addClass("reveal");
    }, 4500,optionBar());
  }

  function revealInstant() {
    setTimeout(function(){
      dashboardcontent.addClass("reveal");
    }, 500, optionBarInstant());
  }

  function optionBar() {
    setTimeout(function(){
      option_bar.removeClass("hidden");
    }, 5500, contentSection());
  }

  function optionBarInstant() {
    setTimeout(function(){
      option_bar.removeClass("hidden");
    }, 1500, contentSectionInstant());
  }

  function contentSection() {
    setTimeout(function(){
      content_section.removeClass("hidden");
    }, 6000);
  }

  function contentSectionInstant() {
    setTimeout(function(){
      content_section.removeClass("hidden");
    }, 2000);
  }

  function goToPage(href){
    setTimeout(function(){
      window.location = href;
    }, 500);
  }


  function clearContent(href){
    setTimeout(function(){
      dashboardcontent.removeClass("reveal");
    }, 9500, goToPage(href));
  }


    if(!Cookies.get("visits")){
      SplashScreenIntro();
      Cookies.set("visits", 1);
    }
    else {
      revealInstant();
    }
/*
      $('.fa-play').click(function(e){
        e.preventDefault();
        setTimeout(function(){
          content_section.addClass("hidden");
        }, 300, clearContent(this.href));

      });
*/
  }

  else if (location.href == register) {
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

  $('.carousel').carousel({
  interval: 3000
  })

});
