import RandomMgr from "../helper/RandomMgr";
import FoodMeta from "../meta/FoodMeta";
import GameContext from "../meta/GameContext";
import FoodMgr from "./FoodMgr";

export default class FoodTrigger extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:foodTriggerKey, tips:"食物触发器key", type:String, default:""}*/
        let foodTriggerKey = "";
    }

    onEnable() {
        this.curNum = 0;
    }

    onDisable() {
        this.stopTrigger();
    }

    onStart() {
        this.restartTrigger(FoodMeta.FoodUpdateTime);
    }

    restartTrigger(time) {
        this.stopTrigger();
        this.startTrigger(time);
    }

    startTrigger(time) {
        Laya.timer.loop(time, this, this.onCreateFood);
        this.onCreateFood();
    }

    stopTrigger() {
        Laya.timer.clear(this, this.onCreateFood);
    }

    onCreateFood() {
        this.createFood();
    }

    createFood() {
        if (this.curNum >= FoodMeta.FoodMaxNumPerTrigger) {
            return;
        }
        let dstX = this.owner.x + RandomMgr.randomNumber(0, this.owner.width);
        let dstY = this.owner.y + this.owner.height - RandomMgr.randomNumber(50, this.owner.height);
        FoodMgr.getInstance().createFoodByConfig({
            parent: GameContext.mapContainer,
            x: dstX,
            y: dstY,
            trigger: this,
            foodType: FoodMeta.FoodTypes.FruitType
        });
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