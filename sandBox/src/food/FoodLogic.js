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
        this.foodImage.loadImage(GameMeta.FoodImagePath[0]["normalState"], Laya.Handler.create(this, function() {
        }));
    }
}