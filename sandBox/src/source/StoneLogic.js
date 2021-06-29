import Utils from "../helper/Utils";
import GameMeta from "../meta/GameMeta";

export default class StoneLogic extends Laya.Script {

    constructor() { 
        super();
        this.stoneID = 0;
    }
    
    onEnable() {
        // this.ani = this.owner.getChildByName("ani");
        Utils.setMapZOrder(this.owner);
    }

    onDisable() {
    }

    onStart() {
        // this.ani.play(0, true, "idle1");
    }

    setStoneID(id) {
        this.stoneID = id;
    }
}