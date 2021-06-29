import Utils from "../helper/Utils";
import BuildingMeta from "../meta/BuildingMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class FireLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {

    }

    getHeatingTimes() {
        let curSaveHeatingTimes = this.getModel().getExteraData("curHeatingTimes");
        if (curSaveHeatingTimes == undefined || curSaveHeatingTimes == null) {
            curSaveHeatingTimes = 0;
        }
        return curSaveHeatingTimes;
    }

    getHeatingMaxTimes() {
        return BuildingMeta.BuildingDatas[this.model.getBuildingType()].heatingMaxTImes;
    }

    setHeatingTimes(num) {
        let max = this.getHeatingMaxTimes();
        if (num > max) {
            num = max;
        }
        this.getModel().setExteraData("curHeatingTimes", num);
    }

    addHeatingTimes(num) {
        this.setHeatingTimes(this.getHeatingTimes() + num);
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        Utils.setMapZOrder(this.owner, null, -50);
    }
}