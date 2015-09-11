$(document).ready(function() {

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
        "Kleio Version 10.0.2 --- " +
        myDate.getDate() + "." +
        month + "." +
        myDate.getFullYear() + ", " +
        myDate.getHours() + ":" +
        minutes + ":" +
        seconds + "^1000" + "<br>" +
        "Historical Workstation Project / extended retirement version^1000" +
        "<br>";

    var stringCnt = 0;

    $(function(){

        $(".element").typed({

            strings: ["^3000",
                "Welcome back, <strong>mthalle</strong>!^3000",
                kleiostring,
                "- adding romantic background^1000",
                "done",
                "- adding some love",
                "done",
                "- adding some <strong>real</strong> love",
                "done^12000",
                "I give her all my love",
                "That's all I do^2000",
                "And if you saw my love^2000",
                "You'd love her too^2000",
                "I love her^2000",

                "She gives me everything^2000",
                "And tenderly^2000",
                "The kiss my lover brings^2000",
                "She brings to me^2000",
                "And I love her^3000",
                "&hearts;&hearts;&hearts;&hearts;&hearts;",
                "ok, back to business!^2000",
                "it all starts with a story i'd like to tell. a story about ancient myths, dangerous dragons, furious dwarfs - and beer:^3000",
                "once upon a time in a small medieval town called 'cologne-brühl' a man equipped with super-incredible muscle strength wanted to beautify his house with a beautiful floor mosaic^4000",
                "please click <strong>here</strong> to proceed^5000",
                "sorry, i forgot to embed the hyperlink.^1000",
                "starting graphical user interface"
            ],
            typeSpeed: 0,
            //backSpeed: -1000,

            onStringTyped: function() {

                stringCnt++;

                if (stringCnt === 4) {
                    $("body").css("background", "url(\"img/schlossbruehlbgr.jpg\")");
                }

                if (stringCnt === 6) {
                    $.fn.snow({ minSize: 25, maxSize: 75, newOn: 1000, flakeColor: '#d30000' });
                }

                if (stringCnt === 8) {

                    $("#lovesong").show();
                    // Add video
                    var videoURL = "https://www.youtube.com/embed/96YQdiMV-Jc";

                    $("#lovesong").append('<iframe id="player" width="420" height="315" src="' +
                        videoURL +
                        '?rel=0&wmode=Opaque&autoplay=1" frameborder="0" allowfullscreen></iframe>');
                }

                if (stringCnt === 19) {
                    $("#lovesong").remove();
                }
            },

            callback: function() {

                // Done
                $("#kleiogui").fadeIn(5000);

            }
        });
    });

});