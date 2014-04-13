// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

$(document).ready(function() {
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
                "Add a person": save_data,
                    "Cancel": function () {
                    dlg.dialog("close");
                }
            },
            close: function () {
                dlg.remove();
            }
        };
        if (type === 'Edit') {
            config.title = "Edit User";
            delete(config.buttons['Add a person']);
            config.buttons['Edit person'] = function () {
                row.remove();
                save_data();

            };

        }
        dlg.dialog(config);

        function save_data() {
        	$("#users tbody").append("<tr>" + "<td>" + name.val() + "</td>" + "<td>" + equipment.val() + "</td>" + "<td>" + skill_level.find("option:selected").text() + "</td>" + "<td>" + phone_number.val() + "</td>" + "<td><a href='' class='edit'>Edit</a></td>" + "<td><span class='delete'><a href=''>Delete</a></span></td>" + "</tr>");
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

    $("#add-person").button().click(new_dialog);
});

