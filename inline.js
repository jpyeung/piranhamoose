$(document).ready(function() {
  $('#user-table tbody button.editing').hide();

  var cellToTextInput = function(cell) {
    var text = cell.text();
    cell.empty();

    var input = $('<input type="text">').val(text);
    cell.append(input);

    return text;
  };

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

  var saveRowChanges = function(row) {
    var cells = row.find('td')

    cells.slice(0, 4).each(function() {
      saveCellChanges($(this));
    });

    cells.eq(4).find('button.not-editing').show();
    cells.eq(4).find('button.editing').hide();
  };

  var cancelRowChanges = function(row) {
    var cells = row.find('td');
    var old_data = row.data('old_data');

    cancelCellChanges(cells.eq(0), old_data.name);
    cancelCellChanges(cells.eq(1), old_data.equip);
    cancelCellChanges(cells.eq(2), old_data.diff);
    cancelCellChanges(cells.eq(3), old_data.phone);

    cells.eq(4).find('button.not-editing').show();
    cells.eq(4).find('button.editing').hide();
  };

  var addBlankRow = function() {
    var rows = $('#user-table tbody tr');
    var index = rows.length;

    var empty_row = $('<tr><td></td><td></td><td>Beginner</td><td></td></tr>');

    var edit_button = $(
      '<button id="edit-row'+index+'" class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-pencil"></span> Edit </button>'
    ).click(function() {
      var row = $('#user-table tbody tr').eq(index);
      var old_data = makeRowEditable(row);
      row.data('old_data', old_data);
    });
    
    var delete_button = $(
      '<button id="delete-row'+index+'" class="not-editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Delete </button>'
    ).click(function() {
      $('#user-table tbody tr').eq(index).remove();
    });

    var save_button = $(
      '<button id="save-row'+index+'" class="editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-ok"></span> Save </button> '
    ).click(function() {
      saveRowChanges($('#user-table tbody tr').eq(index));
    }).hide();

    var cancel_button = $(
      '<button id="cancel-row'+index+'" class="editing btn btn-default btn-xs">' +
      '<span class="glyphicon glyphicon-remove"></span> Cancel </button>'
    ).click(function() {
      cancelRowChanges($('#user-table tbody tr').eq(index));
    }).hide();

    var action_cell = $('<td></td>').append(
      edit_button, ' ', delete_button, ' ', save_button, ' ', cancel_button
    );

    empty_row.append(action_cell);
    $('#user-table tbody').append(empty_row);
  }

  $('#add-person').click(addBlankRow);

  // $('#edit-row0').click(function() {
  //   var row0 = $('#user-table tbody tr').eq(0)
  //   var old_data = makeRowEditable(row0);
  //   row0.data('old_data', old_data);
  // });

  // $('#save-row0').click(function() {
  //   // console.log('clicked');
  //   saveRowChanges($('#user-table tbody tr').eq(0));
  // });

  // $('#cancel-row0').click(function() {
  //   // console.log('clicked');
  //   cancelRowChanges($('#user-table tbody tr').eq(0));
  // });

  // $('#delete-row0').click(function() {
  //   $('#user-table tbody tr').eq(0).remove();
  // });

});
