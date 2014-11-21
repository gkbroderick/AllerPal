var allergies = [
	{ value: "milk"},
	{ value: "eggs"},
	{ value: "fish"},
	{ value: "shellfish"},
	{ value: "peanuts"},
	{ value: "tree nuts"},
	{ value: "wheat"},
	{ value: "gluten"},
	{ value: "soy"}
];

// $(document).ready(function()
$('#allergyInput').autocomplete({
  lookup: allergies 
});
