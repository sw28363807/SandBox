import BuildingBaseLogic from "./BuildingBaseLogic";
export default class ShopLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open("scene/ShopDialog.scene");
    }
}