$(".plus").click(function() {
	$ ("#allergyItems:last-child").hide()
	$ ("#allergyItems:last-child").fadeIn ();
});

$(".delete").click(function() {
	$(this).parent().fadeOut();
});

$(".plus").click(function(){
	$(".middle").hide()
	$(".middle").slideDown("600");
});

$(".submitForm").submit(function(){
	$(".middle").hide()
	$(".middle").slideDown("600");
});

