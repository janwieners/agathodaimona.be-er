var game = new Phaser.Game(800, 600, Phaser.AUTO, 'travelcanvas');

var PhaserGame = function () {

    this.background = null;
    this.player = null;
    this.cursors = null;
    this.speed = 250;
};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = false;
    },

    preload: function () {

        this.load.image('background', 'assets/background.jpg');
        this.load.image('player', 'assets/ship-thaller.png');
    },

    create: function () {

        this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.player = this.add.sprite(150, 290, 'player');

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    },

    update: function () {

        if (this.background.tilePosition.x <= -6100) {

            // Go to the next page
            $("body").fadeOut(2000, function() {

                window.location = "../../buero-kerpener.htm";
            });
        }

        this.player.body.velocity.set(0);

        if (this.cursors.left.isDown && this.background.tilePosition.x < 0)
        {
            this.background.tilePosition.x += 5;
        }
        else if (this.cursors.right.isDown && this.background.tilePosition.x >= -6500)
        {
            this.background.tilePosition.x -= 5;
        }

        if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -this.speed;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = this.speed;
        }
    }

};

game.state.add('Game', PhaserGame, true);