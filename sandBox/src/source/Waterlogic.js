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
    }

    onDisable() {
    }

    onStart() {

    }
}