import GameMeta from "../meta/GameMeta";
export default class HomeLogic extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        this.pos = this.owner.getChildByName("pos");
        this.homeImage = this.pos.getChildByName("image"); 
        
    }

    onDisable() {
    }

    refreshInfo(info) {
        this.homeImage.loadImage(GameMeta.HomeImagePath[0].homeImage, Laya.Handler.create(this, function () {
            this.homeImage.width = 128;
            this.homeImage.height = 128;
            this.homeImage.x = (128 - this.owner.width)/2;
            this.homeImage.y = - this.homeImage.height;
        }));
    }
}