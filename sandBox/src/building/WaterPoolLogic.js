import BuildingMeta from "../meta/BuildingMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class WaterPoolLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.waterPoolText = this.owner.getChildByName("waterPoolText");
        this.waterPoolText.visible = false;
        this.maxSave = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.WaterPoolType].maxSave;
    }

    isReachWaterMax() {
        let model = this.getModel();
        let curSaveWater = model.getExteraData("curWater");
        return curSaveWater >= this.maxSave;
    }

    addWaterToPool(num) {
        let model = this.getModel();
        let curSaveWater = model.getExteraData("curWater");
        if (curSaveWater == null || curSaveWater == undefined) {
            curSaveWater = 0;
        }
        curSaveWater += num;
        if (curSaveWater < 0) {
            curSaveWater = 0;
        }
        if (curSaveWater > this.maxSave) {
            curSaveWater = this.maxSave;
        }
        model.setExteraData("curWater", curSaveWater);
        this.waterPoolText.text = String(curSaveWater) + "/" + String(this.maxSave);
    }

    // 建筑初始化
    onInitBuilding() {
        this.addWaterToPool(0);
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.waterPoolText.visible = true;

    }
}