$(document).ready(function() {
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
  var columns = {
    name: 0,
    equip: 1,
    skill: 2,
    phone: 3,
    actions: 4
  }

  // hide buttons only used while editing
  $('#user-table tbody button.editing').hide();

  // individual table cell functions
  // Turn a cell into a text input. Returns old field value.
  var cellToTextInput = function(cell) {
    var text = cell.text();
    cell.empty();

    var input = $('<input type="text">').val(text);
    cell.append(input);

    return text;
  };

  // Turn a cell into a selection dropdown. Returns old field value.
  var cellToDropdown = function(cell) {
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
  };

  var saveCellChanges = function(cell) {
    var text = cell.find('input').val() || cell.find('select').val();
    cell.empty();
    cell.text(text);
  };

  var cancelCellChanges = function(cell, old_val) {
    cell.empty();
    cell.text(old_val);
  };

  // whole table row functions
  // turn a whole row into inputs. Returns the old values of fields
  var makeRowEditable = function(row) {
    var cells = row.find('td');

    var old_name = cellToTextInput(cells.eq(columns.name));
    var old_equip = cellToTextInput(cells.eq(columns.equip));
    var old_skill = cellToDropdown(cells.eq(columns.skill));
    var old_phone = cellToTextInput(cells.eq(columns.phone));

    showEditButtons(cells.eq(columns.actions));

    return { name: old_name, equip: old_equip, skill: old_skill, phone: old_phone };
  };

  // sets field values to the current values of the respective inputs
  var saveRowChanges = function(row) {
    row.removeClass('new-row');
    var cells = row.find('td');
    var action_cell = cells.eq(columns.actions);

    cells.not(action_cell).each(function() {
      saveCellChanges($(this));
    });

    hideEditButtons(action_cell);
  };

  // restores old values of fields, if the row was previously saved, otherwise
  // removes the row entirely
  var cancelRowChanges = function(row) {
    if (row.hasClass('new-row')) {
      row.remove();
      return;
    }
    var cells = row.find('td');
    var old_data = row.data('old_data');

    cancelCellChanges(cells.eq(columns.name), old_data.name);
    cancelCellChanges(cells.eq(columns.equip), old_data.equip);
    cancelCellChanges(cells.eq(columns.skill), old_data.skill);
    cancelCellChanges(cells.eq(columns.phone), old_data.phone);

    hideEditButtons(cells.eq(columns.actions));
  };

  // adding a new row. Includes listeners on the buttons
  // note: because buttons are IDed by their current position in the table,
  //  some combinations of adds and deletes will produce buttons with the same
  //  ID. This could cause issues!
  var addBlankRow = function() {
    var rows = $('#user-table tbody tr');
    var index = rows.length;

    var empty_row = $('<tr class="new-row"><td></td><td>Helmet, Boots, Skis, Poles</td><td>Beginner</td><td></td></tr>');

    var edit_button = $(
      '<button id="edit-row'+index+'" class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-pencil"></span> Edit </button>'
    ).click(function() {
      var old_data = makeRowEditable(empty_row);
      empty_row.data('old_data', old_data);
    });
    
    var delete_button = $(
      '<button id="delete-row'+index+'" class="not-editing btn btn-danger btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Delete </button>'
    ).click(function() {
      empty_row.remove();
    });

    var save_button = $(
      '<button id="save-row'+index+'" class="editing btn btn-success btn-xs">' +
      '<span class="glyphicon glyphicon-ok"></span> Save </button> '
    ).click(function() {
      saveRowChanges(empty_row);
    }).hide();

    var cancel_button = $(
      '<button id="cancel-row'+index+'" class="editing btn btn-warning btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Cancel </button>'
    ).click(function() {
      cancelRowChanges(empty_row);
    }).hide();

    var action_cell = $('<td></td>').append(
      edit_button, ' ', delete_button, ' ', save_button, ' ', cancel_button
    );

    empty_row.append(action_cell);
    $('#user-table tbody').append(empty_row);

    edit_button.click();
  }

  $('#add-person').click(addBlankRow);


  ///////////////////////////////////////
  // Trip info
  ///////////////////////////////////////
  $('#trip-info button.editing').hide();

  var spanToTextInput = function(span) {
    var text = span.text();
    var input = $('<input type="text">').val(text);

    span.empty();
    span.append(input);

    return text;
  };

  var saveSpanChanges = function(span) {
    var text = span.find('input').val();
    span.empty();
    span.append(text);
  };

  var cancelSpanChanges = function(span) {
    var old_val = span.data('old_data');
    span.empty();
    span.text(old_val);
  };

  var editListener = function(selector) {
    var span = $(selector);
    var old_val = spanToTextInput(span);
    span.data('old_data', old_val);

    showEditButtons(span.parent());
  };

  var cancelListener = function(selector) {
    var span = $(selector);
    cancelSpanChanges(span);

    hideEditButtons(span.parent());
  }

  var saveListener = function(selector) {
    var span = $(selector);
    saveSpanChanges(span);

    hideEditButtons(span.parent());
  }
  
  // edit buttons
  $('#edit-leaving-at').click(function() {
    editListener('#leaving-at-val');
  });
  $('#edit-leaving-from').click(function() {
    editListener('#leaving-from-val');
  });
  $('#edit-organizer-number').click(function() {
    editListener('#organizer-number-val');
  });


  // save buttons
  $('#save-leaving-at').click(function() {
    saveListener('#leaving-at-val');
  });
  $('#save-leaving-from').click(function() {
    saveListener('#leaving-from-val');
  });
  $('#save-organizer-number').click(function() {
    saveListener('#organizer-number-val');
  });

  // cancel buttons
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

  $('#name-div button.editing').hide();

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
