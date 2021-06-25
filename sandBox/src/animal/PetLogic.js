import MoveLogic from "../helper/MoveLogic";

export default class PetLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.ani = this.owner.getChildByName("ani");
    }

    onDisable() {
    }

    onStart() {
        this.moveLogic = this.owner.getComponent(MoveLogic);
        this.initMoveLogic();
        this.ani.play(0, true, "idle");
    }

    initMoveLogic() {
        let owner = this;
        this.leftFunc = function () {
            owner.ani.play(0, true, "walk_left");
        };
        this.rightFunc = function () {
            owner.ani.play(0, true, "walk_right");
        };
        this.upFunc = function () {
            owner.ani.play(0, true, "walk_up");
        };
        this.downFunc = function () {
            owner.ani.play(0, true, "walk_down");
        };
        this.moveLogic.setCallbackFunc({
            leftFunc : this.leftFunc,
            rightFunc : this.rightFunc,
            upFunc : this.upFunc,
            downFunc : this.downFunc,
        });
    }

    walkTo(config, handler) {
        this.moveLogic.gotoDestExt(config, Laya.Handler.create(this, function () {
            this.ani.play(0, true, "idle");
            if (handler) {
                handler.run();
            }
        }));
    }
}