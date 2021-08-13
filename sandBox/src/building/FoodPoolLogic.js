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

    getCurSaveFood() {
        let curSaveFood = this.getModel().getExteraData("curFood");
        if (curSaveFood == undefined || curSaveFood == null) {
            curSaveFood = 0;
        }
        return curSaveFood;
    }

    addFoodToPool(num) {
        let model = this.getModel();
        let curSaveFood = this.getCurSaveFood()
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

    isReachFoodMax() {
        return this.getCurSaveFood() >= this.maxSave;
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