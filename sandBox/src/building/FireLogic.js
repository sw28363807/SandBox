import Utils from "../helper/Utils";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class FireLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {

    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        Utils.setMapZOrder(this.owner, null, -50);
    }
}