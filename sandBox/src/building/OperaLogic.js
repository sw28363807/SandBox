import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";

export default class OperaLogic extends BuildingBaseLogic {

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
        Laya.Dialog.open(ResourceMeta.OperaDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }
}