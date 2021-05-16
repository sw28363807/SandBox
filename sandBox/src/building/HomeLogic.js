import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
export default class HomeLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.ani = this.owner.getChildByName("ani"); 
        this.sliderControl = this.owner.getChildByName("sliderControl");
        this.slider = this.sliderControl.getChildByName("slider");
        this.sliderControl.visible = false;
        this.sliderMax = 194;
        this.addValue = BuildingMeta.HomeCreatingStepValue/this.sliderMax;
    }

    onDisable() {
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        this.startCreate();
    }

    // 开始建造
    startCreate() {
        this.ani.play(0, true, "creating");
        this.sliderControl.visible = true;
        this.slider.width = 1;
        Laya.timer.loop(BuildingMeta.HomeCreatingStep, this, this.onCreateProgress);
    }

    onCreateProgress() {
        this.slider.width = this.slider.width + this.addValue;
        if (this.slider.width > this.sliderMax) {
            this.slider.width = this.sliderMax;
            this.onCreateFinish();
        }
    }

    onCreateFinish() {
        this.ani.play(0, true, "idle");
        this.sliderControl.visible = false;
        Laya.timer.clear(this, this.onCreateProgress);
    }
}