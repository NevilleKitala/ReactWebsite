$(document).ready(function() {
  if (location.href == "https://localhost:3000/" || location.href == "https://localhost:3000/register"){
    clearCookies();
  }
});

function clearCookies(){
  Cookies.remove('visits');
}
