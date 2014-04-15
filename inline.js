$(document).ready(function() {
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

    var old_name = cellToTextInput(cells.eq(0));
    var old_equip = cellToTextInput(cells.eq(1));
    var old_diff = cellToDropdown(cells.eq(2));
    var old_phone = cellToTextInput(cells.eq(3));

    cells.eq(4).find('button.not-editing').hide();
    cells.eq(4).find('button.editing').show();

    return { name: old_name, equip: old_equip, diff: old_diff, phone: old_phone };
  };

  // sets field values to the current values of the respective inputs
  var saveRowChanges = function(row) {
    row.removeClass('new-row');
    var cells = row.find('td');

    cells.slice(0, 4).each(function() {
      saveCellChanges($(this));
    });

    cells.eq(4).find('button.not-editing').show();
    cells.eq(4).find('button.editing').hide();
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

    cancelCellChanges(cells.eq(0), old_data.name);
    cancelCellChanges(cells.eq(1), old_data.equip);
    cancelCellChanges(cells.eq(2), old_data.diff);
    cancelCellChanges(cells.eq(3), old_data.phone);

    cells.eq(4).find('button.not-editing').show();
    cells.eq(4).find('button.editing').hide();
  };

  // adding a new row. Includes listeners on the buttons
  // note: because buttons are IDed by their current position in the table,
  //  some combinations of adds and deletes will produce buttons with the same
  //  ID. This could cause issues!
  var addBlankRow = function() {
    var rows = $('#user-table tbody tr');
    var index = rows.length;

    var empty_row = $('<tr class="new-row"><td></td><td></td><td>Beginner</td><td></td></tr>');

    var edit_button = $(
      '<button id="edit-row'+index+'" class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-pencil"></span> Edit </button>'
    ).click(function() {
      var old_data = makeRowEditable(empty_row);
      empty_row.data('old_data', old_data);
    });
    
    var delete_button = $(
      '<button id="delete-row'+index+'" class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Delete </button>'
    ).click(function() {
      empty_row.remove();
    });

    var save_button = $(
      '<button id="save-row'+index+'" class="editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-ok"></span> Save </button> '
    ).click(function() {
      saveRowChanges(empty_row);
    }).hide();

    var cancel_button = $(
      '<button id="cancel-row'+index+'" class="editing btn btn-default btn-xs">' +
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

});
