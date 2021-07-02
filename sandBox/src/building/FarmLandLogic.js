import BuildingMeta from "../meta/BuildingMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class FarmLandLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.foodPoolText = this.owner.getChildByName("foodPoolText");
        this.foodPoolText.visible = false;
        this.maxSave = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.FoodPoolType].maxSave;
    }

    onDisable() {
        Laya.timer.loop(this, this.onAddFood);
        super.onDisable();
    }

    onStart() {
        Laya.timer.loop(1000, this, this.onAddFood);
    }

    onAddFood() {
        this.addFoodToPool(1);
    }

    getCurSaveFood() {
        let curSaveFood = this.getModel().getExteraData("curFood");
        if (curSaveFood == undefined || curSaveFood == null) {
            curSaveFood = 0;
        }
        return curSaveFood;
    }

    isReachFoodMax() {
        return this.getCurSaveFood() >= this.maxSave;
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

    // 建筑初始化
    onInitBuilding() {
        this.addFoodToPool(0);
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.foodPoolText.visible = true;
        Laya.timer.loop(1000, this, this.onAddFood);
    }
}