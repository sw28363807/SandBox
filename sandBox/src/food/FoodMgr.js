import GameMeta from "../meta/GameMeta";

export default class FoodMgr extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
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
            if (callback) {
                callback.runWith(food);
            }
        }));
    }
}