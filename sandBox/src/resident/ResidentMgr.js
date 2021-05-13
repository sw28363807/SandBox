import RandomMgr from "../helper/RandomMgr";
import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentLogic from "./ResidentLogic";

export default class ResidentMgr extends Laya.Script {

    constructor() { 
        super();
        this.residents = [];
        this.maxID = 0;
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
        // 数值计算定时器
        let step = 0;
        Laya.timer.loop(1000, this, function () {
            // 做决策略
            let num = this.residents.length
            this.residents.forEach(function (item, idnex, array) {
                let script = item.getComponent(ResidentLogic);
                // if (RandomMgr.randomYes()) {
                    
                // } 
                script.makeIdea();
            });

            // 数值
            if (step == 5) {
                this.residents.forEach(function (item, idnex, array) {
                    let script = item.getComponent(ResidentLogic);
                    // if (RandomMgr.randomYes()) {
                    //     // 减少食物
                    //     script.food = script.food - 1;
                    //     if (script.food < 0) {
                    //         script.food = 0;
                    //     }                   
                    // }
                    // if (RandomMgr.randomYes()) {
                    //     // 减少水源
                    //     script.water = script.water - 1;
                    //     if (script.water < 0) {
                    //         script.water = 0;
                    //     }                   
                    // }
                });
                step = 0; 
            }
            step++;
        });
    }

    ceateFunc(config, callback) {
        this.maxID++;
        Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let resident = prefabDef.create();
            resident.zOrder = GameMeta.ResidentZOrder;
            config.parent.addChild(resident);
            let script = resident.getComponent(ResidentLogic);
            script.refreshInfo(config);
            this.residents.push(resident);
            if (callback) {
                callback.runWith(resident);
            }
        }));
    }

    // 创建居民
    createResidentByConfig(config, callback) {
        if (Laya.loader.getRes("res/atlas/source/resident.atlas")) {
            // this.ceateFunc(config, callback);
        } else {
            Laya.loader.load("res/atlas/source/resident.atlas",Laya.Handler.create(this, function() {
                this.ceateFunc(config, callback);
            }));
        }
    }
}