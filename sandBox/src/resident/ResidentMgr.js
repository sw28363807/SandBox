import GameMeta from "../meta/GameMeta";
import ResidentLogic from "./ResidentLogic";

export default class ResidentMgr extends Laya.Script {

    constructor() { 
        super();
        this.residents = [];
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        let ret = ResidentMgr.instance = ResidentMgr.instance || new ResidentMgr();
        ret.initSelf();
        return ret
    }

    initSelf() {
        // 数值计算定时器
        Laya.timer.loop(5000, this, function () {
            this.residents.forEach(function (item, idnex, array) {
                let script = item.getComponent(ResidentLogic);
                script.food = script.food - 1;
            });
        });
    }

    // 创建居民
    createResidentByConfig(config, callback) {
        Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let resident = prefabDef.create();
            config.parent.addChild(resident);
            let script = resident.getComponent(ResidentLogic);
            if (config.x) {
                resident.x = config.x;
            }
            if (config.y) {
                resident.y = config.y;   
            }
            if (config.sex) {
                script.sex = config.sex;
            }
            this.residents.push(resident);
            if (callback) {
                callback.runWith(resident);
            }
        }));
    }
}