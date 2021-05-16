import FoodMeta from "../meta/FoodMeta";
import GameMeta from "../meta/GameMeta";

export default class FoodLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.foodImage = this.owner.getChildByName("image");
        this.owner.zOrder = FoodMeta.FoodZOrder;
        this.trigger = null;
    }

    onDisable() {
    }

    onStart() {
        this.owner.alpha = 0;
        this.foodImage.loadImage(GameMeta.FoodImagePath[0]["normalState"], Laya.Handler.create(this, function() {
        }));
        Laya.Tween.to(this.owner, {alpha: 1}, 500);
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