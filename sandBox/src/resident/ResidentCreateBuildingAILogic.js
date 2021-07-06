import EventMgr from "../helper/EventMgr";
import GameEvent from "../meta/GameEvent";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentHelper from "./ResidentHelper";

export default class ResidentCreateBuildingAILogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.model = this.owner.residentLogicScript.getModel();
    }

    getModel() {
        return this.model;
    }

    processCreateBuilding(level1Results, level2Results) {
        if (this.getModel().getAge() >= ResidentMeta.ResidentAdultAge) {
            let createCell = {
                func: Laya.Handler.create(this, function () {
                    let AIInfo = ResidentHelper.getAIGoToCreateBuildingInfo(this.owner.x, this.owner.y);
                    if (AIInfo) {
                        this.owner.residentLogicScript.refreshFSMState(AIInfo.state, AIInfo.building);
                        this.owner.AILogicScript.ideaResult = true;
                    }
                }),
            };
            level2Results.push(createCell);
        }
    }

    canGotoCreateBuilding(fsmState) {
        let value = ResidentMeta.ResidentContinueCreateMap[String(fsmState)];
        if (value) {
            return value.nextState;
        }
        return null;
    }

    canStartCreateBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentContinueCreateMap) {
            let value = ResidentMeta.ResidentContinueCreateMap[key];
            if (value && value.nextState == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canFinishCreateBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentContinueCreateMap) {
            let value = ResidentMeta.ResidentContinueCreateMap[key];
            if (value && value.nextState == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
            if (Number(key) == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }


    // 继续去建造建筑
    startGotoContinueCreateBuilding(config) {
        EventMgr.getInstance().registEvent(GameEvent.CREATE_BUILDING_FINISH, this.owner.residentLogicScript, this.owner.residentLogicScript.onDoWorkFinish);
        this.continueCreateBuilding = config.building;
        let nextState = config.nextState;
        this.continueCreateBuilding.buildingScript.joinResidentIdToBuildingForCreate(this.getModel().getResidentId());
        this.owner.residentLogicScript.walkTo({
            x: this.continueCreateBuilding.x + this.continueCreateBuilding.width / 2 - this.owner.width / 2,
            y: this.continueCreateBuilding.y + this.continueCreateBuilding.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(nextState, this.continueCreateBuilding);
        }));
    }

    // 建造建筑
    startCreateBuilding() {
        if (this.continueCreateBuilding) {
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani2");
            this.continueCreateBuilding.buildingScript.startCreate();
        }
    }

    clearContinueCreateBuilding() {
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_BUILDING_FINISH, this.owner.residentLogicScript, this.owner.residentLogicScript.onDoWorkFinish);
        this.continueCreateBuilding = null;
    }
}