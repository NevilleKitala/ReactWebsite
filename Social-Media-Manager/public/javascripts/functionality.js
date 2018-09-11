$(document).ready(function() {
  if (location.href == "https://localhost:3000/" || location.href == "https://localhost:3000/register"){
    clearCookies();
  }

  $('.clickable').click(function(e){
    e.preventDefault();

    $(".post").removeClass("active");

    var id = this.href.split('/',5)[4];
    var x = "." + id;
    $(".comment-list").addClass("hidden");
    $(x).removeClass("hidden");

    $(this).find(".post").addClass("active");
  });

  $('.reply-btn').click(function(e){
    e.preventDefault();

    var id = this.href.split('/',5)[4];
    var x = ".reply-" + id;
    $(".reply").addClass("hidden");
    $(x).removeClass("hidden");
  });

});

function clearCookies(){
  Cookies.remove("visits");
}
