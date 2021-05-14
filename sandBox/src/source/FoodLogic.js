import GameMeta from "../meta/GameMeta";

export default class FoodLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.foodImage = this.owner.getChildByName("image");
    }

    onDisable() {
    }

    onStart() {
        this.owner.alpha = 0;
        this.foodImage.loadImage(GameMeta.FoodImagePath[0]["normalState"], Laya.Handler.create(this, function() {
        }));
        Laya.Tween.to(this.owner, {alpha: 1}, 500);
    }
}