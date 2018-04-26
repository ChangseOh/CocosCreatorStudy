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
        /*game: {
            default: null,
            serializable: false
        },*/
        backBg: {
            default: null,
            type: cc.Node
        },
        foreBg: {
            default: null,
            type: cc.Node
        },
        gameoverMsg: {
            default: null,
            type: cc.Label
        },
        jumpHeight: 0,
        jumpDuration: 0,
		cnt: 0,
		accel: 0,
		keyFlag: cc.KEY.a,
		keyOn: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.mode = 0;
		this.cnt = 0;
		this.keyOn = false;
		this.accel = 0;
		this.keyFlag = cc.KEY.a;
		this.jumpDuration = 1;
		this.jumpHeight = 50;
		this.setInputControl();
		this.anim = this.getComponent(cc.Animation);
		this.anim.play(0);
	},

    start () {

    },

    update (dt) {

		if(this.mode==1)
			return;

		this.cnt++;
		this.node.setPositionX(this.node.getPositionX() + this.accel);
		if(!this.keyOn){
			if(this.accel > 0){
				this.accel = this.accel - 0.2;
				if(this.accel < 0){
					this.accel = 0;
					//if(!this.anim.getAnimationState("Ninja2").isPlaying())
					{
						this.anim.stop();
						this.anim.play("Ninja2");
					}
				}
			}
			if(this.accel < 0){
				this.accel = this.accel + 0.2;
				if(this.accel > 0){
					this.accel = 0;
					//if(!this.anim.getAnimationState("Ninja2").isPlaying())
					{
						this.anim.stop();
						this.anim.play("Ninja2");
					}
				}
			}
		}else{
			switch(this.keyFlag){
				case cc.KEY.a :
					if(this.accel > -5)
						this.accel -= 0.2;
					this.node.setScaleX(-1.5);
					break;
				case cc.KEY.d :
					if(this.accel < 5)
						this.accel += 0.2;
					this.node.setScaleX(1.5);
					break;
			}
		}
		if(this.node.getPositionX() < -480)
			this.node.setPositionX(-480);
		if(this.node.getPositionX() > 480)
			this.node.setPositionX(480);

		this.backBg.setPositionX((this.node.getPositionX() / 480.0) * (-60.0));
		this.foreBg.setPositionX((this.node.getPositionX() / 480.0) * (-160.0));
	},
	setMoveAction: function(){
	},
	setInputControl: function(){
		var self = this;
		if(self.mode==1)
			return;
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(event){
			if(event.keyCode==cc.KEY.a||event.keyCode==cc.KEY.d)
			{
				self.keyOn = true;
				self.keyFlag = event.keyCode;
					self.anim.stop();
					self.anim.play("Ninja1");
			}
			else
			if(event.keyCode==cc.KEY.s){
				//jump
				if(self.node.getNumberOfRunningActions() == 0){
					var jumpUp = cc.moveBy(0.25, cc.p(0, 100)).easing(cc.easeCubicActionOut());
					var jumpDown = cc.moveBy(0.25, cc.p(0, -100)).easing(cc.easeCubicActionIn());
					self.node.runAction(cc.sequence(jumpUp, jumpDown));
					//this.anim.play(1);
				}
			}
		});
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function(event){
			if(event.keyCode==cc.KEY.a||event.keyCode==cc.KEY.d)
			{
				if(self.mode==1)
					return;
				self.keyOn = false;
				//if(!self.anim.getAnimationState("Ninja1").isPlaying())
				{
					self.anim.stop();
					self.anim.play("Ninja1");
				}
			}
		});
	},
	iAmDead: function(){
		if(this.mode==1)
			return;
		this.mode = 1;
		this.anim.stop();
		this.anim.play("Ninja3");
		this.gameoverMsg.node.runAction(cc.moveTo(0.5, cc.p(0, 0)));
		this.node.runAction(cc.sequence(
			cc.moveBy(0.25, cc.p(0,200)).easing(cc.easeCubicActionOut()),
			cc.delayTime(0.25),
			cc.moveBy(0.5, cc.p(0,-400)).easing(cc.easeCubicActionIn()),
			));
	},
	restartGame: function(){
		this.node.stopAllActions();
		this.node.setPosition(cc.p(303, -221));
		this.gameoverMsg.node.setPositionY(422);
		this.mode = 0;
		this.cnt = 0;
		this.keyOn = false;
		this.accel = 0;
		this.keyFlag = cc.KEY.a;
		//this.jumpDuration = 1;
		//this.jumpHeight = 50;
		//this.setInputControl();
		this.anim.stop();
		this.anim.play('Ninja2');
	},
});
