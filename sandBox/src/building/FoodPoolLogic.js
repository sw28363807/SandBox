import BuildingMeta from "../meta/BuildingMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class FoodPoolLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.foodPoolText = this.owner.getChildByName("foodPoolText");
        this.foodPoolText.visible = false;
        this.maxSave = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.FoodPoolType].maxSave;
    }

    isReachFoodMax() {
        let model = this.getModel();
        let curSaveFood = model.getExteraData("curFood");
        return curSaveFood >= this.maxSave;
    }

    addFoodToPool(num) {
        let model = this.getModel();
        let curSaveFood = model.getExteraData("curFood");
        if (curSaveFood == null || curSaveFood == undefined) {
            curSaveFood = 0;
        }
        curSaveFood += num;
        if (curSaveFood < 0) {
            curSaveFood = 0;
        }
        if (curSaveFood > this.maxSave) {
            curSaveFood = this.maxSave;
        }
        model.setExteraData("curFood", curSaveFood);
        this.foodPoolText.text = String(curSaveFood) + "/" + String(this.maxSave);
    }

    // 建筑初始化
    onInitBuilding() {
        this.addFoodToPool(0);
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.foodPoolText.visible = true;

    }
}