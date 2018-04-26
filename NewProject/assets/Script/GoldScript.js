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
        game: {
            default: null,
            serializable: false
        },
        eatEffect: {
            default: null,
            type: cc.Prefab
        },
		cnt: 0,
		xVelo: 0,
		yVelo: 0,
		xAdd: 0,
		yAdd: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		var firstX = Math.floor(Math.random() * 960) - 480;
		this.cnt = 0;
		this.xAdd = Math.floor(Math.random() * 10.0 - 5.0) / 50.0;
		this.yAdd = -Math.floor(Math.random() * 10.0) / 100.0;
		if(this.yAdd==0)
			this.yAdd = -0.01;
		this.xVelo = this.xAdd;
		this.yVelo = 0;
		this.node.setPosition(firstX, 340);
    },

    update (dt) {
		this.cnt++;
		this.node.setPosition(this.node.getPositionX() + this.xVelo, this.node.getPositionY() + this.yVelo);
		//this.xVelo += this.xAdd;
		this.yVelo += this.yAdd;

		if(this.checkPlayerPosition()){
			this.onPicked();
			this.node.destroy();
			return;
		}
		if(this.node.getPositionY() < -260){
			this.node.destroy();
		}
	},
	onPicked: function(){
		if(this.game!=null){
			this.game.gainScore();
			var newEffect = cc.instantiate(this.eatEffect);
			newEffect.setPosition(this.node.getPosition());
			this.game.node.addChild(newEffect);
			newEffect.runAction(cc.sequence(
				cc.scaleTo(0.2, 1.2),
				cc.delayTime(0.5),
				cc.scaleTo(0.2, 0.1),
				//cc.callFunc(this.removeFromParent, this)
				cc.removeSelf()
				));
		}
	},
	removeFromParent: function(){
			this.node.destroy();
	},
	checkPlayerPosition: function(){
		var binder = this.game.player.getPosition();
		var dist = cc.pDistance(this.node.position, binder);
		if(dist < 30)
			return true;
		return false;
	},
});
