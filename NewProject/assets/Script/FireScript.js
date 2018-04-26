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
		usetime: 0.0,
		mode: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		var firstX = Math.floor(Math.random() * 960) - 480;
		this.node.setPosition(firstX, 340);
		this.node.setScale(1.5);
	},

    start () {

		this.mode = 0;
		this.usetime = 10.0;

		var rt = cc.rotateBy(11, -3600);
		this.node.runAction(rt);
    },

    update (dt) {
		if(this.mode != 1)
		{
			if(this.usetime > 0){
				this.usetime -= dt;
			}else{
				this.mode = 1;
				this.node.runAction(cc.sequence(
						cc.fadeOut(1),
						cc.removeSelf()
					));
				//this.node.destroy();
				return;
			}

			if(this.node.getPositionY() > -230){
				this.node.setPositionY(this.node.getPositionY() - 5);
			}

			if(this.checkPlayerPosition() && this.mode == 0){
				this.mode = 2;
				this.game.gameover();
				//this.game.player.iAmDead();
				return;
			}
		}
	},
	checkPlayerPosition: function(){
		var binder = this.game.player.getPosition();
		var dist = cc.pDistance(this.node.position, binder);
		if(dist < 30)
			return true;
		return false;
	},
});
