$(document).ready(function() {

    $("#greetings").fadeIn(5000);

    $("#greetings video").bind("ended", function(){

        $("#nextholiday").fadeIn(1000);

    })

});