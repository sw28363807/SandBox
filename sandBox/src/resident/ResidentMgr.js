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

    static getInstance() {
        return ResidentMgr.instance = ResidentMgr.instance || new ResidentMgr();
    }

    // 创建居民
    createResidentByConfig(config, callback) {
        Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let resident = prefabDef.create();
            config.parent.addChild(resident);
            if (callback) {
                callback.runWith(resident);
            }
        }));
    }
}