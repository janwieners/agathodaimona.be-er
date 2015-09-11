//LOAD LEVEL
var a = window.location.toString();
var levelpos = a.indexOf("lvl=")+4;
var name = a.substring(levelpos);

if(levelpos >7)
    Level ="assets/"+name+".json";

//DISABLE Scrolling By Keys
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


//Load Game

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'fliesencanvas', { preload: preload, create: create, update: update, render: render });

var Level = "assets/level1.json"
//Bilder Laden etc.
function preload() {

    game.load.image('avatar', 'assets/avatar.png');
    game.load.image('Kola', 'assets/Coke.png');
    game.load.image('LPTP', 'assets/laptop.png');
    game.load.tilemap('Mosaik', Level, null, Phaser.Tilemap.TILED_JSON);
    game.load.image('simples_pimples', 'assets/simples_pimples.png');
    game.load.image('background', 'assets/background.png');

    game.load.audio('aha', 'assets/aha.wav');
    game.load.audio('cola', 'assets/cola.wav');
    game.load.audio('entfernen', 'assets/entfernen.wav');
    game.load.audio('fliese1', 'assets/fliese1.wav');
    game.load.audio('fliese2', 'assets/fliese2.wav');
    game.load.audio('focus', 'assets/focus.wav');
    game.load.audio('game_over', 'assets/game_over.wav');
    game.load.audio('success', 'assets/success.wav');
    game.load.audio('woosh', 'assets/woosh.wav');
    game.load.bitmapFont('font', 'assets/carrier_command.png', 'assets/carrier_command.xml');
    game.load.spritesheet("simples_pimplesbla", "assets/simples_pimples.png", 16, 16)

}

//Headlines
var HeadlineMap;
var HeadlineInventory;
var KolaErklaerText;
var LaptopErklaerText;
//The Minimap
var Container;

//Sprite der Haupfigur
var avatar;
//Richtung in die geschaut wird
var view = "down";
//Liste aller verlegten Fliesen
var Allfliesen = new Array();
// Die Größe einer Fliese
var Fliesensize = 32;
// Eine verzögerung für das Klicken
var jumpTimer =0;
//Text der Eigeblendet wird
//var text;
// Text der den Siegestatus ausgibt
var Wintext;
// Fokus Text
var FokusText;
//Fokus wert 
var MaxFokus = 60000;
var Fokus= 60000;
var percentFokus = 100;
var faktorFokus = 1;
var statusFokus = "High";
//This is the Factor you remember the map the 
//less you remeber the less Visible is the map
var Maxremembering = 10000;
var Remembering = Maxremembering;
var faktorRemembering = 1;
//Annother Scoring Factor
var FokusConsumed = 0;
//Ziel wo die Fliese hinkommt
var Fadenkreutz;

var Steplength = 4;
var done;
var score =0;
var possibleScore
//Das Ergebnis zum Abgleichen
var KorrektorFliesen = new Array();
var KorrektorGroup;
//Fugen
var FugenLinesGroup ;
//Fugenbreite in Pixeln
var Fugenbreite =8;
//Start Werte für die Fliesen
var startFliesenFieldx =100;
var startFliesenFieldy = 100;


//This is the Field where the Avatar can move in
var playField ={x1:0,y1:0, x2:600,y2:550};

//Hier werden Felder Hinterlegt auf denen die Farben gewechselt werden.
//Stapel mit Fliesen
var Colorstacks = {};

//Kola Flasche gibt Stamina
var Kola = {"sprite":null,"size":0, "text": null};

//Laptop Zeigt Plan
var Laptop = {"sprite":null,"size":0, "text":null};

//Hier werden die Aufgenommenen Fliesen gespeichert
var Inventory = {};
//Maximale größe Aufgenommene Fliesen
var inventoryNumItems = 0;
var inventorymaxsize= 20;
var inventoryEmpty =true;
var inventorySelector = null;

//Aktuelle Farbe die Verlegt wird
var ContainedColor = "";

// Bezeichnungen zu Farben etc Zuordnen
var ColorMap = {};

//Die Karte
var map;
var layer;

//Status
var Dead = false;
var gameOver=false;

var Door;


var DetailPlaceModeActice =false;
var DetailPlaceModeDirection ="direction";




//Funktion die Erstmal Alles Auf Start bringt
function create() {
    // Hintergrund einfügen
    game.add.sprite(0, 0, 'background');
    
	//Tile map als Übersichtskarte
    Container= game.add.group(); 
    map = game.add.tilemap('Mosaik');
    map.addTilesetImage('simples_pimples', 'simples_pimples');
    layer = map.createLayer('TileLayerFliesen');
    Container.add(layer);
    Container.x = 650
    Container.y = 30
    Container.alpha =1;
    //Überschrift für die karte
    HeadlineMap = game.add.bitmapText(650, 5, 'font','', 14);
    HeadlineMap.text= "Plan";
    KolaErklaerText = game.add.bitmapText(370, 80, 'font','', 8);
    KolaErklaerText.text= "Energie";
    LaptopErklaerText = game.add.bitmapText(530, 80, 'font','', 8);
    LaptopErklaerText.text= "LookUp?";


    for(i=0;i< map.width ;i++){
        for(j =0;j< map.height ;j++){
            var temp = map.getTile(i, j,layer);
            if (temp  &&!ColorMap.hasOwnProperty("Fliese"+temp.index))
                ColorMap["Fliese"+temp.index]=temp.index -1

        }
    }   
    //Die Fliesen für die korrektur erstellen
    initFliesenKorrektor();
    //  This resizes the game world to match the layer dimensions
    //layer.resizeWorld();
    //Existing Colors

    //Initialize the Fliesenstack
    initStack();
    initInventory();
    //Add Avatar


    //avatar.scale.setTo(2, 2);
    Allfliesen = new Array();
    //text = game.add.text(500, 530, '', { fill: '#ffffff' });
    //Score Text Erstellen
    Wintext = game.add.bitmapText(10, 570, 'font','', 16);
    Wintext.text = "havent touched this";
    FokusText = game.add.bitmapText(10, 530, 'font','', 16);
    faktorFokus = Fokus/MaxFokus;
    percentFokus = Math.round(Fokus/MaxFokus*100);
    FokusText.text = "Beharrlichkeit:"+percentFokus;
    avatar = game.add.sprite(game.world.centerX, game.world.centerY, 'avatar');
    avatar.anchor.setTo(0.5, 0.5);
    //Fadenkreutz erstellen
    bmd =createFadenkreutz();
    Fadenkreutz = game.add.sprite(FliesenCoordx(), FliesenCoordy() ,bmd);
    Fadenkreutz.anchor.set(0.5,0.5);
    changeView(view);

    //Tür
    createDoorClosed();

    //Win Funktion prüfen ( anfangs Keine Punkte da)
    win();

    // sounds laden
    ahaSound = this.game.add.audio("aha");
    colaSound = this.game.add.audio("cola");
    entfernenSound = this.game.add.audio("entfernen");
    fliese1Sound = this.game.add.audio("fliese1");
    fliese2Sound = this.game.add.audio("fliese2");
    focusSound = this.game.add.audio("focus");
    game_overSound = this.game.add.audio("game_over");
    successSound = this.game.add.audio("success");
    wooshSound = this.game.add.audio("woosh");

}


//Dies ist die Update Funktion
function update() {
    var nview;
    game.world.bringToTop(avatar);
    if(Dead)
        return;
    if(gameOver)
        return;
    //Hoch runter rechts links etc
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
    	
    	var slenght = steplength();
        nview = "left";
        if(view != nview && !DetailPlaceModeActice){
            view = nview;
            changeView(nview);
        }else{
        	
        	if(inPlayfield(Fadenkreutz.x -slenght,Fadenkreutz.y)){
            	avatar.x -= slenght;
            	Fadenkreutz.x-= slenght;
            	StepStamina();
            	}
            
        }

    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
    	var slenght = steplength();
        nview = "right";
        if(view != nview && !DetailPlaceModeActice){
            view = nview;
            changeView(nview);
        }else{
        	if(inPlayfield(Fadenkreutz.x +slenght,Fadenkreutz.y)){
            	avatar.x += slenght;
            	Fadenkreutz.x += slenght;
            	StepStamina();
        	}
        }
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
		var slenght = steplength();
        nview = "up";
        if(view != nview && !DetailPlaceModeActice){
            view = nview;
            changeView(nview);
        }else{
        	if(inPlayfield(Fadenkreutz.x,Fadenkreutz.y-slenght)){
            	avatar.y -= slenght;
            	Fadenkreutz.y-= slenght;
            	StepStamina();
        	}
        }
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
		var slenght = steplength();
        nview  = "down";
        if(view != nview && !DetailPlaceModeActice){
            view = nview;
            changeView(nview);
        }else{
        	if(inPlayfield(Fadenkreutz.x,Fadenkreutz.y+slenght)){
            	avatar.y += slenght;
            	Fadenkreutz.y += slenght;
            	StepStamina();
            }
        }
    }
    //Fliese mit Space Legen
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)&& game.time.now > jumpTimer){

        //TODO Colliding with Stack ? -> Pickup Fliese

        var colliding = getColliding();
        if(gameOver)
            return;
        if(colliding == null){

            var stackelement = getCollidingStack();

            if(stackelement==null){
            	if(Phaser.Rectangle.intersects(Kola.sprite.getBounds(), Fadenkreutz.getBounds())){
                	RestoreStamina();

            	}else if(Phaser.Rectangle.intersects(Laptop.sprite.getBounds(), Fadenkreutz.getBounds())){
                	RestoreMemory();
                    
                }else if(Phaser.Rectangle.intersects(Door.getBounds(), Fadenkreutz.getBounds())){
                    if(done == "work done") {

                        GameOver("Finished");
                    }
            	}else if(DetailPlaceModeActice){
                    if(newFliese()){
                    
            	       // draw to the canvas context like normal
                	   LayStamina();
                       fliese2Sound.play();
                       if(DetailPlaceModeActice)
                            DetailPlaceModeActice =false;

                    }
                }else{
                    //Dont Focus if Inventory empty
                    if(!inventoryEmpty && checkInventory(ContainedColor))
                        focusSound.play();
                        DetailPlaceModeActice =true;
                    }
                }else{

                //text.text = "Stacktouch" +stackelement ;

                if(removeStack(stackelement))
                	if(!putInventory(stackelement))
						putStack(stackelement);
                	else {
                        fliese1Sound.play();
                        focusSound.stop();
                		TakeStamina();
                    }
            }

        }else{




        }


        jumpTimer = game.time.now + 100;




    }
    //Remove Fliese mit "r"
    if (game.input.keyboard.isDown(82)&& game.time.now > jumpTimer){

        //TODO Colliding with Stack ? -> Leg zurück fliese

        var colliding = getColliding();

        if(colliding == null){
            var stackelement = getCollidingStack()

            if(stackelement!=null){
                    if(removeInventory(ContainedColor)){
                        putStack(ContainedColor);
                        TakeStamina();
                    }
                }
        }else{
        	//Remove Colliding
            if(Allfliesen.length >0 ){
                for( otherFliesen in  Allfliesen){
                    if(Allfliesen[otherFliesen].sprite==colliding){

                        Allfliesen.splice(otherFliesen, 1);
                        RemoveStamina();
                        entfernenSound.play();
                        break;

                    }

                }
            }

            colliding.destroy();

        }


        jumpTimer = game.time.now + 100 ;

    }


    //Change Item Fliese mit "c"
    if (game.input.keyboard.isDown(67)&& game.time.now > jumpTimer){

        changeActiceFliese();
        wooshSound.play();
        jumpTimer = game.time.now + 100;

    }

    //Score errechnen
	win();
	//Update behaarlichkeit
	faktorFokus = Fokus/MaxFokus;
    percentFokus = Math.round(Fokus/MaxFokus*100);
    FokusText.bitmapText = "Beharrlichkeit:"+percentFokus;
    var newStatusFokus="";
    if(percentFokus> 70){
    	newStatusFokus = "High";
    }else if(percentFokus> 40){
		newStatusFokus = "Medium";
    }else{
		newStatusFokus = "Low";
    }
    if(statusFokus!= newStatusFokus){
    	FokusTypeUpdate(newStatusFokus);
    	statusFokus = newStatusFokus
    }

    //Update Remembring
	faktorRemembering =Remembering/ Maxremembering;
	Container.alpha =faktorRemembering;

}


///////////////////////Bewegung Energieverbrauch und so
//Diese Funktionen bestimmen wie sich der Avatar verhält, je nach Kraft die er nicht besitzt

//Überprügen ob der Avatar auf dem Spielfeld ist.
function inPlayfield( newx,newy){
    if(newx < playField.x1|| newx > playField.x2 || newy < playField.y1 || newy > playField.y2)
        return false;
    return true;

}

/////////////Ausdauer Funktionen
//Stamina Verbrauch je Schritt
function StepStamina(){
    var cost = (10+inventoryNumItems);
    Fokus = Fokus -cost;
    FokusConsumed = FokusConsumed + cost;

    if( Remembering - cost < 0 )
        Remembering =0;
    else
        Remembering = Remembering- cost;
    CheckDead();
}
 
 //Stamina Entfernen einer Falsch Gelegten Fliese
function RemoveStamina(){
    var cost = 600;
    Fokus = Fokus -cost;
    FokusConsumed = FokusConsumed + cost;
    if( Remembering - cost < 0 )
        Remembering =0;
    else
        Remembering = Remembering- cost;
    CheckDead();
}
//Stamina Eine Fliese Zu legen
function LayStamina(){
    var cost = 300;
    Fokus = Fokus -cost;
    FokusConsumed = FokusConsumed + cost;
    if( Remembering - cost < 0 )
        Remembering =0;
    else
        Remembering = Remembering- cost;
    CheckDead();
}

//Stamina verbrauch beim Aufheben einer Fliese
function TakeStamina(){
    var cost = 30;
    Fokus = Fokus -cost;
    FokusConsumed = FokusConsumed + cost;
    if( Remembering - cost < 0 )
        Remembering =0;
    else
        Remembering = Remembering- cost;
    CheckDead();
}
//Kola Trinken
function RestoreStamina(){
    if(Kola.size > 0){
        Kola.size--;
        Kola.text.text = Kola.size+"";
        Fokus =  MaxFokus;
        colaSound.play();
    }

}

function CheckDead(){

    if(Fokus < 0 ){
        Dead =true;
        GameOver("Dead");
    }

}


//Sich wieder an die Karte erinnern
function RestoreMemory(){
    Remembering = Maxremembering;
    ahaSound.play();
}

//Schrittlänge je nach Fokus Typ
function FokusTypeUpdate(newFokusType){
    if(newFokusType == "High")

        Steplength=4;
    else if(newFokusType == "Medium")
        Steplength=3;
    else
        Steplength=2;

}
//Schrittlänge
function steplength(){
    if(DetailPlaceModeActice){
        return 1;
    }


    var rnd = Math.random();
    if(statusFokus == "High")
        if( rnd< .9)
            Steplength= 4;
        else
            Steplength= 2;
    else if(statusFokus == "Medium"){
        if(rnd < .7)
            Steplength=3;
        else
            Steplength=2;
    }
    else{
        var rnd = Math.random()
        if( rnd> .5)
            Steplength=2;
        else if( rnd> .2)
            Steplength=1;
        else if( rnd> .1)
            Steplength=0;
        else
            Steplength=-2;

    }
    return Steplength;
    

}


function createDoorClosed(){

        Door = game.add.sprite(450, 10, "simples_pimplesbla", 509);
        Door.scale.setTo(3, 3);

}


//////////////////Fadenkreuz
//Man geht in eine andere Richtung und das Fadenkreuz muss woanders hinzeigen.
function changeView(direction){
    
    Fadenkreutz.destroy();
    
    var bmd =createFadenkreutz();
    Fadenkreutz = game.add.sprite(FliesenCoordx(), FliesenCoordy() ,bmd);
    Fadenkreutz.anchor.set(0.5,0.5);

}

//Fadenkreuz Sprite Zeichnen
function createFadenkreutz(){
	//Stamina Influence
	//Fadenkreutz gets smaller the less stamina is there

	var size = Math.round(Fliesensize*((faktorFokus/2)+0.5));
	var displacement = (Fliesensize-size) /2


    var bmd = game.add.bitmapData(Fliesensize,Fliesensize);
    bmd.ctx.beginPath();
    if(statusFokus == "High"){
    	bmd.ctx.lineWidth="3";
    	bmd.ctx.strokeStyle="blue";
    }else if(statusFokus == "Medium"){
    	bmd.ctx.lineWidth="2";
    	bmd.ctx.strokeStyle="yellow";
    }else{

    	bmd.ctx.lineWidth="1";
    	bmd.ctx.strokeStyle="red";
    }


    bmd.ctx.rect(displacement,displacement,size,size);
    
    bmd.ctx.stroke();
    return bmd;
}

//////////////////Fliesenlegen

//Falls etwas mit dem Fadenkreutz kollidiert wird es hier geholt und zurückgegeben
function getColliding(){


    if(Allfliesen.length >0 ){
        for( otherFliesen in  Allfliesen){
            if(Phaser.Rectangle.intersects(Allfliesen[otherFliesen].sprite.getBounds(), Fadenkreutz.getBounds())){
                return Allfliesen[otherFliesen].sprite;

            }

        }

    }
    return null;

}

//Erstelle eine Neue Fliese beim Fadenkreutz
function newFliese(){
    if(!removeInventory(ContainedColor))
        return false;

    if(ContainedColor.indexOf("Fliese") >=0){

        graphics = game.add.sprite(FliesenCoordx(), FliesenCoordy(), "simples_pimplesbla", ColorMap[ContainedColor])
    	graphics.scale.setTo(2, 2);

    }else{
	    var bmd = game.add.bitmapData(Fliesensize,Fliesensize);
	    bmd.ctx.beginPath();
	    bmd.ctx.rect(0,0,Fliesensize,Fliesensize);
	    bmd.ctx.fillStyle = ColorMap[ContainedColor];
	    bmd.ctx.fill();
	    graphics = game.add.sprite(FliesenCoordx(), FliesenCoordy() ,bmd);

    }
    graphics.anchor.set(0.5,0.5);	    
    graphics.z =10;
    Allfliesen.push({"sprite":graphics, "color":ContainedColor });
	return true;
}
//Initialize the Fliesen Korrektor Array
function initFliesenKorrektor(){
    KorrektorGroup = game.add.group();
    FugenLinesGroup = game.add.group();

    var endFliesenFieldx =startFliesenFieldx+(Fugenbreite+Fliesensize)*(map.height-1) ;
    var endFliesenFieldy = startFliesenFieldy+ (Fugenbreite+Fliesensize)*(map.width-1);

    createFugen(Fugenbreite,startFliesenFieldx,startFliesenFieldy,endFliesenFieldx,endFliesenFieldy)

	for(i=0;i< map.height;i++)
        for(j=0;j< map.width;j++){
        	var index = map.getTile(i,j,layer).index;
            var ftype = "Fliese"+index ;
            newFliesenKorrektor(startFliesenFieldx+(Fugenbreite+Fliesensize)*i, startFliesenFieldy+(Fugenbreite+Fliesensize)*j, Fugenbreite,ftype );
        }


    
    KorrektorGroup.z=9;
    KorrektorGroup.visible =false;
}
function createFugen(Fugenbreite,startx,starty,endx,endy){


    var first = true;
	for(i=0;i< map.height;i++){
        var bmd = game.add.bitmapData((Fugenbreite+Fliesensize)*map.height,Fugenbreite);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,(Fugenbreite+Fliesensize)*map.height,Fugenbreite);
        bmd.ctx.fillStyle = '#333333';
        bmd.ctx.fill();
        graphics = game.add.sprite(startx, starty+(Fugenbreite+Fliesensize)*i  ,bmd);
        FugenLinesGroup.add(graphics);

        for(j=0;j< map.width;j++){

            //text = ftype;

            if(first){

                var bmd = game.add.bitmapData(Fugenbreite,(Fugenbreite+Fliesensize)*map.width);
                bmd.ctx.beginPath();
                bmd.ctx.rect(0,0,Fugenbreite,(Fugenbreite+Fliesensize)*map.width);
                bmd.ctx.fillStyle = '#333333';
                bmd.ctx.fill();
                graphics = game.add.sprite(startx+(Fugenbreite+Fliesensize)*j,  starty ,bmd);
                FugenLinesGroup.add(graphics);
            }
        }
        first =false;

    }

    var bmd = game.add.bitmapData((Fugenbreite+Fliesensize)*map.height,Fugenbreite);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,(Fugenbreite+Fliesensize)*map.height,Fugenbreite);
    bmd.ctx.fillStyle = '#333333';
    bmd.ctx.fill();
    graphics = game.add.sprite(startx, starty+(Fugenbreite+Fliesensize)*map.height  ,bmd);
    FugenLinesGroup.add(graphics);

    bmd = game.add.bitmapData(Fugenbreite,(Fugenbreite+Fliesensize)*map.width +Fugenbreite);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,Fugenbreite,(Fugenbreite+Fliesensize)*map.width +Fugenbreite);
    bmd.ctx.fillStyle = '#333333';
    bmd.ctx.fill();
    graphics = game.add.sprite(startx+(Fugenbreite+Fliesensize)*map.width,  starty ,bmd);
    FugenLinesGroup.add(graphics);

    FugenLinesGroup.z =10;

}


// The Array that is used as the Perfekt positioning for the Fliesen
function newFliesenKorrektor(x,y,Fugenbreite,Ftype ){


    if(Ftype.indexOf("Fliese") >=0){

        graphics = game.add.sprite(x+Fugenbreite, y+Fugenbreite, "simples_pimplesbla", ColorMap[Ftype])
        graphics.scale.setTo(2, 2);

    }else{
        var bmd = game.add.bitmapData(Fliesensize,Fliesensize);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,Fliesensize,Fliesensize);
        bmd.ctx.fillStyle = ColorMap[Ftype];
        bmd.ctx.fill();
        graphics = game.add.sprite(x, y ,bmd);
    }
    //graphics.anchor.set(0.5,0.5);
    KorrektorGroup.add(graphics);
    KorrektorFliesen.push({"sprite":graphics, "color":Ftype });

}


// Fadenkreuzkoordinate X
function FliesenCoordx(){

    if(view == "up"|| view == "down")
        return avatar.x

    if(view == "left")
        return avatar.x - Fliesensize;

    return avatar.x + Fliesensize;
}

// Fadenkreuzkoordinate y
function FliesenCoordy(){

    if(view == "left"|| view == "right")
        return avatar.y

    if(view == "up")
        return avatar.y- Fliesensize;

    return avatar.y + Fliesensize;

}


///////Inventory functions

function initInventory(){
    Lowerx = 650;
    Lowery = 200;
    HeadlineInventory = game.add.bitmapText(Lowerx, Lowery, 'font','', 14);
    HeadlineInventory.text= "Inventar";
    Lowery =Lowery +50
    Lowerx = Lowerx+ 20
    for (Color in ColorMap) {
        if (!ColorMap.hasOwnProperty(Color)) {
            //The current property is not a direct property of p
            continue;
        }
        if(Color.indexOf("Fliese") >=0){
            graphics = game.add.sprite(Lowerx, Lowery, "simples_pimplesbla", ColorMap[Color])
        	graphics.scale.setTo(2, 2);

        }else{


       
            var bmd = game.add.bitmapData(Fliesensize,Fliesensize);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0,0,Fliesensize+10,Fliesensize+10);
            bmd.ctx.fillStyle = ColorMap[Color];
            bmd.ctx.fill();
            graphics = game.add.sprite(Lowerx, Lowery ,bmd);
        }
        graphics.anchor.set(0.5,0.5);
        
        //var style = { font: "13px Courier", fill: "#ffffff", align: "center" };
        var t = game.add.bitmapText(Lowerx+(Fliesensize/2), Lowery, 'font','', 12);
        Inventory[Color]={"sprite":graphics,"size":0, "text":t};
        Lowery += Fliesensize+(Fliesensize/2)
    }

}

function inventorySize(){
	var size =0;
    for (Color in ColorMap) {
        if (!ColorMap.hasOwnProperty(Color)) {
            //The current property is not a direct property of p
            continue;
        }

        size+=Inventory[Color]["size"];

    }
    if(size ==0)
    	inventoryEmpty =true;
    return size;
}


//Put something into the Invetory if Possible 
function putInventory(type){

	if(inventorymaxsize >inventorySize()){

    	if(Inventory.hasOwnProperty(type))
    	    Inventory[type]["size"]++;
    	else
    	    Inventory[type]["size"] =1;

    	Inventory[type]["text"].setText(Inventory[type]["size"]  +"")
    	if(inventoryEmpty ==true){
			ContainedColor = type;
			displayActiveFliese(type);
			inventoryEmpty=false;
    	}
    	inventoryNumItems++;
		return true;
	}else
		return false;
}


//Check if something exists in the Inventory
function checkInventory(type){

    if(Inventory.hasOwnProperty(type) && Inventory[type]["size"]>0)
        return true;
    else
        return false;


}

//Remove a thing from the Inventory if successfull returns true
function removeInventory(type){
    if(Inventory.hasOwnProperty(type) && Inventory[type]["size"]>0 ){
        Inventory[type]["size"]--;
        Inventory[type]["text"].setText(Inventory[type]["size"]  +"")
        if(Inventory[type]["size"] ==0)
        	inventorySize();
        inventoryNumItems++;
        return true;
    }
    return false;

}
//Switches the Active Inventory Item
function changeActiceFliese(){

        var ConC = ContainedColor
        var visited = false;

        for( fliesentype in Inventory){

        	if (!ColorMap.hasOwnProperty(Color)) {
                //The current property is not a direct property of p
                continue;
            }
        	if(visited){

				if(checkInventory(fliesentype)){
					ContainedColor = fliesentype;
					break;
				}
			}
        	if(fliesentype == ContainedColor)
        		visited = true;
        	



            
        }
        if(ConC != ContainedColor){
        	displayActiveFliese(ContainedColor);
        	//text.text = ContainedColor ;
        	return;
        }

       	for( fliesentype in Inventory){

        	if (!ColorMap.hasOwnProperty(Color)) {
                //The current property is not a direct property of p
                continue;
            }
        	
        	if(fliesentype == ContainedColor)
        		continue;
        	
			if(checkInventory(fliesentype)){
					ContainedColor = fliesentype
					break;
				}
        }

        var addition ="";
        if(ConC == ContainedColor){
        	addition ="nothing changed";
        }else
        	displayActiveFliese(ContainedColor);
        //text.text = ContainedColor+addition ;

}

function displayActiveFliese(type){

	for( fliesentype in Inventory){
		if(fliesentype == type){
			var toFrame = Inventory[type]["sprite"];
			if(inventorySelector != null)
				inventorySelector.destroy();

			var bmd = game.add.bitmapData(Fliesensize+2,Fliesensize+2);
    		bmd.ctx.beginPath();
    		bmd.ctx.lineWidth="5";
    		bmd.ctx.strokeStyle="blue";
    		bmd.ctx.rect(0,0,Fliesensize+2,Fliesensize+2);
    		bmd.ctx.stroke();

    		inventorySelector = game.add.sprite(toFrame.x, toFrame.y ,bmd);
    		inventorySelector.anchor.set(0.5,0.5);

		}

	}

}







///////////Stack Functions
function initStack(){
    Lowerx = Fliesensize/2 +Fliesensize
    Lowery = Fliesensize
    //All Stacks For the Differend Fliesen
    for (Color in ColorMap) {
        if (!ColorMap.hasOwnProperty(Color)) {
            //The current property is not a direct property of p
            continue;
        }
        if(Color.indexOf("Fliese") >=0){
            graphics = game.add.sprite(Lowerx, Lowery, "simples_pimplesbla", ColorMap[Color])
        	graphics.scale.setTo(2, 2);

        }else{


       
            var bmd = game.add.bitmapData(Fliesensize,Fliesensize);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0,0,Fliesensize+10,Fliesensize+10);
            bmd.ctx.fillStyle = ColorMap[Color];
            bmd.ctx.fill();
            graphics = game.add.sprite(Lowerx, Lowery ,bmd);
        }
        graphics.anchor.set(0.5,0.5);
        
       // var style = { font: "13px Courier", fill: "#ffffff", align: "center" };
        var t = game.add.bitmapText(Lowerx-20, 3, 'font','', 10);

        Colorstacks[Color]={"sprite":graphics,"size":0, "text":t};
        Lowerx += Fliesensize+(Fliesensize/2)
    }
    //Initialize the Numer of Fliesen on the Stack
    for (Color in ColorMap) {
        if (!ColorMap.hasOwnProperty(Color)) {
            //The current property is not a direct property of p
            continue;
        }
        for(var i =0;i< 100;i++)
            putStack(Color);
    }
    //Special Items:

    //Cola -> Fokus

	var style = { font: "13px Courier", fill: "#ffffff", align: "center" };
    Kola.sprite = game.add.sprite(Lowerx+25, Lowery, "Kola")
    Kola.sprite.scale.setTo(0.2, 0.2);
    Kola.sprite.anchor.set(0.5,0.5);


    Kola.text = game.add.bitmapText(403, 60, 'font','', 12);
	Kola.size = 6;
	Kola.text.text = Kola.size;
	Lowerx+=40;

    Laptop.sprite= game.add.sprite(Lowerx+130, Lowery, "LPTP")
    
    Laptop.sprite.scale.setTo(0.2, 0.2);
    Laptop.sprite.anchor.set(0.5,0.5);

}
// 
function putStack(type){

    if(Colorstacks.hasOwnProperty(type))
        Colorstacks[type]["size"]++;
    else
        Colorstacks[type]["size"] =1;
    //Set Stack Text
    Colorstacks[type]["text"].setText(Colorstacks[type]["size"]  +"")

}


// 
function removeStack(type){
    if(Colorstacks.hasOwnProperty(type) && Colorstacks[type]["size"]>0 ){
        Colorstacks[type]["size"]--;
        //Set Stack Text
        Colorstacks[type]["text"].setText(Colorstacks[type]["size"]  +"")
        return true;
    }
    return false;

}


//Falls etwas von den Stacks mit dem Fadenkreutz kollidiert wird es hier geholt und zurückgegeben
function getCollidingStack(){



    for( otherFliesen in  Colorstacks){
        if(Phaser.Rectangle.intersects(Colorstacks[otherFliesen].sprite.getBounds(), Fadenkreutz.getBounds())){
            return otherFliesen;

        }

    }

    return null;

}


/////////////////////////Function WINWINWIN


function win(){
    score =0;
    possibleScore = KorrektorFliesen.length*10;
    var completedFliesen = 0;
    //Wintext.text = String(Allfliesen) ;
    for(i in Allfliesen){
        var a = Allfliesen[i];
        //Wintext.text = a;
        for(j in KorrektorFliesen){
            var b = KorrektorFliesen[j];
            if(a["color"] == b["color"] ){
                var temp =  a["sprite"].getBounds().x +" "+a["sprite"].getBounds().y+ " .. "+b["sprite"].getBounds().x +" "+b["sprite"].getBounds().y;
                //text.text = temp;
                //Wintext.text = a ;
                if(Phaser.Rectangle.intersects(a["sprite"].getBounds() ,b["sprite"].getBounds())){

                    if( a["sprite"].getBounds().x ==  +b["sprite"].getBounds().x &&a["sprite"].getBounds().y == b["sprite"].getBounds().y)
                    	score+=10;
                    else if( a["sprite"].getBounds().x ==  +b["sprite"].getBounds().x ||a["sprite"].getBounds().y == b["sprite"].getBounds().y)
                    	score+=5;
                    else
                    	score+=1;
                    
                    completedFliesen+=1;
                    }
                   
            }

        }
        
    }
    done ="";
    if(completedFliesen >= KorrektorFliesen.length)
    	done = "work done";

    Wintext.text =  "score: "+score+"/"+possibleScore+" " +done;

}

function GameOver(Status){
    temp = game.add.bitmapText(100, 300, 'font','', 16);

    if(Status == "Finished")
        temp.text =  "Feierabend: "+score+"/"+possibleScore;
        successSound.play();
    if(Status == "Dead")
        temp.text =  "Puh genug für Heute";
        game_overSound.play();
    gameOver =true;
}


function render() {
    //game.debug.spriteInfo(avatar, 20, 32);

}