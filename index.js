// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

$(document).ready(function() {

	var resort_dialog = function () {
		var dlg = $("#resort-form").clone();
        var leaving_at = dlg.find(("#leaving_at")),
            leaving_from = dlg.find(("#leaving_from")),
            organizer_number = dlg.find(("#organizer_number"));
        var config = {
            autoOpen: true,
            height: 600,
            width: 700,
            modal: true,
            buttons: {
                "Save": save_data,
                    "Cancel": function () {
                    dlg.dialog("close");
                }
            },
            close: function () {
                dlg.remove();
            }
        };
        config.title = "Edit trip information";
        dlg.dialog(config);

        function save_data() {
        	$("#leaving_at_val").text(leaving_at.val());
        	$("#leaving_from_val").text(leaving_from.val());
        	$("#organizer_number_val").text(organizer_number.val());
            dlg.dialog("close");
        }
	}
		
    var trip_dialog = function () {
        var dlg = $("#trip-form").clone();
        var leaving_at = dlg.find(("#leaving_at")),
            leaving_from = dlg.find(("#leaving_from")),
            organizer_number = dlg.find(("#organizer_number"));
        var config = {
            autoOpen: true,
            height: 600,
            width: 700,
            modal: true,
            buttons: {
                "Save": save_data,
                    "Cancel": function () {
                    dlg.dialog("close");
                }
            },
            close: function () {
                dlg.remove();
            }
        };
        config.title = "Edit trip information";
        dlg.dialog(config);

        function save_data() {
        	$("#leaving_at_val").text(leaving_at.val());
        	$("#leaving_from_val").text(leaving_from.val());
        	$("#organizer_number_val").text(organizer_number.val());
            dlg.dialog("close");
        }
    };

    var new_dialog = function (type, row) {
        var dlg = $("#dialog-form").clone();
        var name = dlg.find(("#name")),
            equipment = dlg.find(("#equipment")),
            skill_level = dlg.find(("#skill_level")),
            phone_number = dlg.find(("#phone_number"));
        type = type || 'Create';
        var config = {
            autoOpen: true,
            height: 600,
            width: 700,
            modal: true,
            buttons: {
                "Save": save_data,
                    "Cancel": function () {
                    dlg.dialog("close");
                }
            },
            close: function () {
                dlg.remove();
            }
        };
        if (type === 'Edit') {
            config.title = "Edit Person";
            delete(config.buttons['Add person']);
            config.buttons['Save'] = function () {
                row.remove();
                save_data();

            };

        }
        dlg.dialog(config);

        function save_data() {
        	$("#users tbody").append("<tr>" + "<td>" + name.val() + "</td>" + "<td>" + equipment.val() + "</td>" + "<td>" + skill_level.find("option:selected").text() + "</td>" + "<td>" + phone_number.val() + "</td>" + "<td><a class='edit' href=''><img src='images/pencil_16x16.png' alt='edit'></a> <span class='delete'><a href=''><img src='images/cross_16x16.png'></a></span></td>" + "</tr>");
            dlg.dialog("close");
        }
    };

    $(document).on('click', 'span.delete', function () {
        $(this).closest('tr').find('td').fadeOut(1000,

        function () {
            $(this).parents('tr:first').remove();
        });

        return false;
    });
    $(document).on('click', 'td a.edit', function () {
        new_dialog('Edit', $(this).parents('tr'));
        return false;
    });
	
	$("#change_resort_button").click(function(evt) {
		resort_dialog();
        return false;
	});

    //$("#add-person").button().click(new_dialog);
    $("#edit_info_button").button().click(trip_dialog);
});
