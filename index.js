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
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		cell1.innerHTML = name;
		cell2.innerHTML = equipment;
		cell3.innerHTML = skill;
		cell4.innerHTML = phone;
	}
	$('#add_person').click(submit);
});

