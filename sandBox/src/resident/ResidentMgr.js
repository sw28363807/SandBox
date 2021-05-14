import RandomMgr from "../helper/RandomMgr";
import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import GameModel from "../model/GameModel";
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
        if (ResidentMgr.instance) {
            return ResidentMgr.instance
        }
        ResidentMgr.instance =  new ResidentMgr();
        ResidentMgr.instance.initSelf();
        return ResidentMgr.instance;
    }


    initSelf() {
        Laya.timer.loop(ResidentMeta.ResidentMakeIdeaStep, this, this.onMakeIdea);
    }

    onMakeIdea() {
        this.residents.forEach(function (item, idnex, array) {
            let script = item.getComponent(ResidentLogic);
            if (RandomMgr.randomYes()) {
                script.makeIdea();
            }
        });
    }

    ceateFunc(config, callback) {
        this.maxID++;
        Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let resident = prefabDef.create();
            resident.zOrder = GameMeta.ResidentZOrder;
            config.parent.addChild(resident);
            let script = resident.getComponent(ResidentLogic);
            let model = GameModel.getInstance().newResidentModel(config);
            script.refreshByModel(model);
            this.residents.push(resident);
            if (callback) {
                callback.runWith(resident);
            }
        }));
    }

    // 创建居民
    createResidentByConfig(config, callback) {
        if (Laya.loader.getRes("res/atlas/source/resident.atlas")) {
            this.ceateFunc(config, callback);
        } else {
            Laya.loader.load("res/atlas/source/resident.atlas",Laya.Handler.create(this, function() {
                this.ceateFunc(config, callback);
            }));
        }
    }
}