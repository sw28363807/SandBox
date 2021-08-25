import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";

export default class FarmLandDialogLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onUpdateMiniGame);
        Laya.timer.clear(this, this.onTriggerFood);
    }

    onStart() {
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.FarmLandDialogScenePath);
        });
        this.descText = this.owner.getChildByName("descText");
        this.initMiniGame();
    }

    initMiniGame() {
        this.root = this.owner.getChildByName("root");
        this.foodId = 0;
        this.foods = {};
        Laya.timer.frameLoop(1, this, this.onUpdateMiniGame);
        Laya.timer.loop(200, this, this.onTriggerFood);
        this.root.on(Laya.Event.MOUSE_DOWN, this, function () {
            let x = Laya.stage.mouseX;
            let y = Laya.stage.mouseY;
            for (const key in this.foods) {
                let food = this.foods[key];
                if (food.hitTestPoint(x, y)) {
                    this.onTouchDownFood(food);
                    food.destroy(true);
                    delete this.foods[key];
                    break;
                }
            }
        });
    }

    triggerFood() {
        let randomNum = RandomMgr.randomNumber(1, 6);
        if (randomNum == 2) {
            return;
        }
        let imagePath = "source/landscape/food" + String(randomNum) + ".png";
        let spr = new Laya.Image();
        spr.loadImage(imagePath);
        spr.anchorX = 0.5;
        spr.anchorY = 0.5;
        spr.scaleX = 1.5;
        spr.scaleY = 1.5;
        this.root.addChild(spr);
        this.foodId++;
        this.foods[String(this.foodId)] = spr;
        let x = RandomMgr.randomNumber(50, this.root.width - 50);
        let y = 0;
        spr.x = x;
        spr.y = y;
        let speed = RandomMgr.randomNumber(6, 12);
        spr.speed = speed;
    }

    onTouchDownFood(food) {
        this.buildingScript.addFoodToPool(1);
    }

    onTriggerFood() {
        if (RandomMgr.randomYes(0.6)) {
            this.triggerFood();
        }
    }

    onUpdateMiniGame() {
        for (const key in this.foods) {
            let food = this.foods[key];
            if (food.y > this.root.height) {
                food.destroy(true);
                delete this.foods[key];

                break;
            }
        }
        for (const key in this.foods) {
            let food = this.foods[key];
            food.y += food.speed;
        }
        let foodSave = this.buildingScript.getCurSaveFood();
        this.descText.text = "当前食物:" + String(foodSave);
    }
}