import BuildingMeta from "../meta/BuildingMeta";

export default class BuildingBaseLogic extends Laya.Script {

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
        this.onInitBuilding();
    }

    onDisable() {
        Laya.timer.clear(this, this.onCreateProgress);
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

    joinCreateBuilding(residentId) {
        this.model.addCreateResidentIds(residentId);
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
        this.onCreateBuildingFinish();
        this.model.clearCreateResidentIds();
    }


    makeParam(extraParam) {
        let ret = {};
        ret.residentIds = this.model.getCreateResidentIds();
        ret.extraParam = extraParam;
        return ret;
    }

    getModel() {
        return this.model;
    }

    // 建筑初始化
    onInitBuilding() {
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
    }

}