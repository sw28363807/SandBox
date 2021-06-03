import Utils from "../helper/Utils";
import GameContext from "../meta/GameContext";
import GameMeta from "../meta/GameMeta";

export default class Waterlogic extends Laya.Script {

    constructor() { 
        super();
        this.waterID = 0;
    }

    
    setWaterID(id) {
        this.waterID = id;
    }
    
    onEnable() {
        Utils.setMapZOrder(this.owner, -GameContext.mapHeight);
    }

    onDisable() {
    }

    onStart() {

    }
}