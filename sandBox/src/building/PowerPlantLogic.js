import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class PowerPlantLogic extends BuildingBaseLogic {

    constructor() {
        super();
        this.meta = BuildingMeta.BuildingDatas[String(BuildingMeta.BuildingType.PowerPlantType)];
        this.maxElec = this.meta.maxElec;
        this.addElec = this.meta.addElec;
        this.timeStep = this.meta.timeStep;
    }

    // 建筑初始化
    onInitBuilding() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onUpdateTimer);
        super.onDisable();
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.initTimer();
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.PowerPlantDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }

    initTimer() {
        Laya.timer.loop(this.timeStep, this, this.onUpdateTimer);
    }

    onUpdateTimer() {
        this.addCurSaveElec(this.addElec);
    }

    // 获得当前储存的电力
    getCurSaveElec() {
        let model = this.getModel();
        let curSaveElec = model.getExteraData("curSaveElec");
        if (curSaveElec == undefined || curSaveElec == null) {
            curSaveElec = 0;
        }
        return Number(curSaveElec);
    }

    // 设置当前储存的电力
    setCurSaveElec(num) {
        if (num > this.maxElec) {
            num = this.maxElec;
        }
        let model = this.getModel();
        model.setExteraData("curSaveElec", num);
    }

    // 添加当前储存的电力
    addCurSaveElec(num) {
        let elec = this.getCurSaveElec();
        this.setCurSaveElec(elec + num);
    }
}