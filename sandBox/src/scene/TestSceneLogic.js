import FoodMgr from "../food/FoodMgr";
import EventMgr from "../helper/EventMgr";
import GameMeta from "../meta/GameMeta";
import ResidentMgr from "../resident/ResidentMgr";

export default class TestSceneLogic extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        this.initEvent();
        this.ScrollView = this.owner.getChildByName("ScrollView");
        this.container = this.ScrollView.getChildByName("container");
        ResidentMgr.getInstance().createResidentByConfig({
            parent:this.container
        }, Laya.Handler.create(this, function(obj){
        }));
    }

    // 注册消息
    initEvent() {
        EventMgr.getInstance().registEvent(GameMeta.ADD_FOOD_TO_MAP, this, this.onAddFoodToMap);
    }

    onAddFoodToMap(param) {
        FoodMgr.getInstance().createFoodByConfig({
            parent:this.container,
            x: param.x,
            y: param.y
        }, Laya.Handler.create(this, function(obj) {
            
        }));
    }

    onDisable() {
    }
}