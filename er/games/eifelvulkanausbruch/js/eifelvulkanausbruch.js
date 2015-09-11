var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ausbruch', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('background', 'assets/background.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('platform1', 'assets/platform1.png');
    game.load.image('platform2', 'assets/platform2.png');
    game.load.image('platform3', 'assets/platform3.png');
    game.load.image('platform4', 'assets/platform4.png');
    game.load.image('lavaWave', 'assets/lava.png');
    game.load.image('item_dvd', 'assets/CDverysmall.png');
    game.load.image('item_dat', 'assets/DATCasetteSmall.png');
    game.load.image('item_harddisk', 'assets/harddisk.png');
    game.load.image('item_cola', 'assets/Coke.png');
    game.load.image('dhl', 'assets/dhl.png');
    game.load.image('fireball1', 'assets/fireball.png');
    game.load.image('fireball2', 'assets/fireball2.png');
    game.load.image('fireball3', 'assets/fireball3.png');
    game.load.image('button1', 'assets/button1.png');
    game.load.image('button2', 'assets/button2.png');
    game.load.spritesheet('player', 'assets/dude.png', 32, 48);
    game.load.bitmapFont('font', 'assets/carrier_command.png', 'assets/carrier_command.xml');

    game.load.audio('collect1', 'assets/collect1.wav');
    game.load.audio('collect2', 'assets/collect2.wav');
    game.load.audio('collect3', 'assets/collect3.wav');
    game.load.audio('success', 'assets/success.wav');
    game.load.audio('game_over', 'assets/game_over.wav');
    game.load.audio('car', 'assets/car.wav');
    game.load.audio('cola_boost', 'assets/cola_boost.wav');
    game.load.audio('jump', 'assets/jump.wav');
    game.load.audio('lava', 'assets/lava.wav');
    game.load.audio('ouuch', 'assets/ouuch.wav');
    game.load.audio('uh', 'assets/uh.wav');
    game.load.audio('horn', 'assets/horn.wav');
}

// --- Gruppen ---
var grounds;            // Der Boden
var platforms;          // Undurchlässige Plattformen
var lava;               // Lava
var hazards;            // Gefährliche Objekte (DHL-Wagen, Lavabrocken)
var inactiveHazards;    // Ehemals gefährliche Objekte
var items;              // Einsammelbare Items
var inactiveItems;      // Eingesammelte Items

// Der Lava-Sound
var lava_sound;

// Gibt an, ob der Sound der Lavawelle gerade ausgefadet wird
var lavaSoundFadeOut = false;

// Das Spieler-Objekt
var player;

// Der Boden
var ground;

// Die Lavawelle
var lavaWave;

// Cursors-Objekt für die Abfrage der Pfeiltasten
var cursors;

// Menge der geretteten Daten
var score = 0.0;
var scoreText;

// Anzahl der Millisekunden, bis neue Objekte am rechten Bildschirmrand eingefügt werden
var actionTimer = 500;

// Anzahl der Millisekunden, bis ein neuer Feuerball über den Bildschirm fliegt
var fireballTimer = 100;

// Anzahl der Millisekunden, bis eine neue Plattform erscheinen kann
var platformTimer = 0;

// Wenn größer 0, kann der Spieler gerade nicht laufen
var stunnedTimer = 0;

// Wenn größer 0, läuft der Spieler gerade schneller
var boostTimer = 0;

// Zeit, bis das Spiel zurückgesetzt wird (nach Sieg oder Niederlage)
var resetTimer = 0;

// Timer für den blinkenden Text am Ende
var blinkTextTimer = 0;

// Zeit, bis die Lavawelle sich in die andere Richtung bewegt
var lavaTimer = 100;

// Gibt an, ob sich die Lavawelle gerade nach unten bewegt
var lavaDown = true

// Game-Over-Text
var gameOverText;

// Text mit Siegesnachricht
var victoryText;

// Anzahl der aktuell sichtbaren Colaflaschen
var colasOnScreen = 0;

// Die Buttons nach Spielende
var button1;
var button2;

// Gibt an, ob das Spiel gewonnen wurde
var victory = false;

// Die Bewegungsgeschwindigkeit der Lavawelle
var lavaSpeed = 120;


function create() {

    // Größe des Levels setzen
    game.world.resize(11300, 600);

    // Arcade-Physik aktivieren
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Hintergrund einfügen
    game.add.sprite(0, 0, 'background');

    // Objekt-Gruppen anlegen
    createObjectGroups();
    
    // Cursors-Objekt für die spätere Abfrage der Pfeiltasten anlegen
    cursors = game.input.keyboard.createCursorKeys();

    // Spieler-Figur anlegen und Einstellungen vornehmen
    createPlayer();

    // Lavawelle erzeugen
    createLava();

    // Boden erzeugen
    createGround();

    // Score-Text anlegen
    scoreText = game.add.bitmapText(16, 16, 'font','', 24);
    scoreText.fixedToCamera = true;
    updateScoreText();

    // Lava-Sound abspielen
    lava_sound = game.add.audio('lava', 5, true);
    lava_sound.play();
}

function restart() {

    // Wegen Problemen mit player-rotation:
    location.reload();

    /*
    victory = false;

    score = 0.0;
    updateScoreText();

    actionTimer = 500;
    fireballTimer = 100;
    platformTimer = 0;
    stunnedTimer = 0;
    boostTimer = 0;
    resetTimer = 0;

    colasOnScreen = 0;

    platforms.removeAll(true);
    hazards.removeAll(true);
    inactiveHazards.removeAll(true);
    items.removeAll(true);

    game.tweens.removeAll();

    // Boden neu einfügen
    var ground = grounds.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true;

    game.time.events.removeAll();

    lavaWave.x = -75;
    lavaWave.y = 86;

    player.x = 500;
    player.y = game.world.height - 400;
    player.body.gravity.y = 4000;
    player.body.rotation = 0;

    player.tint = 0xffffff;
    player.animations.play('right');

    game.camera.x = 0;
    game.camera.y = 0;

    if (victoryText) {
        victoryText.destroy();
        button1.destroy();
        button2.destroy();
    }
    if (gameOverText) {
        gameOverText.destroy();
        button1.destroy();
        button2.destroy();
    }
    */
}

// Boden erzeugen
function createGround() {

    // Gruppe für undurchlässige Plattformen anlegen, auf denen man laufen kann (inkl. Boden)
    grounds = game.add.group();
    grounds.enableBody = true;

    // Boden einfügen
    ground = grounds.create(0, game.world.height - 64, 'ground');
    ground.body.immovable = true;
}

// Spieler-Figur anlegen und Einstellungen vornehmen
function createPlayer() {

     // Spieler einfügen
    player = game.add.sprite(500, game.world.height - 90, 'player');
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);

    // Spieler-Physik konfigurieren
    player.body.bounce.y = 0;
    player.body.gravity.y = 4000;

    // Spieler-Laufanimationen anlegen
    player.animations.add('left', [0, 1, 2], 10, true);
    player.animations.add('center', [3, 4, 5], 10, true);
    player.animations.add('right', [6, 7, 8], 10, true);    
}

// Lavawelle erzeugen
function createLava() {

    // Gruppe für Lavawelle anlegen
    lava = game.add.group();

    // Lavawelle einfügen
    lavaWave = lava.create(-75, 86, 'lavaWave');
}

// Gruppen für die verschiedenen Objekt-Typen anlegen
function createObjectGroups() {

    // Gruppe für Plattformen anlegen
    platforms = game.add.group();
    platforms.enableBody = true;

    // Gruppe für einsammelbare Datenträger anlegen
    items = game.add.group();
    items.enableBody = true;

    // Gruppe für gefährliche Objekte anlegen
    hazards = game.add.group();
    hazards.enableBody = true;

    // Gruppe für ehemals gefährliche Objekte anlegen, die jetzt nicht mehr gefährlich sind
    inactiveHazards = game.add.group();
    inactiveHazards.enableBody = true;

    // Gruppe für eingesammelte Items
    inactiveItems = game.add.group();
    inactiveItems.enableBody = false;
}

function update() {
    
    // Auf Kollisionen prüfen
    checkCollisions();

    // Lavawelle bewegen
    moveLavaWave();

    // Evtl. Text blinken lassen
    if (victory && blinkTextTimer > 0) {
        blinkTextTimer -= game.time.physicsElapsedMS;
        if (blinkTextTimer <= 0) {
            if (victoryText.tint == 0x000000) {
                victoryText.tint = 0xffffff;
                scoreText.tint = 0x000000;
            }
            else {
                victoryText.tint = 0x000000;
                scoreText.tint = 0xffffff
            }
            blinkTextTimer = 500;
        }
    }

    if (resetTimer == 0 || victory) {
        // Spielerfigur bewegen
        movePlayer();
    }

    if (resetTimer == 0) {
        // Auf Sieg prüfen
        checkForVictory();

        // Auf Game Over prüfen
        checkForGameOver();
    }

    // Kamera voranbewegen
    game.camera.x += lavaSpeed * game.time.physicsElapsed;

    if (resetTimer > 0) {
        resetTimer -= game.time.physicsElapsedMS;
        if (resetTimer <= 0) {
            restart();
        }
        return;
    }

    if (player.x < 10000) {

        // Prüfen, ob neue Objekte am rechten Rand eingefügt werden sollen
        actionTimer -= game.time.physicsElapsedMS;
        if (actionTimer <= 0) {
            insertNewObject();
            actionTimer = game.rnd.between(500, 2000);
        }

        // Prüfen, ob ein neuer Feuerball geworfen werden soll
        fireballTimer -= game.time.physicsElapsedMS;
        if (fireballTimer <= 0) {
            throwFireball();
            if (player.x < 3000)
                fireballTimer = game.rnd.between(1000, 3000);
            else if (player.x < 5000)
                fireballTimer = game.rnd.between(700, 2000);
            else if (player.x < 7500)
                fireballTimer = game.rnd.between(400, 1500);
            else
                fireballTimer = game.rnd.between(300, 1000);
        }

        // Prüfen, ob wieder Plattformen erscheinen dürfen
        if (platformTimer > 0) {
            platformTimer -= game.time.physicsElapsedMS;
            if (platformTimer <= 0)
                platformTimer = 0
        }
    }
}

// Prüft, ob Kollisionen vorliegen
function checkCollisions() {

    // Kollisionsverhalten der Objekte festlegen
    if (resetTimer == 0 || victory) {
        game.physics.arcade.collide(player, grounds, null, checkForPlatformCollision, this);
        game.physics.arcade.collide(player, platforms, null, checkForPlatformCollision, this);
        game.physics.arcade.collide(player, hazards, checkForHazardousContact, null, this);
        game.physics.arcade.overlap(player, items, collectItem, null, this);
    }
    
    game.physics.arcade.collide(items, grounds);
    game.physics.arcade.collide(items, platforms);
}

// Prüft, ob sich der Spieler am rechten Ende des Levels befindet und daher gewonnen hat
function checkForVictory() {

    if (game.camera.x >= 10500 && player.x > 10905) {
    //if (player.x > 109) { // test

        victory = true;
        resetTimer = -1;

        button1 = game.add.sprite(game.camera.view.x + 280, 230, 'button1');
        button1.inputEnabled = true;
        button1.input.useHandCursor = true;
        button1.events.onInputDown.add(changePage, this);

        button2 = game.add.sprite(game.camera.view.x + 280, 330, 'button2');
        button2.inputEnabled = true;
        button2.input.useHandCursor = true;
        button2.events.onInputDown.add(restart, this);

        victoryText = game.add.bitmapText(130, 150, 'font','GESCHAFFT!', 48);
        victoryText.fixedToCamera = true;

        scoreText.tint = 0xffffff;

        blinkTextTimer = 500;

        game.sound.play('success');
    }
}

// Prüft, ob sich der Spieler zu weit links befindet und daher verloren hat
function checkForGameOver() {

    if ((player.y >= game.world.height - 120 && player.x < lavaWave.x + lavaWave.width * 0.5) ||
        (player.y < game.world.height - 120 && player.y >= game.world.height - 300 && player.x < lavaWave.x + lavaWave.width * 0.6) ||
        (player.y < game.world.height - 300 && player.y >= game.world.height - 350 && player.x < lavaWave.x + lavaWave.width * 0.7) ||
        (player.y < game.world.height - 350 && player.x < lavaWave.x + lavaWave.width))
    {
        victory = false;
        resetTimer = -1;

        player.body.gravity.y = 0;
        player.body.velocity.y = -100;
        player.body.velocity.x = 400;

        changeColor(player, 0xffffff, 0xff0000, 500);
        game.add.tween(player.body).to( { rotation: 7200 }, 5000, 'Linear', true);

        gameOverText = game.add.bitmapText(210, 150, 'font','SCHADE!', 48);
        gameOverText.fixedToCamera = true;
        gameOverText.tint = 0xffffff;

        button1 = game.add.sprite(270, 250, 'button1');
        button1.inputEnabled = true;
        button1.input.useHandCursor = true;
        button1.events.onInputDown.add(changePage, this);
        button1.fixedToCamera = true;

        button2 = game.add.sprite(270, 350, 'button2');
        button2.inputEnabled = true;
        button2.input.useHandCursor = true;
        button2.events.onInputDown.add(restart, this);
        button2.fixedToCamera = true;

        game.sound.play('ouuch', 1.5);
        game.time.events.add(500, playSoundGameOver, this);
    }
}

function moveLavaWave() {

    if (lavaTimer > 0) {
        lavaTimer -= game.time.physicsElapsedMS;
        if (lavaTimer <= 0) {
            lavaDown = !lavaDown;
            lavaTimer = game.rnd.between(300, 700);
        }
        if (game.camera.x > 9330) {
            lavaWave.y += 70 * game.time.physicsElapsed
            if (!lavaSoundFadeOut) {
                game.add.tween(lava_sound).to( { volume: 0 }, 7000, 'Linear', true);
                lavaSoundFadeOut = true;
            }
        }
        else {
            if (lavaDown && lavaWave.y <= 110)
                lavaWave.y += 20 * game.time.physicsElapsed;
            else if (lavaWave.y >= 86)
                lavaWave.y -= 20 * game.time.physicsElapsed;
        }
        if (game.camera.x <= 9330)
            lavaWave.x += lavaSpeed * game.time.physicsElapsed;
        else if (game.camera.x < 10000)
            lavaWave.x += (lavaSpeed * 0.4) * game.time.physicsElapsed;
    }
}

function movePlayer() {

    // Spieler kann nicht laufen, wenn er gerade durch die Luft geschleudert wird
    if (stunnedTimer > 0) {
        stunnedTimer -= game.time.physicsElapsedMS;
        if (stunnedTimer <= 0) {
            stunnedTimer = 0;
            player.body.gravity.y = 4000;
        }
        return;
    }

    // Laufgeschwindigkeit ermitteln
    var speed = lavaSpeed;    
    if (boostTimer > 0) {
        speed = 270;
        boostTimer -= game.time.physicsElapsedMS;
        if (boostTimer < 0)
            boostTimer = 0;
    }

    // Aktuelle Laufgeschwindigkeit setzen
    player.body.velocity.x = speed;

    // Pfeiltasten abfragen und Spielerfigur entsprechend bewegen
    if (player.x > 10905) {
        player.body.velocity.x = 0;
        player.animations.play('center');
    }
    else if (!victory && cursors.left.isDown) {
        player.body.velocity.x = -speed;
        player.animations.play('left');
    } else if (player.body.touching.down || victory)
        player.animations.play('right');
    else
        player.animations.stop();

    if (player.x + player.width > game.camera.view.x + game.camera.view.width && !victory)
        player.x = game.camera.view.x + game.camera.view.width - player.width;
    else if (player.x < game.camera.view.x)
        player.x = game.camera.view.x;

    // Evtl. springen
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -1400;
        game.sound.play('jump', 2);
    }
}

// Zufälliges neues Objekt bzw. Gruppe von neuen Objekten am rechten Rand einfügen
function insertNewObject() {

    var objectType = game.rnd.between(0, 5);

    switch (objectType) {
        case 0:
        case 1:
        case 2:
            // DHL-Wagen erzeugen
            var dhl = hazards.create(game.camera.view.x + game.camera.view.width + 100, game.world.height - 120, 'dhl');
            dhl.moveDown();
            dhl.body.velocity.x = game.rnd.between(-350, -150);
            dhl.body.immovable = true;
            dhl.hazardType = 'dhl';
            var loop = game.time.events.loop(game.rnd.between(500, 900), dropDataItem, this, dhl);
            game.time.events.add(1600, stopLoop, this, loop);
            game.time.events.add(7000, destroyObject, this, dhl);
            game.sound.play('car', 0.5);
            break;
        case 3:
        case 4:
            if (platformTimer == 0 && player.x < 9000) {
                // Gerüst erzeugen
                var typeId = game.rnd.between(1, 4);
                var platformIcon = "platform" + typeId;
                var platform = platforms.create(game.camera.view.x + game.camera.view.width + 100, game.rnd.between(250, 400), platformIcon);                
                platform.body.immovable = true;
                game.time.events.add(35000, destroyObject, this, platform);
                platformTimer = 5000;
                if (typeId == 2)
                    platformTimer += 5000;
                else if (typeId == 3)
                    platformTimer += 3000;
                else if (typeId == 4)
                    platformTimer += 1000;
                insertPlatformItems(platform);
            }
            break;
    }    
}

// Setzt Items auf eine Plattform
function insertPlatformItems(platform) {

    var itemPositions = Math.floor(platform.width / 100);

    for (var i = 1; i < itemPositions; i++) {
        var itemType = game.rnd.between(0, 20);

        switch (itemType) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 17:
            case 18:
            case 19:
                // Cola-Flasche erzeugen
                if (player.x > 1200 && colasOnScreen < 2) {
                    insertItem('cola', platform.x + i * 100 + game.rnd.between(-20, 20), platform.y - 45);
                    colasOnScreen += 1;
                }
                break;
            case 4:
            case 5:
                // Zwei DAT-Kassetten erzeugen
                var xPos = platform.x + i * 100 + game.rnd.between(-20, 20)
                insertItem('dat', xPos - 12, platform.y - 24);
                insertItem('dat', xPos + 19, platform.y - 24);
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                // DVD erzeugen
                insertItem('dvd', platform.x + i * 100 + game.rnd.between(-20, 20), platform.y - 30);
                break;
            case 12:
            case 13:
            case 14:
            case 15:
                // DAT-Kassette erzeugen
                insertItem('dat', platform.x + i * 100 + game.rnd.between(-20, 20), platform.y - 24);
                break;
            case 16:
                // Festplatte erzeugen
                insertItem('harddisk', platform.x + i * 100 + game.rnd.between(-20, 20), platform.y - 39);
                break;
        }
    }
}

// Fügt einen Feuerball ein, der von oben über das Spielfeld fliegt
function throwFireball() {

    var iconName = "fireball" + game.rnd.between(1, 3);
    var fireball = hazards.create(game.camera.view.x + game.rnd.between(-90, 500), -100, iconName);
    fireball.moveDown();
    fireball.body.velocity.x = 300;
    fireball.body.velocity.y = 300;
    fireball.anchor.setTo(0.5, 0.5);
    fireball.hazardType = 'fireball';
    game.time.events.add(7000, destroyObject, this, fireball);
    //game.add.tween(fireball.body).to( { rotation: 3600 }, 7000, 'Linear', true);
}

// Fügt ein neues Item an die angegebene Position ein
function insertItem(itemType, xPos, yPos) {

    var spriteName;
    var scoreValue;
    var boost;

    switch (itemType) {
        case 'cola':
            spriteName = 'item_cola';
            scoreValue = 0;
            boost = true;
        break;
        case 'dvd':
            spriteName = 'item_dvd';
            scoreValue = game.rnd.realInRange(0.008, 0.017);
            boost = false;
        break;
        case 'dat':
            spriteName = 'item_dat';
            scoreValue = scoreValue = game.rnd.realInRange(0.10, 0.16);
            boost = false;
        break;
        case 'harddisk':
            spriteName = 'item_harddisk';
            scoreValue = scoreValue = game.rnd.realInRange(0.3, 0.5);
            boost = false;
        break;
    }

    var item = items.create(xPos, yPos, spriteName);
    item.moveDown();
    item.moveDown();
    item.body.gravity.y = 200;
    item.body.bounce.y = 0.5;
    item.scoreValue = scoreValue;
    item.boost = boost;
    game.time.events.add(30000, destroyObject, this, item);
}

function collectItem(player, item) {

    if ((item.scoreValue == 0 && !item.boost) || !player.body.touching.down)
        return;

    // Sound abspielen
    if (item.boost) {
        game.sound.play('cola_boost', 2);
    } else if (item.scoreValue < 0.1)
        game.sound.play('collect1');
    else if (item.scoreValue < 0.3)
        game.sound.play('collect2');
    else
        game.sound.play('collect3', 2);

    // Score um den Datenwert des Items erhöhen
    score += item.scoreValue;
    item.scoreValue = 0;
    updateScoreText();

    // Prüfen, ob der Boost aktiviert werden soll
    if (item.boost) {
        boostTimer = 700;
        item.boost = false;
        colasOnScreen -= 1;
    }

    // Item nach Einsammel-Bewegung entfernen
    items.remove(item);
    inactiveItems.add(item);
    var collectItemTween = game.add.tween(item).to( { y: 0, x: item.x + 20, alpha: 0 }, 700, 'Linear', true);
    collectItemTween.onComplete.add( function(item) { item.kill(); });    
}

function checkForHazardousContact(player, hazard) {

    // Prüfen, ob die Kollision von der Seite stattfindet
    if (player.body.y + player.body.height > hazard.body.y) {
        
        // Gefahr deaktivieren, damit keine erneute Kollision stattfinden kann
        hazards.remove(hazard);
        inactiveHazards.add(hazard);

        // Spieler durch die Luft schleudern und dabei näher an den linken Rand heranrücken
        if (hazard.hazardType == 'dhl') {
            player.body.gravity.y = 4000;
            player.body.velocity.y = -1500;
            player.body.velocity.x = 0;
            game.add.tween(player.body).to( { rotation: 360 }, 700, 'Linear', true);
            if (stunnedTimer < 700)
                stunnedTimer = 700;

            // DHL-Wagen beschleunigen, damit sich die Sprites von Spielerfigur und DHL-Wagen beim Landen des Spielers nicht erneut überlappen
            hazard.body.velocity.x -= 300;

            game.sound.play('horn', 1.5);
            game.time.events.add(50, playSoundUh, this);
        } else if (hazard.hazardType == 'fireball') {
            player.body.gravity.y = 0;
            player.body.velocity.y = 0;
            player.body.velocity.x = 0;
            game.add.tween(player.body).to( { rotation: 720 }, 500, 'Linear', true);
            if (stunnedTimer < 500)
                stunnedTimer = 500;

            hazard.body.velocity.x = 500;
            hazard.body.velocity.y = 500;
            game.sound.play('uh', 2);
        }        
    }
}

// Spielt den Uh-Sound ab (zum zeitversetzten Abspielen von Sounds)
function playSoundUh() {
    game.sound.play('uh', 2);
}

// Spielt den Game-over-Sound ab (zum zeitversetzten Abspielen von Sounds)
function playSoundGameOver() {
    game.sound.play('game_over');
}

// Prüft, ob der Spieler mit einer Plattform kollidiert oder (wenn er von unten hoch springt) nicht
function checkForPlatformCollision(player, platform) {

    if (player.body.y > platform.body.y)
        return false;
    else
        return true;
}

function dropDataItem(dhl) {
    var itemType = game.rnd.between(0, 7);

    switch (itemType) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            // DVD erzeugen
            insertItem('dvd', dhl.x + dhl.width - 30, dhl.y + (dhl.height / 5));
            break;
        case 5:
        case 6:
            // DAT-Kassette erzeugen
            insertItem('dat', dhl.x + dhl.width - 30, dhl.y + (dhl.height / 5));
            break;
        case 7:
            // Festplatte erzeugen
            insertItem('harddisk', dhl.x + dhl.width - 30, dhl.y + (dhl.height / 5));
            break;
    }
}

function destroyObject(object) {
    if (player.x < 10700)
        object.destroy();
}

function stopLoop(loop) {

    game.time.events.remove(loop);
}

function updateScoreText() {
 
    scoreText.text = 'Gesicherte Daten: ' + score.toFixed(3).replace('.', ',') + ' TB';
}

function changeColor(object, startColor, endColor, time) {

    var colorBlend = {step: 0};
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);
    
    colorTween.onUpdateCallback(function() {
      object.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);   
    });
    
    object.tint = startColor;    
    colorTween.start();
}

function changePage() {
    window.location.href = "../../schwardmann.htm";
}