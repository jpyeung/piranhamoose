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

  // individual table cell functions
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

  // save changes to a cell containing a text field or a dropdown
  function saveCellChanges(cell) {
    var text = cell.find('input').val() || cell.find('select').val();
    cell.empty();
    cell.text(text);
  };

  // save changes to a cell containing a checkbox
  function saveCheckboxChanges(cell) {
    var checked = cell.find('input').prop('checked');
    cell.empty();

    if (checked){
      cell.text('Yes');
    } else {
      cell.text('No');
    }
    return;
  }

  // cancel changes to a cell by reinstating the old value
  var cancelCellChanges = function(cell, old_val) {
    cell.empty();
    cell.text(old_val);
  };

  // whole table row functions
  // turn a whole row into the appropriate form. Returns the old values of fields
  var makeRowEditable = function(row) {
    var cells = row.find('td');

    var results = {};

    for (property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        results[property] = info.edit_fn(cells.eq(info.col));
      }
    }

    showEditButtons(cells.eq(columns.actions.col));

    return results
  };

  // sets field values to the current values of the respective inputs
  var saveRowChanges = function(row) {
    row.removeClass('new-row');
    var cells = row.find('td');
    for (property in columns) {
      if (property != 'actions') {
        var info = columns[property];
        info.save_fn(cells.eq(info.col));
      }
    }

    hideEditButtons(cells.eq(columns.actions.col));
  };

  // if the row was previously saved, restores old values of fields, otherwise
  //   removes the row entirely
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

  // adding a new row. Includes listeners on the buttons
  // note: because buttons are IDed by their current position in the table,
  //  some combinations of adds and deletes will produce buttons with the same
  //  ID. This could maybe cause issues!
  var addBlankRow = function() {
    var rows = $('#user-table tbody tr');
    var index = rows.length;

    // create template for a new row
    var new_row = $('<tr class="new-row"></tr>');
    for (property in columns) {
      if (property != 'actions') {
        var default_val = columns[property].default_val
        new_row.append($('<td></td>').text(default_val));
      }
    }

    // this is sloppy code and it makes me sad :( I could probably abstract it, but 
    //   I don't think there's any reason to except my own sense of aesthetics
    var edit_button = $(
      '<button id="edit-row'+index+'" class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-pencil"></span> Edit </button>'
    ).click(function() {
      var old_data = makeRowEditable(new_row);
      new_row.data('old_data', old_data);
    });
    
    var delete_button = $(
      '<button id="delete-row'+index+'" class="not-editing btn btn-danger btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Delete </button>'
    ).click(function() {
      new_row.remove();
    });

    var save_button = $(
      '<button id="save-row'+index+'" class="editing btn btn-success btn-xs">' +
      '<span class="glyphicon glyphicon-ok"></span> Save </button> '
    ).click(function() {
      saveRowChanges(new_row);
    }).hide();

    var cancel_button = $(
      '<button id="cancel-row'+index+'" class="editing btn btn-warning btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Cancel </button>'
    ).click(function() {
      cancelRowChanges(new_row);
    }).hide();

    var action_cell = $('<td></td>').append(
      edit_button, ' ', delete_button, ' ', save_button, ' ', cancel_button
    );

    new_row.append(action_cell);
    $('#user-table tbody').append(new_row);

    // make the row editable on creation
    edit_button.click();
  }

  $('#add-person').click(addBlankRow);


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
    editListener('#leaving-at-val');
  });
  $('#edit-leaving-from').click(function() {
    editListener('#leaving-from-val');
  });
  $('#edit-organizer-number').click(function() {
    editListener('#organizer-number-val');
  });


  // trip info save buttons
  $('#save-leaving-at').click(function() {
    saveListener('#leaving-at-val');
  });
  $('#save-leaving-from').click(function() {
    saveListener('#leaving-from-val');
  });
  $('#save-organizer-number').click(function() {
    saveListener('#organizer-number-val');
  });

  // trip info cancel buttons
  $('#cancel-leaving-at').click(function() {
    cancelListener('#leaving-at-val');
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
