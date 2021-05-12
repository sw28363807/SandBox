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

    refreshInfo(config) {
        this.homeImage.loadImage(GameMeta.HomeImagePath[0].homeImage, Laya.Handler.create(this, function () {
            this.homeImage.width = 128;
            this.homeImage.height = 128;
            this.homeImage.x = (128 - this.owner.width)/2;
            this.homeImage.y = - this.homeImage.height;
        }));
        this.owner.x = config.x;
        this.owner.y = config.y;
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