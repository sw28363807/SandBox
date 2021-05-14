import RandomMgr from "../helper/RandomMgr";
import GameContext from "../meta/GameContext";
import GameMeta from "../meta/GameMeta";
import FoodMgr from "./FoodMgr";

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
        this.owner.timer.loop(GameMeta.FoodUpdateTime, this, function() {
            if (this.curNum >= GameMeta.FoodMaxNumPerTrigger) {
                return;
            }
            let pos = RandomMgr.randomByArea(this.owner.x, this.owner.y, GameMeta.FoodTriggerArea);
            FoodMgr.getInstance().createFoodByConfig({
                parent:GameContext.mapContainer,
                x: pos.x,
                y: pos.y
            }, Laya.Handler.create(this, function(obj) {
                
            }));
            this.curNum++;
        });
    }
}