$(document).ready(function() {
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '182924785910131',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.1'
    });


    var uid = document.getElementById("facebook-id").value;
    var accessToken =document.getElementById("facebook-token").value;

    //function to get the pages linked to the facebook account
  function getFeed(pageid){
    var fields = 'name, message, story, comments{comments{attachments,from,id,message,created_time},from,id,message,created_time},attachments, created_time';

    FB.api('/' + pageid + '/feed?access_token='+accessToken+'&fields=' + fields + '' , response => {

      if(response.data) {
        $('.selectPage').addClass("content-hidden");
        $('.optionbar').removeClass("content-hidden");
        $('.feed').removeClass("content-hidden");

        $.each(response.data,function(index,item) {
          var message = [];
          var split = item.message.split("#", 10);
          var time = item.created_time.replace("T", ' ').replace(/\+.+/, '').split(" ",2)[1].split(":",2)[0] +
          ":" +
          item.created_time.replace("T", ' ').replace(/\+.+/, '').split(" ",2)[1].split(":",2)[1];
          var date =  item.created_time.split("-", 1)[0] + "/"
          + item.created_time.split("-", 2)[1] + "/"
          + (item.created_time.split("-", 3)[2]).split("T", 1)[0] + ".";
          for (var i = 1; i < split.length; i ++){
            message.push("#" + split[i]);
          }
          if(item.attachments){
            for(var i = 0; i < item.attachments.data.length; i++){

              if(item.attachments.data[i].subattachments){
                document.getElementById('feedcontent').innerHTML += "<div class = 'post'><div class  = 'story'><h2 style = 'font-size: 0.95em;'>" +
                (item.message.split("#", 1))[0] +
                "</h2><h5 style = 'font-size: 0.75em; color: var(--color-highlighted);'>" + message
                 + "</h5></div><div class = 'postimage' id = 'image'></div><div class = 'time'><p style = 'color: var(--color-light);font-size:0.75em;text-align:left;'>" + date
                 + " at " + time + "</p></div>"
                 + "<div class = 'image'>"
                 + "<script>$(function(){$('.carousel').carousel({interval: 3000})});</script>"
                 + "<div id='carouselExampleSlidesOnly' class='carousel slide' data-ride='carousel' onCarousel = 'interval: 3000;'>"
                   + "<div class='carousel-inner' id = 'inner" + index +"'>"
                    +"<div class='carousel-item active'>"
                       +"<img class='d-block w-100' src = '" + item.attachments.data[i].subattachments.data[0].media.image.src + "'>"
                     +"</div>"
                   +"</div>"
                 +"</div>"
                 + "</div></div>";
                for(var j = 1; j < item.attachments.data[i].subattachments.data.length; j++){
                    document.getElementById('inner' + index).innerHTML +=
                  "<div class='carousel-item'><img class='d-block w-100' src = '" + item.attachments.data[i].subattachments.data[j].media.image.src + "'></div>";
                }
              }
              else{
                document.getElementById('feedcontent').innerHTML += "<div class = 'post'><div class  = 'story'><h2 style = 'font-size: 0.95em;'>" +
                (item.message.split("#", 1))[0] +
                "</h2><h5 style = 'font-size: 0.75em; color: var(--color-highlighted);'>" + message
                 + "</h5></div><div class = 'postimage' id = 'image'></div><div class = 'time'><p style = 'color: var(--color-light);font-size:0.75em;text-align:left;'>" + date
                 + " at " + time + "</p></div>"
                 +"<div class = 'image'>"
                 +"<img class='d-block w-100' src = '" +item.attachments.data[0].media.image.src+ "'>"
                 +"</div></div>";
              }
            }
          }
          else{
          document.getElementById('feedcontent').innerHTML += "<div class = 'post'><div class  = 'story'><h2 style = 'font-size: 0.95em;'>" +
          (item.message.split("#", 1))[0] +
          "</h2><h5 style = 'font-size: 0.75em; color: var(--color-highlighted);'>" + message
           + "</h5></div><div class = 'postimage' id = 'image'></div><div class = 'time'><p style = 'color: var(--color-light);font-size:0.75em;text-align:left;'>" + date
           + " at " + time + "</p></div></div>";
         }
        });
      } else {
          alert("Error!");
      }

       console.log(response);
     });
   }

  function getMessages(pageid,token){
    var fields = 'message_count,unread_count,updated_time,messages{message,from,created_time,sticker,attachments{file_url},id}';

    console.log(token);

    FB.api('/' + pageid + '/conversations?access_token='+ token +'&fields=' + fields + '' , response => {
      if(response.data) {

      }else{
        alert("error");
      }

      console.log(response);
    });
  }

   function getPages(){
    FB.api('me/accounts?access_token='+accessToken+'&fields=id,name', response => {
      $('.fb').addClass("content-hidden");
      if(response.data) {
        $.each(response.data,function(index,page) {
          document.getElementById('fbpages').innerHTML ="<button class = 'page' onClick = 'getFeed(" + page.id + ", event);' id = 'pagebtn'><h3 style = 'color: white;'>"
          + page.name + "</h3></button>";
        });
      } else {
          alert("Error!");
      }


       console.log(response);
     });
  }

   //get started pages
   $('#start').click(function(e){
    window.location.href = this.href;
   });

   //function to get the feed linked to the facebook account

    $('.page').click(function(e){
     getFeed(this.value);
     getMessages(this.value, this.name);
    });

    $('#fboption').click(function(e){
     getPages();
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   //========================================================================================================

  if (location.href == "https://localhost:3000/" || location.href == "https://localhost:3000/register"){
    clearCookies();
  }
  // code for the facebook comment section
  $('.clickable').click(function(e){
    e.preventDefault();

    $(".post").removeClass("active");

    var id = this.href.split('/',5)[4];
    var x = "." + id;
    $(".comment-list").addClass("hidden");
    $(x).removeClass("hidden");

    $(this).find(".post").addClass("active");
  });
  // code for the menu at the bottom of the page

  window.onmousemove = function(e){
    if(e.y > $(document).height()-300)
        $('.menu').removeClass("bottom");
    else {
        $('.menu').addClass("bottom");
    }
  }

});

//Code for the clock on the start page

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML =
  h + " : " + m + " : " + s;
  var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

//code to clear the cookies on logout
function clearCookies(){
  Cookies.remove("visits");
}
