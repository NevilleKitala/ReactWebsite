$(document).ready(function() {
  $('html, body, *').mousewheel(function(e, delta) {
    this.scrollLeft -= (delta * 20);
    e.preventDefault();
  });
  if (location.href == "https://localhost:3000/" || location.href == "https://localhost:3000/register"){
    clearCookies();
  }
});

function clearCookies(){
  Cookies.remove('visits');
}
