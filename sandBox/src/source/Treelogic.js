import Utils from "../helper/Utils";
import GameMeta from "../meta/GameMeta";

export default class Treelogic extends Laya.Script {

    constructor() { 
        super();
        this.treeID = 0;
    }
    
    onEnable() {
        this.ani = this.owner.getChildByName("ani");
        Utils.setMapZOrder(this.owner);
    }

    onDisable() {
    }

    onStart() {
        this.ani.play(0, true, "idle1");
    }

    setTreeID(id) {
        this.treeID = id;
    }


}