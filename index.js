// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.

$(document).ready(function() {
	var submit = function() {
		// get the input and insert a new row for it
		var name = document.getElementById('name_field').value;
		var equipment = document.getElementById('equipment_field').value;
		var skill = document.getElementById('skill_field').value;
		var phone = document.getElementById('phone_number_field').value;
		var table = document.getElementById("people");
		var row = table.insertRow(-1);
		var name_cell = row.insertCell(0);
		var equipment_cell = row.insertCell(1);
		var skill_cell = row.insertCell(2);
		var phone_cell = row.insertCell(3);
		var edit_cell = row.insertCell(4);
		name_cell.innerHTML = name;
		equipment_cell.innerHTML = equipment;
		skill_cell.innerHTML = skill;
		phone_cell.innerHTML = phone;
		edit_cell.innerHTML = "<img src='images/pencil_icon.png' alt='edit'>"
	}
	$('#add_person').click(submit);
});

