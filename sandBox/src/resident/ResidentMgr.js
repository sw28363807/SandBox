import MoveLogic from "../helper/MoveLogic";
import Utils from "../helper/Utils";
import ResidentMeta from "../meta/ResidentMeta";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";
import ResidentAILogic from "./ResidentAILogic";
import ResidentCreateBuildingAILogic from "./ResidentCreateBuildingAILogic";
import ResidentSendAILogic from "./ResidentSendAILogic";
import ResidentLogic from "./ResidentLogic";
import ResidentDoSomeThingAILogic from "./ResidentDoSomeThingAILogic";
import ResidentRandomWalkAILogic from "./ResidentRandomWalkAILogic";
import ResidentFindBlockForCreateAILogic from "./ResidentFindBlockForCreateAILogic";
import ResidentSocialAILogic from "./ResidentSocialAILogic";
import ResidentUseBuildingAILogic from "./ResidentUseBuildingAILogic";
import ResidentHuntAILogic from "./ResidentHuntAILogic";
import ResidentFightAILogic from "./ResidentFightAILogic";
import ResidentLookForLoverAILogic from "./ResidentLookForLoverAILogic";

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
        Laya.timer.loop(100, this, this.onUpdateZorder);
    }

    onUpdateZorder() {
        for (let key in this.residents) {
            let resident = this.residents[key];
            if (resident.residentLogicScript.pet) {
                Utils.setMapZOrder(resident.residentLogicScript.pet);
            }
            Utils.setMapZOrder(resident);
        }
    }

    onMakeIdea() {
        for (let key in this.residents) {
            let resident = this.residents[key];
            Utils.setMapZOrder(resident);
            resident.AILogicScript.makeIdea();
        }
    }

    // ??????????????????
    getResidentById(id) {
        return this.residents[String(id)];
    }

    // ????????????
    createResidentByConfig(config) {
        let prefabDef = Laya.loader.getRes(ResourceMeta.ResidentPrefabPath);
        let resident = prefabDef.create();
        config.parent.addChild(resident);
        this.initAllLogic(resident);
        let model = GameModel.getInstance().newResidentModel(config);
        resident.residentLogicScript.refreshByModel(model);
        resident.residentLogicScript.setResidentMgrInstance(this);
        this.residents[String(model.getResidentId())] = resident;
        return resident;
    }

    initAllLogic(resident) {
        let script = resident.getComponent(ResidentLogic);
        resident.residentLogicScript = script;
        let moveScript = resident.getComponent(MoveLogic);
        resident.residentMoveLogicScript = moveScript;
        let AIScript = resident.getComponent(ResidentAILogic);
        resident.AILogicScript = AIScript;
        let createBuildingScript = resident.getComponent(ResidentCreateBuildingAILogic);
        resident.createBuildingScript = createBuildingScript;
        let sendScript = resident.getComponent(ResidentSendAILogic);
        resident.sendScript = sendScript;
        let doSomeThingScript = resident.getComponent(ResidentDoSomeThingAILogic);
        resident.doSomeThingScript = doSomeThingScript;
        let randomWalkScript = resident.getComponent(ResidentRandomWalkAILogic);
        resident.randomWalkScript = randomWalkScript;
        let findBlockForCreateScript = resident.getComponent(ResidentFindBlockForCreateAILogic);
        resident.findBlockForCreateScript = findBlockForCreateScript;
        let socialScript = resident.getComponent(ResidentSocialAILogic);
        resident.socialScript = socialScript;
        let useBuildingScript = resident.getComponent(ResidentUseBuildingAILogic);
        resident.useBuildingScript = useBuildingScript;
        let huntScript = resident.getComponent(ResidentHuntAILogic);
        resident.huntScript = huntScript;
        let fightScript = resident.getComponent(ResidentFightAILogic);
        resident.fightScript = fightScript;
        let lookForLoverScript = resident.getComponent(ResidentLookForLoverAILogic);
        resident.lookForLoverScript = lookForLoverScript;
    }

    // ????????????
    removeResidentById(id) {
        let resident = this.residents[String(id)];
        if (resident) {
            let myModel = resident.residentLogicScript.getModel();
            let pet = resident.residentLogicScript.getPet()
            if (pet) {
                pet.destroy(true);
            }
            // ?????????????????????????????????
            for (const key in this.residents) {
                let other = this.residents[key];
                let otherModel = other.residentLogicScript.getModel();
                if (otherModel.getLoverId() == id) {
                    otherModel.setLoverId(0);
                }
                if (myModel.getSex() == 1) {
                    if (otherModel.getMyHomeId() == myModel.getMyHomeId()) {
                        otherModel.setMyHomeId(0);
                    }
                }
            }
            delete this.residents[String(id)];
            resident.destroy(true);
            GameModel.getInstance().removeResientModel(id);

        }
    }

    // ??????????????????????????????
    getACanSocialResident(owner) {
        let x = owner.x;
        let y = owner.y;
        let idles = [];
        let needs = [];
        for (const key in this.residents) {
            let item = this.residents[key];
            let model = item.residentLogicScript.getModel();
            let distance = new Laya.Point(x, y).distance(item.x, item.y);
            if (owner != item && distance <= ResidentMeta.ResidentSocialArea) {
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

    // ???????????????????????????
    getACanFightResident(residentModel, x, y) {
        let idles = [];
        let needs = [];
        for (const key in this.residents) {
            let item = this.residents[key];
            let model = item.residentLogicScript.getModel();
            let distance = new Laya.Point(x, y).distance(item.x, item.y);
            if (residentModel.getResidentId() != model.getResidentId()
                && distance <= ResidentMeta.ResidentFightArea) {
                if (model.getFSMState() == ResidentMeta.ResidentState.IdleState) {
                    idles.push(item);
                    if (model.getSocial() < ResidentMeta.ResidentSocialLowToFight) {
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



    // ?????????????????????????????????
    getCanMarryWoman(manModel) {
        for (const key in this.residents) {
            let item = this.residents[key];
            let model = item.residentLogicScript.getModel();
            if (model.canMarry(manModel)) {
                return item;
            }
        }
        return null;
    }

    // ????????????????????????

}