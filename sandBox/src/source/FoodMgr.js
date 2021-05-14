import GameMeta from "../meta/GameMeta";

export default class FoodMgr extends Laya.Script {

    constructor() { 
        super();
        this.foods = [];
    }
    
    static getInstance() {
        return FoodMgr.instance = FoodMgr.instance || new FoodMgr();
    }

    // 创建食物
    createFoodByConfig(config, callback) {
        Laya.loader.create(GameMeta.FoodPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let food = prefabDef.create();
            config.parent.addChild(food);
            food.x = config.x;
            food.y = config.y;
            this.foods.push(food);
            if (callback) {
                callback.runWith(food);
            }
        }));
    }

    // 获得距离最近的一个食物
    getNearstFood(x, y) {
        let distance = 99999999;
        let ret = null;
        for (let index = 0; index < this.foods.length; index++) {
            let food = this.foods[index];
            let curDistance = new Laya.Point(food.x, food.y).distance(x, y);
            if (curDistance < distance) {
                distance = curDistance;
                ret = food;
            }
        }
        return ret;
    }
}