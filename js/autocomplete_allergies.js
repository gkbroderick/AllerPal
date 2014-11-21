var allergies = [
	{ value: "Milk"},
	{ value: "Eggs"},
	{ value: "Fish"},
	{ value: "Shellfish"},
	{ value: "Peanuts"},
	{ value: "Tree Nuts"},
	{ value: "Wheat"},
	{ value: "Gluten"},
	{ value: "Soy"}
];

// $(document).ready(function()
$('#allergyInput').autocomplete({
  lookup: allergies
});
