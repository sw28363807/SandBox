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
            parent:this.container,
            x: 100, y: 200, sex: 2
        }, Laya.Handler.create(this, function(obj){
        }));

        ResidentMgr.getInstance().createResidentByConfig({
            parent:this.container,
            x: 200, y: 260, sex: 1
        }, Laya.Handler.create(this, function(obj){
        }));
    }

    onDisable() {
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
}