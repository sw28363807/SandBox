import FoodMeta from "../meta/FoodMeta";
import GameMeta from "../meta/GameMeta";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";
import FoodLogic from "./FoodLogic";

export default class FoodMgr extends Laya.Script {

    constructor() {
        super();
        this.foods = {};
    }

    static getInstance() {
        return FoodMgr.instance = FoodMgr.instance || new FoodMgr();
    }

    // 创建食物
    createFoodByConfig(config) {
        let prefabDef = Laya.loader.getRes(ResourceMeta.FoodPrefabPath);
        let food = prefabDef.create();
        config.parent.addChild(food);
        let script = food.getComponent(FoodLogic);
        food.foodScript = script;
        script.setTrigger(config.trigger);
        let model = GameModel.getInstance().newFoodModel(config);
        script.refreshByModel(model);
        this.foods[String(model.getFoodId())] = food;
        return food;
    }

    // 获得距离最近的一个食物
    getNearstFood(param) {
        let distance = 99999999;
        let ret = null;
        for (const key in this.foods) {
            let food = this.foods[key];
            if (param.state != null &&
                food.foodScript.getModel().getFoodState() != param.state) {
                continue;
            }
            let curDistance = new Laya.Point(food.x, food.y).distance(param.x, param.y);
            if (curDistance <= param.area && curDistance < distance) {
                distance = curDistance;
                ret = food;
            }
        }
        return ret;
    }

    // 是否可以去找食物
    canFindFood() {
        for (const key in this.foods) {
            let food = this.foods[key];
            let script = food.foodScript;
            if (script.getModel().getFoodState() == FoodMeta.FoodState.CanEat) {
                return true;
            }
        }
        return false;
    }

    // 获得一个食物
    getFoodById(id) {
        return this.foods[String(id)];
    }

    // 删除一个食物
    removeFoodById(foodId) {
        for (const key in this.foods) {
            let food = this.foods[key];
            if (food.foodScript.getModel().getFoodId() == foodId) {
                food.destroy(true);
                delete this.foods[key];
                GameModel.getInstance().removeFoodModelById(foodId);
                return;
            }
        }
    }
}