function checkTab(url, tabId) {
  chrome.storage.sync.get(null, function(objects) {
    if ('events' in objects) {
      for (var i = 0; i < objects['events'].length; i++) {
        if (objects['events'][i][0] != "break") {
          let start = moment(`${objects['events'][i][1]}`, "h:mm A");
          let end = moment(`${objects['events'][i][2]}`, "h:mm A");
          if (moment().isBetween(moment(start, "HH:mm:ss"), moment(end, "HH:mm:ss"))) {
            if ('sites' in objects) {
              for (var i = 0; i < objects['sites'].length; i++) {
                if (url.includes(objects['sites'][i])) {
                  alert("Stop! You are being unproductive.")
                }
              }
            }
          }
        }
      }
    }
  });
}

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
