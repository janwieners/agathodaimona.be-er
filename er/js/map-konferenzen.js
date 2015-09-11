// Add leaflet map
var map = L.map('map').setView([50.94129, 6.95817], 5);

var clicks = 0;
var boring = function(element) {

    $(element).remove();

    var messages = [
        "Boring!",
        "Boooooring!",
        "Booohooring!"
    ];

    alert(messages[_.random(0, messages.length-1)]);

    clicks++;

    if (clicks === 10) {

        var loveIcon = L.icon({
            iconUrl: 'img/heart.png',
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        // Add G&ouml;ttingen - and much love
        L.marker([51.5369374,9.9268528], {icon: loveIcon}).addTo(map)
            .bindPopup('<br>' +
            '<a href="kleio-bruehl.htm"><img style="width: 75px;" src="img/amedick.png" alt="Amedick"></a>' +
            '<br>' +
            ''
        );
    }
};
// Refactor me - please!
var notboring = function(element) {

    $(element).remove();
    clicks++;
    alert("WOW!");

    if (clicks === 10) {

        var loveIcon = L.icon({
            iconUrl: 'img/heart.png',
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        // Add G&ouml;ttingen - and much love
        L.marker([51.5369374,9.9268528], {icon: loveIcon}).addTo(map)
            .bindPopup('<br>' +
            '<a href="kleio-bruehl.htm"><img style="width: 75px;" src="img/amedick.png" alt="Amedick"></a>' +
            '<br>' +
            ''
        );
    }
};

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([53.4722454,-2.2235922]).addTo(map)
    .bindPopup('<h1>Lieber Herr Thaller,</h1>' +
    'ich erinnere mich immmer noch gerne und h&auml;ufig an die Abende, an denen Sie die HKI zu sich nach Hause luden, ' +
    'und Sie mir vor Ihrer B&uuml;cherwand etliche Fantasy Romane empfahlen! Turtledove\'s "Guns of the South" kommt mir ' +
    'gerade ins Ged&auml;chtnis, aber auch etliche andere. Irgendwie lustig, dass die Diskussionen &uuml;ber B&uuml;cher meine ' +
    'erste Assoziation waren :).' +
    '<br>' +
    '<br>Beruflich habe ich Ihnen eine Menge zu verdanken. Angefangen von dem Praktikum in London mit Thorsten Reimer, ' +
    'was es mir direkt ein paar Jahre sp&auml;ter erm&ouml;glichte einen Job in Oxford zu finden, &uuml;ber meinen Erstkontakt mit ' +
    'Ontologien in einem Ihrer Hauptseminare &uuml;ber die Diplom-Arbeit (welche sehr ergeizig versuchte auf der Basis von ' +
    'juristischen Ontologien automatisch Gesetzesbr&uuml;che zu ermitteln) bis hin zu ihren Empfehlungen bei meiner PhD ' +
    'Bewerbung.' +
    '<br><br>In diesen Wochen schreibe ich die Arbeit zusammen, zum Thema Reasoning mit OWL Ontologien, ' +
    'was wohl ohne Sie nie passiert w&auml;re!' +
    '<br>Ich w&uuml;nsche Ihnen einen wunderbaren Ruhestand! Vielen Dank f&uuml;r Alles!' +
    '<br><br>Nico<br>' +
    '<img src="img/nico_small.jpg" width="" alt="Nico Matentzoglu">' +
    '<br><button onclick="notboring(this)" class="boringbutton">Big up, Nico Matentzoglu!</button>'
);

L.marker([53.428665,-8.32871]).addTo(map)
    .bindPopup('<h1>IEEE International Conference of Artificial Brewing</h1>' +
    '<iframe width="300" height="315" src="https://www.youtube.com/embed/eirq4laOhcU" frameborder="0" allowfullscreen></iframe>' +
    '<br>' +
    '<button onclick="boring(this)" class="boringbutton">Been there!</button>'
);

L.marker([52.3836761,-8.9671609]).addTo(map)
    .bindPopup('<h1>International Computer History and Musicology 2015</h1>' +
    '<iframe width="300" height="315" src="https://www.youtube.com/embed/2Z_TheGgFWI" frameborder="0" allowfullscreen></iframe>' +
    '<br>' +
    '<button onclick="boring(this)" class="boringbutton">Been there!</button>'
);

L.marker([49.7778813,6.6494598]).addTo(map)
    .bindPopup('<h1>Programming for Humanists</h1>' +
    'Participants will learn some programming languages (HTML, XSLT, XQuery, and Python, for instance) as well for manipulating their digital resources.' +
    '<br>' +
    '<button onclick="boring(this)" class="boringbutton">Been there!</button>'
);

L.marker([52.5075419,13.4251364]).addTo(map)
    .bindPopup('<h1>Multi-international conference on distant reading in digital editions with digital devices - from distant perspectives</h1>' +
    '' +
    '<br>' +
    '<button onclick="boring(this)" class="boringbutton">Been there!</button>'
);

L.marker([60.3651901,5.4291772]).addTo(map)
    .bindPopup('<h1>This very (very!) important conference in northern europe everyone knows</h1>' +
    '' +
    '<br>' +
    '<button onclick="boring(this)" class="boringbutton">Been there!</button>'
);

L.marker([50.92493,6.92525]).addTo(map)
    .bindPopup('<h2>Das CoDArchLab w&uuml;rde ohne Sie und die von Ihnen ausgebildeten ' +
    'Studenten sicher noch immer "Forschungarchiv f&uuml;r Antike Plastik" ' +
    'hei&szlig;en. Das gesamte Team dankt Ihnen f&uumlr die fruchtbare ' +
    ' Zusammenarbeit.</h2><br>' +
    '<img src="img/codarchlab_small.jpg" width="400px" alt="CoDArchLab">' +
    '<button onclick="notboring(this)" class="boringbutton">&hearts; Wow &hearts;!</button>'
);

L.marker([50.8961389,7.5406667]).addTo(map)
    .bindPopup('<video width="400" controls>' +
    '<source src="video/iordanidis.mp4" type="video/mp4">' +
    'Your browser does not support the video tag.</video><br>' +
    '<button onclick="notboring(this)" class="boringbutton">Thank you, Martin Iordanidis!</button>'
);

L.marker([48.2206849,16.3800599]).addTo(map)
    .bindPopup('<h1>S. Kronenwett und J. Puhl: &uuml;ber Herrn Thaller</h1>' +
    'Herr Thaller ist sowohl fachlich als auch menschlich eine Ausnahmeerscheinung und wir f&uuml;hlen uns sehr geehrt, dass wir seine Mitarbeiterinnen sein durften. ' +
    'Hier zwei Anekdoten: ' +
    '<h2>Schlafen kann ich, wenn ich tot bin</h2>' +
    'Dieses legend&auml;re Fassbinder-Zitat scheint auch auf Herrn Thaller zu zutreffen. Wirft man einen Blick auf die Uhrzeiten, zu denen Herr Thaller regelm&auml;&szlig;ig Emails verschickt, so  fragten wir uns oft:  Wann schl&auml;ft Herr Thaller eigentlich? Muss er &uuml;berhaupt schlafen und essen oder nur die Akkus wechseln? In seiner G&ouml;ttinger Zeit - so wurde uns ferner zugetragen - hat er au&szlig;erdem so viele Zigaretten geraucht, dass man ihm in seinem B&uuml;ro durch die Rauchschwaden gar nicht mehr gesehen hat. Aber das ist lange her ... In der Zwischenzeit wurden die Glimmst&auml;ngel durch Wanderschuhe ersetzt.' +

    '<h2>Fleisch ist mein Gem&uuml;se</h2>' +
    'Auf Reisen aber auch bei entsprechenden Anl&auml;ssen in K&ouml;ln beeindruckte Herr Thaller h&auml;ufig durch ein abenteuerliches Ern&auml;hrungsverhalten: Einerseits scheinen koffeinhaltige Substanzen wie Cola oder Kaffee einer der wichtigsten Energiemotoren &uuml;berhaupt in seinem Leben zu sein, andererseits scheint die Aufnahme von fester Nahrung tags&uuml;ber v&ouml;llig verzichtbar. Abends hingegen bestellt er gro&szlig;e Portionen in leckeren Restaurants, immer mit dem Hinweis: die Gem&uuml;sebeilagen und der Salat k&ouml;nnten gerne weg gelassen werden. Wenn diesem Wunsch seitens der Kellner nicht nachgekommen wurde, so hatten wir von Zeit zu Zeit das Vergn&uuml;gen, diese angeboten zu bekommen.' +
    '<br><br>Herr Thallers geisteswissenschaftliches und  informationstechnisches Wissen, sein Arbeitseifer und Disziplin, seine Weitsicht und Vision, seine Ruhe und Gelassenheit, seine Bescheidenheit, H&ouml;flichkeit und Freundlichkeit - gepaart mit feinstem &ouml;sterreichischem Humor - machen Herrn Thaller so einzigartig.' +
    'Wir werden Sie sehr vermissen!' +
    '<br><img src="img/johanna-simone.jpg" width="" alt="Johanna Puhl und Simone Kronenwett">' +
    '<br><button onclick="notboring(this)" class="boringbutton">Omnomnom!</button>'
);

L.marker([45.8706437,10.875023]).addTo(map)
    .bindPopup('<h3>Lieber Herr Thaller,</h3>' +
    'ohne Sie und Ihre Historisch-Kulturwissenschaftliche Informationsverarbeitung h&auml;tte ich niemals solch einen Spa&szlig; an der Informatik entwickelt. ' +
    '<br><br>Daf&uuml;r - und dass Sie immer f&uuml;r mich da waren (und sind) - bin ich Ihnen sehr sehr dankbar!' +
    '<br><br>Einen geduldigeren, schlaueren, besseren Lehrer und Mentor als Sie kann ich mir nicht vorstellen.<br>' +
    '<br>Ich w&uuml;nsche Ihnen einen tollen Ruhestand!<br>Ihr Jan Wieners' +
    '<br><br><img src="img/jan-wieners.jpg" width="175px" alt="Jan Wieners"><br>' +
    '<button onclick="notboring(this)" class="boringbutton">Click!</button>'
);

// Display description
$( "#dialog" ).dialog({
    modal: true,
    width: 600
});