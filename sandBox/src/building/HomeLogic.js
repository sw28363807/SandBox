import GameMeta from "../meta/GameMeta";
export default class HomeLogic extends Laya.Script {

    constructor() { 
        super();
        this.buildingState = 0; //0-无状态 1-建造中
    }
    
    onEnable() {
        this.pos = this.owner.getChildByName("pos");
        this.homeImage = this.pos.getChildByName("image"); 
        this.sliderControl = this.owner.getChildByName("sliderControl");
        this.slider = this.sliderControl.getChildByName("slider");
        this.sliderControl.visible = false;
    }

    onDisable() {
    }

    refreshByModel(model) {
        this.model = model;
        this.homeImage.loadImage(GameMeta.HomeImagePath[0].homeImage, Laya.Handler.create(this, function () {
            console.debug(this.homeImage.texture);
            this.homeImage.width = this.homeImage.texture.sourceWidth;
            this.homeImage.height = this.homeImage.texture.sourceHeight;
            
            this.homeImage.x = (this.homeImage.width - this.owner.width)/2;
            this.homeImage.y = - this.homeImage.height;
        }));
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        this.startCreate();
    }

    // 开始建造
    startCreate() {
        this.buildingState = 1;
        this.pos.alpha = 0.5;
        this.sliderControl.visible = true;
        this.slider.width = 1;
        Laya.timer.loop(30, this, this.onCreateProgress);
    }

    onCreateProgress() {
        this.buildingState = 0;
        this.slider.width = this.slider.width + 1;
        if (this.slider.width > 192) {
            this.slider.width = 192;
            this.onCreateFinish();
        }
    }

    onCreateFinish() {
        this.pos.alpha = 1;
        this.sliderControl.visible = false;
        Laya.timer.clear(this, this.onCreateProgress);
    }
}