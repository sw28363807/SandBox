import EventMgr from "../helper/EventMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameEvent from "../meta/GameEvent";

export default class FarmLandLogic extends Laya.Script {

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
        Laya.timer.clear(this, this.onCreateProgress);
    }

    getModel() {
        return this.model;
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        this.setPreCreate();
    }

    // 准备建造
    setPreCreate() {
        this.ani.play(0, true, "precreate");
        this.sliderControl.visible = true;
        this.slider.width = 1;
    }

    // 开始建造
    startCreate() {
        if (this.model.getBuildingState() == BuildingMeta.BuildingState.PreCreating) {
            this.model.setBuildingState(BuildingMeta.BuildingState.Creating);
            this.ani.play(0, true, "creating");
            this.sliderControl.visible = true;
            this.slider.width = 1;
            Laya.timer.loop(BuildingMeta.HomeCreatingStep, this, this.onCreateProgress);
        }
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
        this.model.setBuildingState(BuildingMeta.BuildingState.Noraml);
        EventMgr.getInstance().postEvent(GameEvent.CREATE_FARMLAND_FINISH, {model: this.model});
    }
}