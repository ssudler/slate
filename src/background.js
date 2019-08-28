var localEvents = [];
var localSites = [];

chrome.storage.sync.get(null, function(objects) {
  if ('sites' in objects) {
    localSites = objects['sites'];
    //console.log(localSites);
  }
  if ('events' in objects) {
    localEvents = objects['events'];
    //console.log(localEvents);
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  //console.log(Object.keys(changes));

  if (Object.keys(changes) == 'events') {
    //console.log("events changed");
    localEvents = changes["events"].newValue;
  } else if (Object.keys(changes) == 'sites') {
    //console.log("sites changed");
    localSites = changes["sites"].newValue;
  } else {
    console.log("Unidentified change");
  }
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  for (var i = 0; i < localEvents.length; i++) {
    if (localEvents[i][0] != "break") {
      let start = moment(`${localEvents[i][1]}`, "h:mm A");
      let end = moment(`${localEvents[i][2]}`, "h:mm A");
      if (moment().isBetween(moment(start, "HH:mm:ss"), moment(end, "HH:mm:ss"))) {
        for (var j = 0; j < localSites.length; j++) {
          if (details.url.includes(localSites[j])) {
            return {redirectUrl: "chrome-extension://"+chrome.runtime.id+"/restricted.html"}
          }
        }
      }
    }
  }
  },
  {
      urls: ["<all_urls>"]
  }, ["blocking"]
);

/*
chrome.tabs.onActiveChanged.addListener(function(tabId, changeInfo, tab){
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    checkTab(tabs[0].url, tabId);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (changeInfo.status == "complete") {
    checkTab(tab.url);
  }
});
*/
