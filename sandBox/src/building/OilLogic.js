import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class OilLogic extends BuildingBaseLogic {

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
        Laya.Dialog.open(ResourceMeta.OilDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }

    getCurWorkersIdArray() {
        let workersArray = this.getModel().getExteraData("workersArray");
        if (workersArray == undefined || workersArray == null) {
            workersArray = [];
        }
        return workersArray;
    }

    addWorkerId(workerId) {
        let model = this.getModel();
        let workersArray = this.getCurWorkersIdArray();
        for (let index = 0; index < workersArray.length; index++) {
            const item = workersArray[index];
            if (String(item) == String(workerId)) {
                return
            }
        }
        workersArray.push(workerId);
        model.setExteraData("workersArray", workersArray);
    }
}