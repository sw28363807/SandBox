import ResidentIdleAction from "../action/ResidentIdleAction";
import GameMeta from "../meta/GameMeta";

export default class ResidentLogic extends Laya.Script {

    constructor(config) { 
        super();
    }
    
    onEnable() {
       this.residentImage = this.owner.getChildByName("image");
       this.setAnim("normalState");
    }

    onDisable() {
    }

    // 设置动画
    setAnim(anim) {
        if (this.owner.stateAnim == anim) {
            return;
        }
        this.owner.stateAnim = anim;
        if (anim == "normalState") {
            this.residentImage.loadImage(GameMeta.ResidentStateImagePath[anim], Laya.Handler.create(this, function(){
                ResidentIdleAction.createAction(this.residentImage);
            }));
        }
    }
}