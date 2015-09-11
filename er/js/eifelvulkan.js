$(document).ready(function() {


    $("#papyrus-cover").slideDown(3000);

    $("#papyrus-cover").click(function() {

        $("#papyrus-cover").slideUp(1000, function() {

            $("#papyrus_story-01").slideDown(3000);
        });

    });

    $("#papyrus_story-01").click(function() {

        $("#papyrus_story-01").slideUp(1000, function() {

            $("#papyrus_story-02").slideDown(3000, function() {

                $("#papyrus_story-02").click(function() {

                    window.location = "games/eifelvulkanausbruch/index.htm";
                })

            });
        });

    });

});