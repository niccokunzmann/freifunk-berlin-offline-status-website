/* Persistent configuration
 */
var activeConfig = null;

/* initialize and migrate an existing configuration */
function initConfig(config) {
  config = typeof config == "object" ? config : {};
  config.visibleRouters = config.visibleRouters || {};
  return config;
}

function withConfig(func) {
  var data = document.location.hash.substr(1);
  if (activeConfig == null) {
    // loading config
    try {
      activeConfig = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      console.error("invalid data " + data);
      activeConfig = {};
    }
    activeConfig = initConfig(activeConfig);
    try {
      func(activeConfig);
      var newData = encodeURIComponent(JSON.stringify(activeConfig));
      if (data != newData) {
        // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
        var event = new CustomEvent("config", {detail: activeConfig});
        window.dispatchEvent(event);
        console.log(activeConfig);
        document.location.hash = "#" + newData;
      }
    } finally {
      activeConfig = null;
    }
  } else {
    func(activeConfig);
  }
}

