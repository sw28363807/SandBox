import EventMgr from "../helper/EventMgr";
import Utils from "../helper/Utils";
import BuildingMeta from "../meta/BuildingMeta";
import GameEvent from "../meta/GameEvent";

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
    }

    onDisable() {
        this.stopTimer();
    }

    stopTimer() {
        Laya.timer.clear(this, this.onCreateProgress);
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        let buildingType = this.model.getBuildingType();
        let buildingMeta = BuildingMeta.BuildingDatas[String(buildingType)];
        this.createAddValue = buildingMeta.createBuildingSpeed/this.sliderMax;
        this.onInitBuilding();
        this.setPreCreate();
    }

    // 准备建造
    setPreCreate() {
        this.ani.play(0, true, "precreate");
        this.sliderControl.visible = true;
        this.slider.width = 1;
    }

    joinResidentIdToBuilding(residentId) {
        this.model.addResidentId(residentId);
    }

    // 开始建造
    startCreate() {
        if (this.model.getBuildingState() == BuildingMeta.BuildingState.PreCreating) {
            this.model.setBuildingState(BuildingMeta.BuildingState.Creating);
            this.ani.play(0, true, "creating");
            this.sliderControl.visible = true;
            this.slider.width = 1;
            Laya.timer.loop(BuildingMeta.BuildingCreatingStep, this, this.onCreateProgress);
        }
    }

    onCreateProgress() {
        this.slider.width = this.slider.width + this.createAddValue;
        if (this.slider.width > this.sliderMax) {
            this.slider.width = this.sliderMax;
            this.stopTimer();
            this.onCreateFinish();
        }
    }

    onCreateFinish() {
        this.ani.play(0, true, "idle");
        this.sliderControl.visible = false;
        Laya.timer.clear(this, this.onCreateProgress);
        this.model.setBuildingState(BuildingMeta.BuildingState.Noraml);
        Utils.setMapZOrder(this.owner);
        this.onCreateBuildingFinish();
        EventMgr.getInstance().postEvent(GameEvent.CREATE_BUILDING_FINISH, this.makeParam(this.model));
        this.model.clearResidentIds();
    }

    makeParam(extraParam) {
        let ret = {};
        ret.residentIds = this.model.getResidentIds();
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