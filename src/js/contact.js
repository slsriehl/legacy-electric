// Contact Form Scripts


$(document).ready(function() {

	//validation for contact form
	$('#contactForm').validate({
		submitHandler: function(form, event) {
			event.preventDefault();
			console.log(form);
			var data = formToJson(event.target.elements);
			console.log(data);
			var otherData = formToJson(form);
			// $.ajax({
			// 	url: "/mail",
			// 	type: "POST",
			// 	data: data
			// })
			// .done(function(success) {
			// 	console.log(success);
			// })
			// .fail(function(failure) {
			// 	console.log(failure);
			// });
		},
		rules: {
			name: "required",
			email: {
				email: true,
				required: true
			},
			message: "required"
		},
		messages: {
			name: "Your name is required.",
			email: {
				email: "Please enter a valid email.",
				required: "Your email is required."
			},
			message: "Please type a message!"
		}
	});
	//
	// //submit handler for contact form
	// $('#contactForm').on('submit', function(event) {
	// 	event.preventDefault();
	//
	// });
});





$(function() {

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
            console.log('front end submit error.');
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "/mail",
                type: "POST",
                data: {
                    name: name,
                    phone: phone,
                    email: email,
                    message: message
                }
            }).done(function(response) {
                    if(response == 'message not sent.  Try again later or call Legacy Electrical Services.') {
                        //Fail message
                        $('#success').html("<div class='alert alert-danger'>");
                        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-danger').append($("<strong>").text("Sorry " + firstName + ', ' + response));
                        $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");

                    } else if(response == 'Message successfully sent!  Look forward to an email or call from Legacy.') {
                        $('#success').html("<div class='alert alert-success'>");
                        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-success')
                            .append("<strong>" + response + "</strong>");
                        $('#success > .alert-success')
                            .append('</div>');

                        //clear all fields
                        $('#contactForm').trigger("reset");
                    } else if (!response) {
                        console.log('no response, error.');
                    }
                });
                //cache: false,
                // success: function() {
                //     // Success message

                // },
                // error: function() {
                //     // Fail message
                // },
            }
        });
        function filter() {
            return $(this).is(":visible");
        }
    });

$("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
});



/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
