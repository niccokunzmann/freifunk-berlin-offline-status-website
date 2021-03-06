/* open and close the header */
function headerIsOpen() {
  return document.body.classList.contains("open");
}

function toggleHeader() {
  document.body.classList.toggle("open");
  menuButton.innerText = headerIsOpen() ? "-" : "+";
}

function openHeader() {
  if (!headerIsOpen()) {
    toggleHeader();
  }
}

function toggleSidebar(id) {
  var sidebars = document.getElementsByClassName("sidebar");
  for (var i = 0; i < sidebars.length; i++) {
    var sidebar = sidebars[i];
    if (sidebar.id == id) {
      sidebar.classList.toggle("hidden");
    } else {
      sidebar.classList.add("hidden");
    }
  }
}

function sidebarIsVisible(id) {
  var sidebar = document.getElementById(id);
  return !sidebar.classList.contains("hidden");
}

function notifyConnectionLost() {
  document.body.classList.add("noConnection");
}

function notifyConnectionEstablished() {
  document.body.classList.remove("noConnection");
}

window.addEventListener("load", function() {
  toggleSidebar('routers');toggleSidebar('routers');
});




