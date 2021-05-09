import EventMgr from "../helper/EventMgr";
import RandomMgr from "../helper/RandomMgr";
import GameMeta from "../meta/GameMeta";

export default class FoodTrigger extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.curNum = 0;
    }

    onDisable() {
    }

    onStart() {
        this.owner.timer.loop(5000, this, function() {
            if (this.curNum >= 1) {
                return;
            }
            let pos = RandomMgr.randomByArea(this.owner.x, this.owner.y, 200);
            EventMgr.getInstance().postEvent(GameMeta.ADD_FOOD_TO_MAP, pos);
            this.curNum++;
        });
    }
}