// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
		firePrefab: {
            default: null,
            type: cc.Prefab
		},
        goldPrefab: {
            default: null,
            type: cc.Prefab
        },
        goldLabel: {
            default: null,
            type: cc.Label
        },
        foreBg: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        restartbutton: {
            default: null,
            type: cc.Button
        },
        loadingbar: {
            default: null,
            type: cc.ProgressBar
        },
		score: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.mode = 0;
		this.score = 0;
        this.timer = 0;
        this.ftimer = 1;
		this.fires = 0;
        this.prog = 10;
	},

    start () {
		var self = this;
		this.restartbutton.node.on(cc.Node.EventType.TOUCH_END, function(event){
			cc.log("this is a callback after trigger pushed");
			self.restartGame();
		});
		//this.restartbutton.node.visible = true;
    },

    update (dt) {
		if(this.mode==1)
			return;

        this.prog -= dt;
        if(this.prog < 0)
            this.prog = 0;
        this.loadingbar.progress = (10 - this.prog) / 10;
        if (this.loadingbar.progress >= 1)
        {
            this.gameover();
            return;
        }
        this.timer += dt;
		if(this.timer > 1)
		{
			this.spawnNewGold();
		}

		this.ftimer -= dt;
		if(this.ftimer <= 0){
			this.spawnNewFire();
		}
	},
	spawnNewGold: function(){
        var newGold = cc.instantiate(this.goldPrefab);
        this.node.addChild(newGold);
		this.timer = 0;
		newGold.getComponent('GoldScript').game = this;
		//console.log("compo is valid");
	},
	gainScore: function(){
		this.score += 1;
		this.goldLabel.string = this.score.toString();
        this.prog = 10;
        this.loadingbar.progress = 0;
	},
	spawnNewFire: function(){
        var newFire = cc.instantiate(this.firePrefab);
        this.node.addChild(newFire);
		this.fires++;
		if(this.fires < 14)
			this.ftimer = 10 - (this.fires/2);
		else
			this.ftimer = 3;
		this.ftimer = 3;
		newFire.getComponent('FireScript').game = this;
		//console.log("compo is valid");
	},
	gameover: function(){
		this.mode = 1;
		console.log("game over");
		this.player.getComponent('MainCharacter').iAmDead();
		this.restartbutton.node.runAction(cc.sequence(
			cc.delayTime(1),
			cc.moveTo(0, cc.p(0, -150))
			));
			//setPositionY(-150);
	},
	restartGame: function(){
		var children = this.node.children;
		for(var i = 0; i < children.length; ){
			cc.log("Node: " + children[i].name);
			if(children[i].name=="Fire" || children[i].name=="Gold"){
				cc.log("remove " + children[i].name);
				children[i].stopAllActions();
				children[i].removeFromParent();
				//this.node.removeChild(children[i]);
			}
			else
				i++;
		}
		//this.player.node.setPosition(cc.p(303, -221));
		this.restartbutton.node.setPositionY(-450);
		this.goldLabel.string = "0";
		this.player.getComponent('MainCharacter').restartGame();
		this.mode = 0;
		this.score = 0;
        this.timer = 0;
        this.ftimer = 1;
		this.fires = 0;
        this.prog = 10;
        this.loadingbar.progress = 0;
	},
});
