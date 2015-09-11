$(document).ready(function() {

    $("#introimage").fadeIn(5000, function() {

        $("#introportrait").fadeIn(3000);
    });

    $("#introportrait").click(function() {

        $("#introportrait").fadeOut(3000, function() {

            $("#introimage").fadeOut(5000, function() {

                window.location = "er/kleio-init.htm";
            });
        });
    })

});