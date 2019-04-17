/* Positioning Routers
 */
 
function makeElementDraggableRouter(element, router, addOnClick) {
  // making elements draggable, see https://www.w3schools.com/HTML/html5_draganddrop.asp
  element.draggable = true;
  element.ondragstart = function(event) {
    event.dataTransfer.setData("ip", router.ip);
  }
  if (addOnClick) {
    element.onclick = function() {
      if (routerIsVisible(router)) {
        removeVisibleRouterWith(router.ip);
      } else {
        addVisibleRouterWith(router.ip);
      }
    }
  }
}

function addVisibleRouterWith(ip, x, y) {
  withConfig(function(config){
    var routerBefore = config.invisibleRouters[ip];
    var router = config.visibleRouters[ip] = {
      ip: ip,
      x: x || (routerBefore ? routerBefore.x : Math.random()),
      y: y || (routerBefore ? routerBefore.y : Math.random()),
      shortName: ip.split(/\./g)[3],
    };
    delete config.invisibleRouters[ip];
    setRouterVisibilityStatus(router);
  });
}

function removeVisibleRouterWith(ip) {
  withConfig(function(config){
    var router = config.visibleRouters[ip];
    delete config.visibleRouters[ip];
    config.invisibleRouters[ip] = router;
    setRouterVisibilityStatus(router);
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function dropOnSidebar(event) {
  var ip = event.dataTransfer.getData("ip");
  if (!ip) {
    return;
  }
  removeVisibleRouterWith(ip);
}

function dropOnBackground(event) {
  var ip = event.dataTransfer.getData("ip");
  if (!ip) {
    return;
  }
  var bbox = map.getBoundingClientRect();
  var x = (event.x - bbox.left) / bbox.width;
  // we can not get the height directly because it is a background image
  var imagebbox = size.getBoundingClientRect();
  var height = bbox.width / imagebbox.width * imagebbox.height;
  var y = (event.y - bbox.top) / height;
  event.preventDefault();
  addVisibleRouterWith(ip, x, y);
}

function updateRouterPosition(routerElement) {
  [routerElement, routerElement.text].forEach(function(element) {
    element.style.left = Math.floor(routerElement.router.x * 100) + "%";
    element.style.top = Math.floor(routerElement.router.y * 100) + "%";
  });
}

function getMapRouterPositionByIp(ip) {
  var routerElement = document.getElementById("routerOnMap-" + ip);
  var routerBB = routerElement.getBoundingClientRect();
  var mapBB = map.getBoundingClientRect();
  return {
    x: routerBB.x - mapBB.x + routerBB.width / 2,
    y: routerBB.y - mapBB.y + routerBB.height / 2,
    width: routerBB.width,
    height: routerBB.height,
  };
}

window.addEventListener("config", function(event){
  var routersOnMap = map.getElementsByClassName("router");
  var config = readConfig();
  var updated = new Set();
  for (var i = 0; i < routersOnMap.length; i++) {
    var routerElement = routersOnMap[i];
    var ip = routerElement.router.ip;
    updated.add(ip);
    var router = config.visibleRouters[ip];
    if (routerIsVisible(routerElement.router)) {
      if (routerElement.router.x != router.x || routerElement.router.y != router.y) {
        // reposition router
        routerElement.router = router;
        updateRouterPosition(routerElement);
      }
    } else {
      // remove router
      map.removeChild(routerElement);
    }
  }
  forEachProperty(config.visibleRouters, function(ip, router){
    if (!updated.has(ip)) {
      // create router circle
      var routerCircle = document.createElement("div");
      routerCircle.classList.add("router");
      routerCircle.id = "routerOnMap-" + ip;
      routerCircle.router = router;
      map.appendChild(routerCircle);
      // create router text
      var routerText = document.createElement("span");
      routerText.innerText = router.shortName;
      routerText.classList.add("routerText");
      routerCircle.text = routerText;
      map.appendChild(routerText);
      
      // place elements
      makeElementDraggableRouter(routerCircle, router, false);
      updateRouterPosition(routerCircle);
    }
  });
});

