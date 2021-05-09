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
    getNearestFood(x, y) {
        this.foods.forEach(function (item, idnex, array) {

        });
    }
}