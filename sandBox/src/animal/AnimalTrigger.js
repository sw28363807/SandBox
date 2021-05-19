import RandomMgr from "../helper/RandomMgr";
import GameContext from "../meta/GameContext";
import AnimalMeta from "./AnimalMeta";
import AnimalMgr from "./AnimalMgr";

export default class AnimalTrigger extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.curNum = 0;
    }

    onDisable() {
    }

    onStart() {
        this.owner.timer.loop(AnimalMeta.AnimalUpdateTime, this, function() {
            if (this.curNum >= AnimalMeta.AnimalMaxNumPerTrigger) {
                return;
            }
            let pos = RandomMgr.randomByArea(this.owner.x, this.owner.y, AnimalMeta.AnimalTriggerArea);
            AnimalMgr.getInstance().createAnimalByConfig({
                parent:GameContext.mapContainer,
                x: pos.x,
                y: pos.y,
                trigger: this
            }, Laya.Handler.create(this, function(obj) {
                
            }));
            this.addNum(1);
        });
    }

    // 增加一个计数
    addNum(num) {
        this.curNum = this.curNum + num;
        if (this.curNum >= AnimalMeta.AnimalMaxNumPerTrigger) {
            this.curNum = AnimalMeta.AnimalMaxNumPerTrigger;
        }
    }
}