import EventMgr from "../helper/EventMgr";
import TipMgr from "../helper/TipMgr";
import Utils from "../helper/Utils";
import BuildingMeta from "../meta/BuildingMeta";
import GameEvent from "../meta/GameEvent";

export default class BuildingBaseLogic extends Laya.Script {

    constructor() {
        super();
        this.residentCreateIdList = new Set([]);   //建造建筑的人物ID列表
        this.residentUseIdList = new Set([]);       //使用建筑的人物ID列表
        this.buildingMgr = null;
    }

    onEnable() {
        this.ani = this.owner.getChildByName("ani");
        this.sliderControl = this.owner.getChildByName("sliderControl");
        this.slider = this.sliderControl.getChildByName("slider");
        this.sliderControl.visible = false;
        this.sliderMax = this.slider.texture.width;
        this.buildingTouch = this.owner.getChildByName("buildingTouch");
        this.initTouch();
    }

    onDisable() {

    }

    onDestroy() {
        this.stopTimer();
    }

    initTouch() {
        if (this.buildingTouch == null || this.buildingTouch == undefined) {
            return;
        }
        this.buildingTouch.on(Laya.Event.MOUSE_DOWN, this, function () {
            this.touchDownPos = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseX);
        });

        this.buildingTouch.on(Laya.Event.MOUSE_UP, this, function (e) {
            if (this.touchDownPos) {
                if (this.touchDownPos.distance(Laya.stage.mouseX, Laya.stage.mouseX) < 10) {
                    if (this.model.getBuildingState() == BuildingMeta.BuildingState.Noraml) {
                        this.onClickBuilding();
                    } else {
                        TipMgr.getInstance().showTip("还未建造完成哦");
                    }
                };
            }
            this.touchDownPos = null;
        });
    }

    stopTimer() {
        Laya.timer.clear(this, this.onCreateProgress);
    }

    setBuildingMgr(mgr) {
        this.buildingMgr = mgr;
    }

    getBuildingMgr() {
        return this.buildingMgr;
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        let buildingType = this.model.getBuildingType();
        let buildingMeta = BuildingMeta.BuildingDatas[String(buildingType)];
        this.createAddValue = buildingMeta.createBuildingSpeed / this.sliderMax;
        this.onInitBuilding();
        this.setPreCreate();
    }

    // 准备建造
    setPreCreate() {
        this.ani.play(0, true, "precreate");
        this.sliderControl.visible = true;
        this.slider.width = 1;
    }

    joinResidentIdToBuildingForCreate(residentId) {
        this.residentCreateIdList.add(residentId);
    }

    joinResidentIdToBuildingForUse(residentId) {
        this.residentUseIdList.add(residentId);
    }

    removeResidentIdToBuildingForUse(residentId) {
        this.residentUseIdList.delete(residentId);
    }

    getResidentIdToBuildingForUseNum() {
        return this.residentUseIdList.size;
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
        this.residentCreateIdList.clear();
    }

    makeParam(extraParam) {
        let ret = {};
        ret.residentIds = this.residentCreateIdList;
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

    // 点击建筑物
    onClickBuilding() {

    }

}