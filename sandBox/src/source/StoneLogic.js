import GameMeta from "../meta/GameMeta";

export default class StoneLogic extends Laya.Script {

    constructor() { 
        super();
        this.stoneID = 0;
    }
    
    onEnable() {
        this.stoneImage = this.owner.getChildByName("image");
    }

    onDisable() {
    }

    onStart() {
        // new Laya.Sprite().
        this.stoneImage.loadImage(GameMeta.StoneImagePath[0], Laya.Handler.create(this, function() {
            this.stoneImage.width = this.stoneImage.texture.sourceWidth;
            this.stoneImage.height = this.stoneImage.texture.sourceHeight;
            this.stoneImage.y = this.owner.height - this.stoneImage.texture.sourceHeight;
            this.stoneImage.x = Math.floor((this.owner.width - this.stoneImage.texture.sourceWidth)/2);
        }));
    }

    setStoneID(id) {
        this.stoneID = id;
    }
}