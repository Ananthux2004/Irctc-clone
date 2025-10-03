document.addEventListener("DOMContentLoaded", function (){
  // Get navigation elements
  const homeLink = document.getElementById("homeLink");
  const loginLink = document.getElementById("loginLink");

  
  // Handle navigation clicks
  if (homeLink) {
    homeLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }


  
});