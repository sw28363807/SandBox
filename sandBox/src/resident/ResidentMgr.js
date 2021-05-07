import GameMeta from "../meta/GameMeta";
import ResidentLogic from "./ResidentLogic";

export default class ResidentMgr extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    // 创建居民
    static createResidentByConfig(config, callback) {
        Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let resident = prefabDef.create();
            let residentLogic = new ResidentLogic(config);
            resident.addComponentIntance(residentLogic);
            if (callback) {
                callback.runWith(resident);
            }
        }));
    }
}