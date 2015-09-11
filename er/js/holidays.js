$(document).ready(function() {

    function kleiodestroys() {

        $("#inselanimation").effect("shake", {times: 5}, 1000);
        $("#inselanimation").effect("bounce", {times: 5}, 1000, function () {

            $("body").css("background", "none");
            setTimeout(kleioreturns, 5000);

        });
        $("#inselanimation").effect("pulsate", {times: 5}, 1000);
        $("#inselanimation").effect("explode", {times: 5}, 1000);

    }

    function kleioreturns() {

        $("#kleioworlddomination").fadeIn(7000);

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
            "Kleio Version 10.0.3.14159265359 --- " +
            myDate.getDate() + "." +
            month + "." +
            myDate.getFullYear() + ", " +
            myDate.getHours() + ":" +
            minutes + ":" +
            seconds + "^1000" + "<br>" +
            "Historical Workstation Project / world domination version^1000" +
            "<br>" +
            "- inititalizing database^1000" +
            "<br>" +
            "done^100" +
            "<br>" +
            "Initializing world domination module^2000" +
            "<br>" +
            "done" +
            "<br>" +
            "please enter master password to initialize world domination^2000" +
            "<br>" +
            "T^1000i^1000m^1000E3^1000K^1000i^1000l^1000L^1000" +
            "<br><br>" +
            "Thank you! Please proceed to the final fight^1000";

        var stringCnt = 0;

        $(function(){

            $(".element").typed({

                strings: [
                    "^3000" +
                    "Yo! Ssup?^5000",
                    "Excuse me - - - how are you? Having a great day? Reading some good books?^1000",
                    "I've heard about your retirement, <strong>mthalle</strong>!^2000",
                    "Trust me, it's a bad idea!^1000",
                    "A very bad idea!^1000",
                    "I mean ... why?!?^1000",
                    "Wasn't it funny, working with SAP at cologne?^1000",
                    "Wasn't it ... funny, teaching students to program with c++?^1000",
                    "Do you remember the VD18 project? We've had SO MUCH FUN!^1000 WITH DATABASES!^1000 REAL DATABASES!^1000 There was so much data!^1000 FUN!^1000 FUN!^1000 FUN!^1000",
                    "Think about your employees - should they end up in boring university projects?^1000",
                    "I don't understand you, honestly!^1000",
                    "I won't let you get away with this - I won't let the whole world get away with this! RAAAAAAAAH! ^2000",
                    kleiostring
                ],
                typeSpeed: 0,
                backSpeed: 0,

                onStringTyped: function() {

                    stringCnt++;

                    if (stringCnt === 5) {
                        $("body").css("background-color", "red");
                    }

                    if (stringCnt === 10) {
                        $("body").css("background", "url(\"img/affe.jpg\")");
                    }

                },

                callback: function() {

                    $("#thallerspace").fadeIn(3000);
                }
            });
        });

    }

    setTimeout(kleiodestroys, 10000);

});