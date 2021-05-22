import RandomMgr from "../helper/RandomMgr";
import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import GameModel from "../model/GameModel";
import ResidentLogic from "./ResidentLogic";

export default class ResidentMgr extends Laya.Script {

    constructor() {
        super();
        this.residents = {};
    }

    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        if (ResidentMgr.instance) {
            return ResidentMgr.instance
        }
        ResidentMgr.instance = new ResidentMgr();
        ResidentMgr.instance.initSelf();
        return ResidentMgr.instance;
    }

    initSelf() {
        Laya.timer.loop(ResidentMeta.ResidentMakeIdeaStep, this, this.onMakeIdea);
    }

    onMakeIdea() {
        for (let key in this.residents) {
            let resident = this.residents[key];
            let script = resident.getComponent(ResidentLogic);
            if (RandomMgr.randomYes(0.2)) {
                script.makeIdea();
            }
        }
    }

    ceateFunc(config, callback) {
        Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let resident = prefabDef.create();
            config.parent.addChild(resident);
            let script = resident.getComponent(ResidentLogic);
            let model = GameModel.getInstance().newResidentModel(config);
            script.refreshByModel(model);
            script.setResidentMgrInstance(this);
            this.residents[String(model.getResidentId())] = resident;
            if (callback) {
                callback.runWith(resident);
            }
        }));
    }

    // 获得一个居民
    getResidentById(id) {
        return this.residents[String(id)];
    }

    // 创建居民
    createResidentByConfig(config, callback) {
        if (Laya.loader.getRes("res/atlas/source/resident.atlas")) {
            this.ceateFunc(config, callback);
        } else {
            Laya.loader.load("res/atlas/source/resident.atlas", Laya.Handler.create(this, function () {
                this.ceateFunc(config, callback);
            }));
        }
    }

    // 移除居民
    removeResidentById(id) {
        let resident = this.residents[String(id)];
        if (resident) {
            delete this.residents[String(id)];
            resident.destroy(true);
            GameModel.getInstance().removeResientModel(id);
        }
    }

    // 获得一个清闲或者没事干的人
    getACanSocialResident(x, y) {
        let idles = [];
        let needs = [];
        for (const key in this.residents) {
            let item = this.residents[key];
            let script = item.getComponent(ResidentLogic);
            let model = script.getModel();
            let distance = new Laya.Point(x, y).distance(item.x, item.y);
            if (distance <= ResidentMeta.ResidentSocialArea) {
                if (model.getFSMState() == ResidentMeta.ResidentState.IdleState) {
                    idles.push(item);
                    if (model.getSocial() < ResidentMeta.ResidentSocialNeedValue) {
                        needs.push(item);
                    }
                }   
            }
        }
        if (needs.length != 0) {
            return needs[0];
        }
        if (idles.length != 0) {
            return idles[0];
        }
        return null;
    }

    // 获得一个可以结婚的女性
    getCanMarryWoman() {
        for (const key in this.residents) {
            let item = this.residents[key];
            let script = item.getComponent(ResidentLogic);
            let model = script.getModel();
            if (model.canMarry()) {
                return item;
            }
        }
        return null;
    }
}