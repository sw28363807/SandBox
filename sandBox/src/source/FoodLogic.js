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
        Laya.timer.clear(this, this.fadeOutFinish);
    }

    onStart() {
        Laya.timer.once(1000, this, this.fadeOutFinish);
        this.ani.play(0, false, "fadeOut" + String(this.model.getFoodType()));
    }

    fadeOutFinish() {
        this.ani.play(0, true, "idle" + String(this.model.getFoodType()));
        Laya.timer.clear(this, this.fadeOutFinish);
    }

    onDestroy() {
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
    }

    getModel() {
        return this.model;
    }
}