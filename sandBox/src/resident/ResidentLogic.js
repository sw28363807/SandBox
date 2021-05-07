import ResidentIdleAction from "../action/ResidentIdleAction";

export default class ResidentLogic extends Laya.Script {

    constructor(config) { 
        super();
    }
    
    onEnable() {
       let image = this.owner.getChildByName("image");
       image.loadImage("source/resident/residentNormal1.png", Laya.Handler.create(this, function(){
       }));
       ResidentIdleAction.createAction(image);
    }

    onDisable() {
    }
}