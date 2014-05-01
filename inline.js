$(document).ready(function() {
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
      edit_fn: cellToTextInput,
      save_fn: saveCellChanges,
      default_val: 'Helmet, Boots, Skis, Poles'
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

    var input = $('<input type="text">').val(text);
    cell.append(input);

    return text;
  }

  // Turn a cell into a selection dropdown. Returns old field value.
  function cellToDropdown(cell) {
    var text = cell.text();
    cell.empty();

    var dropdown = $(
      '<select>' +
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
    var text = cell.text()

    var checkbox = $('<input type="checkbox"></input>');
    cell.empty();

    if (text == 'Yes') {
      checkbox.prop('checked',true);
    }

    cell.append(checkbox);

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

    for (property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        old_vals[property] = info.edit_fn(cells.eq(info.col));
      }
    }

    showEditButtons(cells.eq(columns.actions.col));

    row.data('old_data',old_vals);
  };

  // set field values to the current values of their respective inputs
  var saveRowChanges = function(row) {
    var rowRef = peopleRef.child(row.data('rowRefName'));
    row.removeClass('new-row');
    var cells = row.find('td');

    var new_data = {};
    for (property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        // empty string is so that firebase can update the property if it is left blank
        var new_val = info.save_fn(cells.eq(info.col)) || '';
        new_data[property] = new_val;
      }
    }
    rowRef.update(new_data);
    hideEditButtons(cells.eq(columns.actions.col));
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

    for (property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        cancelCellChanges(cells.eq(info.col), old_data[property]);
      }
    }

    hideEditButtons(cells.eq(columns.actions.col));
  };

  // add a new row to the table, including listeners on the buttons
  var displayNewRow = function(rowRefName, is_new) {
    // create template for a new row
    var new_row = $('<tr></tr>');
    for (property in columns) {
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
    var edit_button = $(
      '<button class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-pencil"></span> Edit </button>'
    ).click(function() {
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
  };

  // update the data in a row, as identified by a firebase ref
  var updateDisplayedRow = function(data, rowRefName) {
    var row = refToRow[rowRefName];
    var cells = row.find('td');

    for (property in data) {
      var info = columns[property];
      cells.eq(info.col).text(data[property]);
    }
  };

  // add a new node to the list of people and add a new row
  $('#add-person').click(function() {
    // get a new unique id for the row
    var newRowRef = peopleRef.push();
    var rowRefName = newRowRef.name();

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

  ///////////////////////////////////////
  // Trip info
  ///////////////////////////////////////

  // hide buttons used for editing trip info
  $('#trip-info button.editing').hide();

  // Turn a span into a text input. Returns the old text
  var spanToTextInput = function(span) {
    var text = span.text();
    var input = $('<input type="text">').val(text);

    span.empty();
    span.append(input);

    return text;
  };

  // Set the text of a span to the current value of its input
  var saveSpanChanges = function(span) {
    var text = span.find('input').val();
    span.empty();
    span.append(text);
  };

  // Cancel the changes to a span by reinstating the old value
  var cancelSpanChanges = function(span) {
    var old_val = span.data('old_data');
    span.empty();
    span.text(old_val);
  };

  // button listener for editing the span identified by the given jquery selector
  var editListener = function(selector) {
    var span = $(selector);
    var old_val = spanToTextInput(span);
    span.data('old_data', old_val);

    showEditButtons(span.parent());
  };

  // button listener for canceling edits to the span identified by the given jquery selector
  var cancelListener = function(selector) {
    var span = $(selector);
    cancelSpanChanges(span);

    hideEditButtons(span.parent());
  }

  // button listener for saving edits to the span identified by the given jquery selector
  var saveListener = function(selector) {
    var span = $(selector);
    saveSpanChanges(span);

    hideEditButtons(span.parent());
  }
  
  // trip info edit buttons
  $('#edit-leaving-at').click(function() {
    var span = $('#leaving-at-val');
    showEditButtons(span.parent());
    
//    document.getElementById("leaving-at-val").style.visibility = 'hidden';

//  I don't rightly know whether we want to keep the old label hidden--it's 
// nice to see what you'll revert back to if you cancel? 
 
    document.getElementById('start').style.visibility = 'visible'; 
  });
  $('#edit-getting-back').click(function() {
    var span = $('#getting-back-val');
    showEditButtons(span.parent());
    
    document.getElementById('stop').style.visibility = 'visible'; 
  });
  $('#edit-leaving-from').click(function() {
    editListener('#leaving-from-val');
  });
  $('#edit-organizer-number').click(function() {
    editListener('#organizer-number-val');
  });


  // trip info save buttons
  $('#save-leaving-at').click(function() {
    var span = $('#leaving-at-val');
    var text = $("#start").data("DateTimePicker").getDate()._d.toLocaleString();

    span.empty();
    span.append(text);
    
    hideEditButtons(span.parent());
    document.getElementById("start").style.visibility = "hidden";
  });
  $('#save-getting-back').click(function() {
    var span = $('#getting-back-val');
    var text = $("#stop").data("DateTimePicker").getDate()._d.toLocaleString();

    span.empty();
    span.append(text);
    
    hideEditButtons(span.parent());
    document.getElementById("stop").style.visibility = "hidden";
  });
  $('#save-leaving-from').click(function() {
    saveListener('#leaving-from-val');
    showLocation();
  });
  $('#save-organizer-number').click(function() {
    saveListener('#organizer-number-val');
  });

  // trip info cancel buttons
  $('#cancel-leaving-at').click(function() {
    var span = $('#leaving-at-val');
    hideEditButtons(span.parent());
    document.getElementById("start").style.visibility = "hidden";
  });
  $('#cancel-getting-back').click(function() {
    var span = $('#getting-back-val');
    hideEditButtons(span.parent());
    document.getElementById("stop").style.visibility = "hidden";
  });
  $('#cancel-leaving-from').click(function() {
    cancelListener('#leaving-from-val');
  });
  $('#cancel-organizer-number').click(function() {
    cancelListener('#organizer-number-val');
  });

  ///////////////////////////////////////
  // Name
  ///////////////////////////////////////

  // hide buttons used for editing
  $('#name-div button.editing').hide();

  // add button listeners for the name span
  $('#edit-name').click(function() {
    editListener('#name');
  });

  $('#save-name').click(function() {
    saveListener('#name');
  });

  $('#cancel-name').click(function () {
    cancelListener('#name');
  });
});
