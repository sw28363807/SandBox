import FoodMeta from "../meta/FoodMeta";
import GameMeta from "../meta/GameMeta";

export default class FoodLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.ani = this.owner.getChildByName("ani");
        this.owner.zOrder = FoodMeta.FoodZOrder;
        this.trigger = null;
    }

    onDisable() {
    }

    onStart() {
        Laya.timer.once(1000, this, this.fadeOutFinish);
        this.ani.play(0, false, "fadeOut" + String(this.foodAnimIndex));
    }

    fadeOutFinish() {
        this.ani.play(0, true, "idle" + String(this.foodAnimIndex));
        Laya.timer.clear(this, this.fadeOutFinish);
    }

    onDestroy() {
        Laya.timer.clear(this, this.fadeOutFinish);
        if (this.trigger) {
            this.trigger.addNum(-1);
        }
    }

    setTrigger(trigger) {
        this.trigger = trigger;
    }

    getTrigger() {
        return this.trigger;
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        this.foodType = this.model.getFoodType();
        if (this.foodType == FoodMeta.FoodTypes.FruitType) {
            this.foodAnimIndex = Math.ceil(Math.random() * 5);
        } else {
            this.foodAnimIndex = 6;
        }
        
    }

    getModel() {
        return this.model;
    }
}