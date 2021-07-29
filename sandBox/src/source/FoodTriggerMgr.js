import FoodTrigger from "./FoodTrigger";

export default class FoodTriggerMgr extends Laya.Script {

    constructor() { 
        super();
        this.triggers = {};
    }

    static getInstance() {
        return FoodTriggerMgr.instance = FoodTriggerMgr.instance || new FoodTriggerMgr();
    }

    // 添加触发器
    pushFoodTrigger(trigger) {
        let script = trigger.getComponent(FoodTrigger);
        if (script && script.foodTriggerKey != "") {
            this.triggers[script.foodTriggerKey] = trigger;
        }
    }

    // 食物触发器是否有碰撞
    intersectsFoodTrigger(x, y, w, h) {
        let cur = new Laya.Rectangle(x, y, w, h);
        for (let key in this.triggers) {
            let item = this.triggers[key];
            if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                return true;
            }
        }
        return false;
    }
    
    onEnable() {
    }

    onDisable() {
    }
}