import MoveLogic from "../helper/MoveLogic";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";
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

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.FarmLandDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }

    onAddFood() {
        let season = GameModel.getInstance().getGameSeason();
        if (season == 1 || season == 2) {
            this.addFoodToPool(1);
        }
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
        for (let index = 0; index < 3; index++) {
            this.addAnimal();
        }
    }

    addAnimal() {
        let prefabDef = Laya.loader.getRes(ResourceMeta.Livestock3PrefabPath);
        let animal = prefabDef.create();
        this.owner.addChild(animal);
        animal.moveScript = animal.getComponent(MoveLogic);
        animal.ani = animal.getChildByName("ani");

        let owner = animal;
        let leftFunc = function () {
            owner.ani.play(0, true, "walk_left");
        };
        let rightFunc = function () {
            owner.ani.play(0, true, "walk_right");
        };
        let upFunc = function () {
            owner.ani.play(0, true, "walk_up");
        };
        let downFunc = function () {
            owner.ani.play(0, true, "walk_down");
        };
        animal.moveScript.setCallbackFunc({
            leftFunc: leftFunc,
            rightFunc: rightFunc,
            upFunc: upFunc,
            downFunc: downFunc,
        });
        let centerX = this.owner.width / 2;
        let centerY = this.owner.height / 2;
        animal.x = centerX;
        animal.y = centerY;
        this.startWalk(animal);
    }

    startWalk(animal) {
        let dst = RandomMgr.randomPointInRect(0, 0, this.owner.width - animal.width, this.owner.height - animal.height);
        animal.moveScript.gotoDest({
            x: dst.x,
            y: dst.y,
            speed: 2,
        }, Laya.Handler.create(this, function () {
            this.startWalk(animal);
        }));
    }
}