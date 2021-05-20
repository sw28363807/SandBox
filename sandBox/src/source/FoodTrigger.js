import RandomMgr from "../helper/RandomMgr";
import FoodMeta from "../meta/FoodMeta";
import GameContext from "../meta/GameContext";
import FoodMgr from "./FoodMgr";

export default class FoodTrigger extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.curNum = 0;
    }

    onDisable() {
    }

    onStart() {
        this.owner.timer.loop(FoodMeta.FoodUpdateTime, this, function() {
            if (this.curNum >= FoodMeta.FoodMaxNumPerTrigger) {
                return;
            }
            let pos = RandomMgr.randomByArea(this.owner.x, this.owner.y, FoodMeta.FoodTriggerArea);
            FoodMgr.getInstance().createFoodByConfig({
                parent:GameContext.mapContainer,
                x: pos.x,
                y: pos.y,
                trigger: this,
                foodType: 1
            }, Laya.Handler.create(this, function(obj) {
                
            }));
            this.addNum(1);
        });
    }

    // 增加一个计数
    addNum(num) {
        this.curNum = this.curNum + num;
        if (this.curNum >= FoodMeta.FoodMaxNumPerTrigger) {
            this.curNum = FoodMeta.FoodMaxNumPerTrigger;
        }
    }
}