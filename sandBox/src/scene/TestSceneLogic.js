import ResidentMgr from "../resident/ResidentMgr";

export default class TestSceneLogic extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        ResidentMgr.createResidentByConfig(null, Laya.Handler.create(this, function(obj){
            this.owner.addChild(obj);
        }));
    }

    onDisable() {
    }
}