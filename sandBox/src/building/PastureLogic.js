import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
import MoveLogic from "../helper/MoveLogic";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameModel from "../model/GameModel";

export default class PastureLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.foodPoolText = this.owner.getChildByName("foodPoolText");
        this.foodPoolText.visible = false;
        this.maxSave = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.PastureType].maxSave;
    }

    onDisable() {
        Laya.timer.loop(this, this.onAddFood);
        super.onDisable();
    }

    onStart() {
        Laya.timer.loop(1000, this, this.onAddFood);
    }

    onAddFood() {
        let season = GameModel.getInstance().getGameSeason();
        if (season == 0 || season == 3) {
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
        this.owner.zOrder = 2;
        for (let index = 0; index < 2; index++) {
            this.addAnimal(1);
        }
        for (let index = 0; index < 2; index++) {
            this.addAnimal(2);
        }
    }

    addAnimal(index) {
        let prefabDef = null
        if (index == 1) {
            prefabDef = Laya.loader.getRes(ResourceMeta.Livestock1PrefabPath);
        } else if (index == 2) {
            prefabDef = Laya.loader.getRes(ResourceMeta.Livestock2PrefabPath);
        }
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
        let centerX = this.owner.width/2;
        let centerY = this.owner.height/2;
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