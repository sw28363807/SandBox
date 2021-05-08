import MoveAction from "../action/MoveAction";
import ResidentMgr from "../resident/ResidentMgr";

export default class TestSceneLogic extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        this.ScrollView = this.owner.getChildByName("ScrollView");
        this.container = this.ScrollView.getChildByName("container");
        ResidentMgr.createResidentByConfig(null, Laya.Handler.create(this, function(obj){
            this.container.addChild(obj);
            MoveAction.createAction(obj, 100, 200, Laya.Handler.create(this, function() {
                
            }));
        }));
    }

    onDisable() {
    }
}