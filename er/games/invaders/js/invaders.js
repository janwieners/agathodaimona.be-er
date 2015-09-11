var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var button1;
var button2;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });


function preload() {

    game.load.image('bullet', 'invaders/bullet.png');
    game.load.image('enemyBullet', 'invaders/enemy-bullet.png');
    game.load.spritesheet('invader', 'invaders/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'invaders/player-thaller.png');
    game.load.spritesheet('kaboom', 'invaders/explode.png', 128, 128);
    game.load.image('starfield', 'invaders/starfield.png');
    game.load.image('button1', 'invaders/button1.png');
    game.load.image('button2', 'invaders/button2.png');
    game.load.bitmapFont('font', 'invaders/carrier_command.png', 'invaders/carrier_command.xml');

    game.load.audio('laser1', 'invaders/laser1.wav');
    game.load.audio('laser2', 'invaders/laser2.wav');
    game.load.audio('crash', 'invaders/crash.wav');
    game.load.audio('success', 'invaders/success.wav');
    game.load.audio('game_over', 'invaders/game_over.wav');
    game.load.audio('uh', 'invaders/uh.wav');
    game.load.audio('ouuch', 'invaders/ouuch.wav');
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    player = game.add.sprite(400, 500, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();

    //  The score
    scoreString = 'Punkte: ';
    scoreText = game.add.bitmapText(16, 16, 'font', scoreString + score, 24);

    //  Lives
    lives = game.add.group();
    game.add.bitmapText(game.world.width - 150, 10, 'font', 'Leben', 24);

    //  Text
    stateText = game.add.bitmapText(game.world.centerX, game.world.centerY - 100, 'font', '', 24);
    stateText.anchor.setTo(0.5, 0.5);
    stateText.align = 'center';
    stateText.visible = false;

    for (var i = 0; i < 3; i++)
    {
        var ship = lives.create(game.world.width - 130 + (50 * i), 80, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.7;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += 10;
}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton.isDown)
        {
            fireBullet();
        }

        if (game.time.now > firingTimer)
        {
            enemyFires();
        }

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }

}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);
    game.sound.play('crash');

    if (aliens.countLiving() === 0)
    {
        game.sound.play('success');

        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = "Du hast die Erde vor\n\nkleio bewahrt!\n\n\nDankeschoen!";
        stateText.visible = true;

        button1 = game.add.sprite(280, 350, 'button1');
        button1.inputEnabled = true;
        button1.input.useHandCursor = true;
        button1.events.onInputDown.add(changePage, this);
    }

}

function enemyHitsPlayer (player,bullet) {

    if (livingEnemies.length == 0)
        return;

    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    score -= 200;
    if (score < 0)
        score = 0;
    scoreText.text = scoreString + score;

    // When the player dies
    if (lives.countLiving() < 1)
    {
        game.sound.play('ouuch', 1.5);
        game.sound.play('crash');
        game.time.events.add(500, playSoundGameOver, this);
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text="GAME OVER\n\nDie Erde ist Geschichte!";
        stateText.visible = true;

        button1 = game.add.sprite(280, 350, 'button2');
        button1.inputEnabled = true;
        button1.input.useHandCursor = true;
        button1.events.onInputDown.add(restart, this);
    } else {
        game.sound.play('uh', 2);
        game.sound.play('crash');
    }
}

function playSoundGameOver() {
    game.sound.play('game_over');
}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {

        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x + shooter.body.width / 2, shooter.body.y + shooter.body.height * 0.75);

        game.physics.arcade.moveToObject(enemyBullet,player,300);
        firingTimer = game.time.now + 400 + livingEnemies.length * 50;
        game.sound.play('laser1', 0.7);
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
            game.sound.play('laser2', 0.7);
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    location.reload();

    /*

    //  A new level starts

    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;
    */

}

function changePage() {
    window.location.href = "../alcohol/index.htm";
}