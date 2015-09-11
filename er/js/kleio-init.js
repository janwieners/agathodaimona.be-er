$(document).ready(function() {

    $("#cancelbutton").click(function() {

        alert('come on...');
    });

    $(".text-editor-wrap").draggable();
    $("#kleiogui").draggable();

    var myDate = new Date(),
        greeting = "good ";

    /* hour is before noon */
    if (myDate.getHours() < 12)
    {
        greeting += "morning";
    }
    else  /* Hour is from noon to 5pm (actually to 5:59 pm) */
    if ( myDate.getHours() >= 12 && myDate.getHours() <= 17 )
    {
        greeting += "afternoon";
    }
    else  /* the hour is after 5pm, so it is between 6pm and midnight */
    if ( myDate.getHours() > 17 && myDate.getHours() <= 24 )
    {
        greeting += "evening";
    }
    else  /* the hour is not between 0 and 24, so something is wrong */
    {
        greeting = "hello";
    }

    greeting += " <strong>mthalle</strong>!";

    var seconds = myDate.getSeconds();

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var minutes = myDate.getMinutes();

    if (minutes < 10) {
        minutes = "0" + minutes
    }

    var month = myDate.getMonth() + 1;

    if (month < 10) {
        month = "0" + month;
    }

    var kleiostring = "kleiob^1000<br>" +
        "Kleio Version 10.0.1 --- " +
        myDate.getDate() + "." +
        month + "." +
        myDate.getFullYear() + ", " +
        myDate.getHours() + ":" +
        minutes + ":" +
        seconds + "^1000" + "<br>" +
        "Historical Workstation Project / retirement version^1000" +
        "<br>" +
        "- inititalizing database^1000" +
        "<br>" +
        "done^100" +
        "<br>" +
        "- starting long term preservation module^1000" +
        "<br>" +
        "<span style=\"color: red;\">runtime error 23^2000</span>" +
        "<br>anyway ... who needs long term preservation in " + myDate.getFullYear() + "?!?^3000" +
        "<br>" +
        "- generating some VD18 numbers^1000 - <strong>because I can!^1000</strong>" +
        "<br>" +
        "VD18 90026470<br>" +
        "VD18 90026489<br>" +
        "VD18 90026497<br>" +
        "VD18 90026500<br>" +
        "VD18 90026519<br>" +
        "VD18 90026527<br>" +
        "VD18 90026535<br>" +
        "VD18 90026543<br>" +
        "VD18 90026551<br>" +
        "VD18 9002656X<br>" +
        "&Hat;C^1000<br>" +
        "Die Unterbrechung wird zum Schutz ihrer Datenbasen ignoriert.^1000" +
        "<br>starting graphical user interface.^2000";

    $(function(){

        $(".element").typed({

            strings: [
                "^3000" +
                greeting + "^1000",
                "what a wonderful day!^1000",
                "i will now start myself^1000",
                kleiostring
            ],
            typeSpeed: 0,
            backSpeed: 0,

            callback: function() {

                // Done
                alert("error");
                alert("no long term preservation module found!");
                alert("who needs long term preservation nowadays?");
                alert("i mean i COULD start the long term preservation module - but...")
                alert("why should i?");
                alert("by the way i'm currently very busy");
                alert("i'm doing THINGS");
                alert("very IMPORTANT things");
                alert("if you really want to start the long term preservation module - then ... do it yourself!");
                alert("you can find a tutorial on how to start unnecessary modules in the kleio documentation");
                alert("you can read it if you want to, but ... i know the guys who tried to write a documentation about me.");
                alert("very poor guys...");
                alert("ok, now stop babbling. see you later!");
                alert("have fun!");
                alert("do not say I did not warn you!");

                $("#kleiogui").fadeIn(5000);
            }
        });
    });

});