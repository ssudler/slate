document.addEventListener("DOMContentLoaded", function() {
  $("#blocked-sites-wrapper, #add-site-form, #add-task-form, #add-break-form").hide();

  // chrome.storage.sync.clear();

  chrome.storage.sync.get(null, function(objects) {
    if ('events' in objects) {
      for (var i = 0; i < objects['events'].length; i++) {
        if (objects['events'][i][0] == "break") {
          $("#events-wrapper").append('<div class="break"><div>Break</div><div style="display: flex; align-self: stretch; justify-content: space-between"><div>' + objects['events'][i][1] + ' to ' + objects['events'][i][2] + '</div><i id='+ objects['events'][i][3] +' class="fas fa-trash event"></i></div></div>');
        } else {
          $("#events-wrapper").append('<div class="item"><div>'+ objects['events'][i][0] +'</div><div style="display: flex; align-self: stretch; justify-content: space-between"><div>' + objects['events'][i][1] + ' to ' + objects['events'][i][2] + '</div><i id='+ objects['events'][i][3] +' class="fas fa-trash event"></i></div></div>');
        }
      }
    } else {
      chrome.storage.sync.set({'events': []});
    }
  });

  chrome.storage.sync.get(null, function(objects) {
    if ('sites' in objects) {
      for (var i = 0; i < objects['sites'].length; i++) {
        $("#sites-wrapper").append('<div class="site"><span>'+ objects['sites'][i] +'</span><i class="fas fa-trash" id='+ objects['sites'][i] +'></i></div>');
      }
    } else {
      chrome.storage.sync.set({'sites': []});
    }
  });

  function removeObj(obj, type) {
    if (type) {
      chrome.storage.sync.get(['sites'], function(objects) {
        let temp = objects.sites;
        for (var i = 0; i < temp.length; i++) {
          if (temp[i] == obj.attr('id')) {
            temp.splice(i, 1);
            obj.parent().remove();
            chrome.storage.sync.set({'sites': temp});
          }
        }
      });
    } else {
      chrome.storage.sync.get(['events'], function(objects) {
        let temp = objects.events;
        for (var i = 0; i < temp.length; i++) {
          if (temp[i][3] == obj.attr('id')) {
            temp.splice(i, 1);
            obj.parent().parent().remove();
            chrome.storage.sync.set({'events': temp});
          }
        }
      });
    }
  }

  $(".time").timepicker({
    'timeFormat': 'h:i A',
    'showDuration': true,
    'step': 15,
    'scrollDefault': 'now'
  });

  $("#add-task-form-button").click(function() {
    let title = $("#title").val();
    let start = $("#add-task-form-times-start").val();
    let end = $("#add-task-form-times-end").val();
    let dateId = Date.now();

    $("#events-wrapper").append('<div class="item"><div>'+ title +'</div><div style="display: flex; align-self: stretch; justify-content: space-between"><div>' + start + ' to ' + end + '</div><i id='+ dateId +' class="fas fa-trash event"></i></div></div>');
    chrome.storage.sync.get(['events'], function(objects) {
      let temp = objects.events;
      temp.push([title, start, end, dateId]);
      chrome.storage.sync.set({'events': temp});
    });

    $("#add-task-form").find('input:text').val("");
    $("#add-task-form").slideUp();
  });

  $("#add-break-form-button").click(function() {
    let start = $("#add-break-form-times-start").val();
    let end = $("#add-break-form-times-end").val();
    let dateId = Date.now();

    $("#events-wrapper").append('<div class="break"><div>Break</div><div style="display: flex; align-self: stretch; justify-content: space-between"><div>' + start + ' to ' + end + '</div><i id='+ dateId +' class="fas fa-trash event"></i></div></div>');
    chrome.storage.sync.get(['events'], function(objects) {
      let temp = objects.events;
      temp.push(["break", start, end, dateId]);
      chrome.storage.sync.set({'events': temp});
    });

    $("#add-break-form").find('input:text').val("");
    $("#add-break-form").slideUp();
  })

  $("#add-task-form-times").datepair();
  $("#add-break-form-times").datepair();

  $("#sites-wrapper").on('click', 'i', function() {
    removeObj($(this), true);
  });

  $("#events-wrapper").on('click', 'i', function() {
    removeObj($(this), false);
  })

  $("#add-site-form-button").click(function() {
    let site = $("#add-site-form-input").val().replace(/\/+$/, "");
    if (site == "") {
      alert("Enter a valid website");
    } else if (site.includes(" ")) {
      alert("No spaces");
    } else {
      $("#sites-wrapper").append('<div class="site"><span>'+ site +'</span><i class="fas fa-trash" id='+ site +'></i></div>');
      $("#add-site-form-input").val("");
      $("#add-site-form").slideUp();

      chrome.storage.sync.get(['sites'], function(objects) {
        let temp = objects.sites;
        temp.push(site);
        chrome.storage.sync.set({'sites': temp});
      });
    }
  });

  // Navigation
  $('#calendar-icon').click(function() {
    $(this).css("color", "#2e3131");
    $("#sites-icon").css("color", "#abb7b7");
    $("#events").show();
    $("#blocked-sites-wrapper").hide();
  });

  $('#sites-icon').click(function() {
    $(this).css("color", "#2e3131");
    $("#calendar-icon").css("color", "#abb7b7");
    $("#events").hide();
    $("#blocked-sites-wrapper").show();
  });

  // Events
  $('#add-task-button').click(function() {
    $("#add-task-form").slideDown();
  });
  $('#add-task-form-close-icon').click(function(){
    $("#add-task-form").slideUp();
    $("#add-task-form").find('input:text').val("");
  });

  $('#add-break-button').click(function(){
    $("#add-break-form").slideDown();
  });
  $('#add-break-form-close-icon').click(function(){
    $("#add-break-form").slideUp();
    $("#add-break-form").find('input:text').val("");
  });

  $('#clear-events-button').click(function() {
    chrome.storage.sync.set({'events': []});
    $("#events-wrapper").empty();
  });

  // Sites
  $('#clear-sites-button').click(function() {
    chrome.storage.sync.set({'sites': []});
    $("#sites-wrapper").empty();
  });

  $('#add-site-plus-icon').click(function() {
    $("#add-site-form").slideDown();
  });
  $('#add-site-form-close-button').click(function() {
    $("#add-site-form").slideUp();
    $("#add-site-form").find('input:text').val("");
  });

  $('#clear-sites-button').click(function() {
    chrome.storage.sync.set({'sites': []});
    $("#sites-wrapper").empty();
  });
});
