// Taken from PS2:
//    This script extracts parameters from the URL
//    from jquery-howto.blogspot.com

var saveOtherEditedThings;
var thingBeingEdited;

$.extend({
  getUrlVars : function() {
    var vars = [], hash;
    var hashes = window.location.href.slice(
        window.location.href.indexOf('?') + 1).split('&');
    for ( var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar : function(name) {
    return $.getUrlVars()[name];
  }
});

$(document).ready(function() {

  // if this is for a different trip, use those firebase refs instead
  if ($.getUrlVar('trip')) {
    var tripRefName = $.getUrlVar('trip');
    tripRef = tripsRef.child(tripRefName);

    peopleRef = tripRef.child('people');
    organizersRef = peopleRef.startAt('organizer').endAt('organizer');
    tripInfoRef = tripRef.child('tripInfo');
    resortInfoRef = tripRef.child('resortInfo');
  }


  // Helper functions to show or hide edit buttons  
  var showEditButtons = function(container) {
    container.find('button.editing').show();
    container.find('button.not-editing').hide();
  }

  var hideEditButtons = function(container) {
    container.find('button.editing').hide();
    container.find('button.not-editing').show();
  }

  ///////////////////////////////////////
  // Table
  ///////////////////////////////////////

  // map from FireBase ref to html row
  var refToRow = {};

  // info about each column in the table
  var columns = {
    is_org: { 
      col: 0,
      edit_fn: cellToCheckbox,
      save_fn: saveCheckboxChanges,
      default_val: 'No'
    },
    name: {
      col: 1,
      edit_fn: cellToTextInput,
      save_fn: saveCellChanges,
      default_val: ''
    },
    equip: {
      col: 2,
      edit_fn: cellToMultiCheckboxes,
      save_fn: saveMultiCheckboxChanges,
      default_val: 'Skis, Helmet, Boots, Poles'
    },
    skill: {
      col: 3,
      edit_fn: cellToDropdown,
      save_fn: saveCellChanges,
      default_val: 'Beginner'
    },
    phone: {
      col: 4,
      edit_fn: cellToTextInput,
      save_fn: saveCellChanges,
      default_val: ''
    },
    actions: {
      col: 5
    }
  }

  // hide buttons only used while editing
  $('#user-table tbody button.editing').hide();

  /////////////// individual table cell functions ////////////////////

  // edit functions:
  //  take a cell with a text value, change the contents of the cell
  //  to the appropriate input form, and return the old text

  // Turn a cell into a text input. Returns old field value.
  function cellToTextInput(cell) {
    var text = cell.text();
    cell.empty();

    var input = $('<input type="text" class="form-control">').val(text);
    cell.append(input);

    return text;
  }

  // Turn a cell into a selection dropdown. Returns old field value.
  function cellToDropdown(cell) {
    var text = cell.text();
    cell.empty();

    var dropdown = $(
      '<select class="form-control">' +
        '<option value="Beginner">Beginner</option>' +
        '<option value="Intermediate">Intermediate</option>' +
        '<option value="Advanced">Advanced</option>' +
      '</select>'
    ).val(text);
    cell.append(dropdown);

    return text;
  }

  // Turn a cell into a single checkbox. Returns old field value.
  function cellToCheckbox(cell) {
    var text = cell.text();

    var checkbox = $('<div class="checkbox"><label><input type="checkbox"></input> ' +
      'Organizer? </label></div>');
    cell.empty();

    if (text == 'Yes') {
      checkbox.prop('checked',true);
    }

    cell.append(checkbox);

    return text;
  }

  function cellToMultiCheckboxes(cell) {
    var text = cell.text();
    var items = text.split(', ');
    var default_items = columns.equip.default_val.split(', ');
    cell.empty();

    for (var i in default_items) {
      var checkbox = $(
        '<div class="checkbox"><label><input type="checkbox"></input>' +
        default_items[i] + '</label></div>'
      );

      if (items.indexOf(default_items[i]) != -1) {
        checkbox.find('input').prop('checked', true);
      }
      cell.append(checkbox);
    }

    for (var i in items) {
      if (items[i] != ''){
        var checkbox = $(
          '<div class="checkbox"><label><input type="checkbox"></input>' + 
          items[i] + '</label></div>'
        );
        checkbox.find('input').prop('checked', true);
        if (default_items.indexOf(items[i]) == -1) {
          cell.append(checkbox);
        }
      }
    }

    var other_checkbox = $('<div class="checkbox"><label>' +
      '<input type="checkbox"></input> Other (please specify): ' +
      '</label></div>'
    );
    var other_input = $('<input type="text" class="form-control other-input"></input>');
    cell.append(other_checkbox, other_input);

    return text;
  }

  // save functions:
  //  take a cell with an input field and return the appropriate text
  //  representation of the data.

  // save changes to a cell containing a text field or a dropdown
  function saveCellChanges(cell) {
    var text = cell.find('input').val() || cell.find('select').val();
    cell.empty();
    cell.text(text)
    return text;
  };

  // save changes to a cell containing a checkbox
  function saveCheckboxChanges(cell) {
    var checked = cell.find('input').prop('checked');
    cell.empty();

    if (checked){
      cell.text('Yes');
      return 'Yes';
    } else {
      cell.text('No');
      return 'No';
    }
  }

  function saveMultiCheckboxChanges(cell) {
    var labels = cell.find('label');
    var items = [];

    for (var i in labels) {
      var label = labels.eq(i)
      var checkbox = label.find('input');
      if (checkbox.prop('checked')){
        var item = label.text();
        if (item.indexOf('Other') == -1) {
          items.push(item);
        } else {
          var other_items = cell.find('.other-input').val()
          if (other_items) {
            items = items.concat(other_items.split(', '));
          }
        }
      }
    }

    cell.empty();
    cell.text(items.join(', '));
    return items.join(', ');
  }

  // cancel changes to a cell by reinstating the old value
  var cancelCellChanges = function(cell, old_val) {
    cell.empty();
    cell.text(old_val);
  };

  //////////////////////// whole table row functions //////////////////////////

  // turn a whole row into the appropriate form. Set old field values as data on the row
  var makeRowEditable = function(row) {
    var cells = row.find('td');

    var old_vals = {};

    for (var property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        old_vals[property] = info.edit_fn(cells.eq(info.col));
      }
    }

    showEditButtons(cells.eq(columns.actions.col));

    row.data('old_data',old_vals);
    
    // This helps save edited stuff when other things are changed
    thingBeingEdited = row;
  };

  // set field values to the current values of their respective inputs
  var saveRowChanges = function(row) {
    var rowRef = peopleRef.child(row.data('rowRefName'));
    row.removeClass('new-row');
    var cells = row.find('td');

    var new_data = {};
    for (var property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        // empty string is so that firebase can update the property if it is left blank
        var new_val = info.save_fn(cells.eq(info.col)) || '';
        new_data[property] = new_val;
      }
    }

    // use priorities to sort organizers and non-organizers
    //  priority is in lexographic order, but no priority comes before
    //  any other priority, so to let organizers be on top of the table,
    //  non-organizers need a priority that comes after 'o'
    if (cells.eq(columns.is_org.col).text() == 'Yes') {
      rowRef.setWithPriority(new_data, 'organizer');
    } else {
      rowRef.setWithPriority(new_data, 'z-comes-after-o');
    }
    hideEditButtons(cells.eq(columns.actions.col));
    
    thingBeingEdited = undefined;
  };

  // restore old values of fields if the row had been previously saved, otherwise
  //   remove the row entirely
  var cancelRowChanges = function(row) {
    if (row.hasClass('new-row')) {
      row.remove();
      return;
    }
    var cells = row.find('td');
    var old_data = row.data('old_data');

    for (var property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        cancelCellChanges(cells.eq(info.col), old_data[property]);
      }
    }

    hideEditButtons(cells.eq(columns.actions.col));
  };

  thingBeingEdited = undefined;
  
  saveOtherEditedThings = function() {
    if (!(thingBeingEdited == undefined)) {
      if (thingBeingEdited == "trip") {
        saveTripInfo();
      }
      else {
        saveRowChanges(thingBeingEdited);
      }
      
      thingBeingEdited = undefined;
    }
  }
  
  // add a new row to the table, including listeners on the buttons
  var displayNewRow = function(rowRefName, is_new) {
    // create template for a new row
    var new_row = $('<tr></tr>');
    for (var property in columns) {
      if (property != 'actions') {
        var default_val = columns[property].default_val
        new_row.append($('<td></td>').text(default_val));
      }
    }

    if (is_new) {
      new_row.addClass('new-row');
    }

    // this is sloppy code and it makes me sad :( I could probably abstract it, but 
    //   I don't think there's any reason to except my own sense of aesthetics
    
    // Why is this sloppy code? It looks fine to me.
    var edit_button = $(
      '<button class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-pencil"></span> Edit </button>'
    ).click(function() {
      // This saves other things that might be being edited at this time
      saveOtherEditedThings();
      makeRowEditable(new_row);
    });
    
    var delete_button = $(
      '<button class="not-editing btn btn-danger btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Delete </button>'
    ).click(function() {
      peopleRef.child(rowRefName).set({});
    });

    var save_button = $(
      '<button class="editing btn btn-success btn-xs">' +
      '<span class="glyphicon glyphicon-ok"></span> Save </button> '
    ).click(function() {
      saveRowChanges(new_row);
    }).hide();

    var cancel_button = $(
      '<button class="editing btn btn-warning btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Cancel </button>'
    ).click(function() {
      cancelRowChanges(new_row);
    }).hide();

    var action_cell = $('<td></td>').append(
      edit_button, ' ', delete_button, ' ', save_button, ' ', cancel_button
    );

    new_row.append(action_cell);

    // associate html with firebase ref
    new_row.data('rowRefName',rowRefName);
    refToRow[rowRefName] = new_row;

    $('#user-table tbody').append(new_row);

    // make the row editable on creation if it is new
    if (is_new){
      edit_button.click();
    }
    
    thingBeingEdited = new_row;
  };

  // update the data in a row, as identified by a firebase ref
  var updateDisplayedRow = function(data, rowRefName) {
    var row = refToRow[rowRefName];
    var cells = row.find('td');

    for (var property in data) {
      var info = columns[property];
      cells.eq(info.col).text(data[property]);
    }
  };

  // add a new node to the list of people and add a new row
  $('#add-person').click(function() {
    // get a new unique id for the row
    var newRowRef = peopleRef.push();
    var rowRefName = newRowRef.name();
 
    // This saves other things that might be being edited at this time
    saveOtherEditedThings();
    
    // display the new row, and mark it as truly new
    displayNewRow(rowRefName, true);
  });

  // firebase listeners
  peopleRef.on('child_added', function(snapshot) {
    // only display a new row if we do not have a reference to the row already
    if ( ! refToRow[snapshot.name()] ) {
      displayNewRow(snapshot.name());
    }
    // always update the display in case this is the first time this row is modified
    updateDisplayedRow(snapshot.val(), snapshot.name());
  });

  peopleRef.on('child_changed', function(snapshot) {
    updateDisplayedRow(snapshot.val(), snapshot.name());
  });

  peopleRef.on('child_removed', function(snapshot) {
    refToRow[snapshot.name()].remove();
    delete refToRow[snapshot.name()];
  });

  peopleRef.on('value', function(snapshot) {
    var skill_dict = {}
    snapshot.forEach(function(personSnapshot) {
      var skill = personSnapshot.child('skill').val();
      if (skill in skill_dict) {
        skill_dict[skill] += 1
      }
      else {
        skill_dict[skill] = 1
      }
    });
    document.getElementById('summary').innerHTML = "";
    for (level in skill_dict) {
      string = level + ": " + skill_dict[level]+ "<br>";
      document.getElementById('summary').innerHTML += string;
    }
  });

  // update the trip info 'organizer number' field with all organizers' phone numbers
  //  anything else that should be done for organizers should be done here also
  organizersRef.on('value', function(snapshot) {
    var phones = [];
    for (var row in snapshot.val()) {
      phones.push(snapshot.val()[row].phone);
    }

    if (phones.length > 0) {
      $('#organizer-number-val').text(phones.join(', '));
    } else {
      $('#organizer-number-val').text('No organizers');
    }
  });

  // Boolean values used by the date-time picker for setting the value 
  // to the default the first time
  var defaultShouldBeSetStart = true;
  var defaultShouldBeSetStop = true;
  
  // Today's date; the current value
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  
  var currentDateString = mm + "/" + dd + "/" + yyyy;
  var msInDay = 86400000;
  
  ///////////////////////////////////////
  // Trip info
  ///////////////////////////////////////

  // info about the fields in tripinfo
  var fields = {
    leaving_at: {
      index: 0,
      editable: true,
      edit_fn: ddToDatetime,
      save_fn: saveDatetimeChanges
    },
    getting_back: {
      index: 1,
      editable: true,
      edit_fn: ddToDatetime,
      save_fn: saveDatetimeChanges
    },
    leaving_from: {
      index: 2,
      editable: true,
      edit_fn: ddToTextInput,
      save_fn: saveTextChanges
    },
    organizer_number: {
      index: 3
    },
    predicted_weather: {
      index: 4
    }
  };

  // hide buttons used for editing trip info
  $('#trip-buttons button.editing').hide();

  // Turn a dd into a text input
  function ddToTextInput(dd) {
    var text = dd.text();
    var input = $('<input type="text" class="form-control">').val(text);

    dd.empty();
    dd.append(input);

    dd.data('old_data', text);
    //return text;
  }

  function ddToDatetime(dd) {
    var text = dd.text();

    var datetime = $(
      '<div class="input-group date">' +
        '<input type="text" class="form-control" />' +
        '<span class="input-group-addon">' +
          '<span class="glyphicon glyphicon-calendar"></span>' +
        '</span>' +
      '</div>'
    ).datetimepicker();

    dd.empty();
    dd.append(datetime);
    dd.data('old_data', text);
  }

  // Set the text of a dd to the current value of its input. Return new value
  function saveTextChanges(container) {
    var text = container.find('input').val();
    container.empty();
    container.append(text);

    return text;
  }
  
  // trip info edit buttons
  $('#edit-leaving-at').click(function() {
    var span = $('#leaving-at-val');
    showEditButtons(span.parent());
    
//    document.getElementById("leaving-at-val").style.visibility = 'hidden';

//  I don't rightly know whether we want to keep the old label hidden--it's 
// nice to see what you'll revert back to if you cancel? 
 
    document.getElementById('start').style.visibility = 'visible'; 
/*    if (defaultShouldBeSetStart) {
      $("#start").data("DateTimePicker").setDate(currentDateString);
      defaultShouldBeSetStart = false;
    }*/
  });
  $('#edit-getting-back').click(function() {
    var span = $('#getting-back-val');
    showEditButtons(span.parent());
    
    document.getElementById('stop').style.visibility = 'visible'; 
/*    if (defaultShouldBeSetStop) {
      $("#stop").data("DateTimePicker").setDate(currentDateString);
      defaultShouldBeSetStop = false;
    }*/
  });
  $('#edit-leaving-from').click(function() {
    editListener('#leaving-from-val');
  });
  $('#edit-organizer-number').click(function() {
    editListener('#organizer-number-val');
  });
  
  function saveDatetimeChanges(container) {
    var date = container.find('.date').data("DateTimePicker").getDate();
    var dateString = date._d.toLocaleString();
    container.empty();
    container.text(dateString);
    
    updateWeatherFromDate(date);
    
    return dateString;
  }
  
  // Cancel the changes to a field by reinstating the old value
  var cancelInfoChanges = function(container) {
    var old_val = container.data('old_data');
    container.empty();
    container.text(old_val);
  };

  var editTripInfo = function() {
    // This saves other things that might be being edited at this time
    saveOtherEditedThings();
    thingBeingEdited = "trip";
    
    var dds = $('#trip-info').find('dd');
    for (var property in fields) {
      var info = fields[property];
      if (info.editable) {
        info.edit_fn(dds.eq(info.index));
      }
    }

    showEditButtons($('#trip-buttons'));
  }

  var saveTripInfo = function() {
    thingBeingEdited = undefined;
  
    var dds = $('#trip-info').find('dd');
    var update_data = {};
    for (var property in fields) {
      var info = fields[property];
      if (info.editable) {
        update_data[property] = info.save_fn(dds.eq(info.index));
      }
    }

    tripInfoRef.update(update_data);
    hideEditButtons($('#trip-buttons'));
  }

  var cancelTripInfo = function() {
    thingBeingEdited = undefined;
  
    var dds = $('#trip-info').find('dd');
    for (var property in fields) {
      var info = fields[property];
      if (info.editable) {
        cancelInfoChanges(dds.eq(info.index));
      }
    }

    hideEditButtons($('#trip-buttons'));
  }

  $('#edit-trip-info').click(editTripInfo);
  $('#save-trip-info').click(function() {
    saveTripInfo();
    showLocation();
  });
  $('#cancel-trip-info').click(cancelTripInfo);

  tripInfoRef.on('value', function (snapshot) {
    var dds = $('#trip-info').find('dd');
    for (var property in snapshot.val()) {
      dds.eq(fields[property].index).text(snapshot.val()[property]);
    }
    showLocation();
  });
  
});

/*$(document).load(function() {

  alert("loaded");
  // This cuts off the part of the date that we care about (i.e. "May 21, 2014")
  var writtenDate = document.getElementById("getting-back-val").innerHTML;
  var start = writtenDate.indexOf(",") + 2;
  var end = writtenDate.indexOf(" ", start) + 1;
  var end = writtenDate.indexOf(" ", end) + 1;
  var end = writtenDate.indexOf(" ", end);
  var writtenDate = writtenDate.substring(start, end);
  
  alert(writtenDate);
  
  var numberOfMs = Date.parse(writtenDate);
  var date = new Date();
  date.setTime(numberOfMs);
  
  updateWeatherFromDate(date);
});*/