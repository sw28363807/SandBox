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
        Laya.timer.clear(this, this.onCreateFood);
    }

    onStart() {
        Laya.timer.loop(FoodMeta.FoodUpdateTime, this, this.onCreateFood);
        this.onCreateFood();
    }

    onCreateFood() {
        if (this.curNum >= FoodMeta.FoodMaxNumPerTrigger) {
            return;
        }
        let dstX = this.owner.x + RandomMgr.randomNumer(0, this.owner.width);
        let dstY = this.owner.y + this.owner.height - RandomMgr.randomNumer(50, this.owner.height);
        FoodMgr.getInstance().createFoodByConfig({
            parent:GameContext.mapContainer,
            x: dstX,
            y: dstY,
            trigger: this,
            foodType: FoodMeta.FoodTypes.FruitType
        }, Laya.Handler.create(this, function(obj) {
            
        }));
        this.addNum(1);
    }

    // 增加一个计数
    addNum(num) {
        this.curNum = this.curNum + num;
        if (this.curNum >= FoodMeta.FoodMaxNumPerTrigger) {
            this.curNum = FoodMeta.FoodMaxNumPerTrigger;
        }
    }
}