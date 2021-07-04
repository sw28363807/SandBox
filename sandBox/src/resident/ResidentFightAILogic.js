import RandomMgr from "../helper/RandomMgr";
import ResidentMeta from "../meta/ResidentMeta";
import GameModel from "../model/GameModel";

export default class ResidentFightAILogic extends Laya.Script {

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

    processFight(level1Results, level2Results) {
        let cell = {
            func: Laya.Handler.create(this, function () {
                let resident = this.owner.residentLogicScript.residentMgrInstance.getACanFightResident(this.getModel(), this.owner.x, this.owner.y);
                if (resident) {
                    let fightModel = GameModel.getInstance().getOrCreateFightPoint(this.owner.x, this.owner.y, 30, 5);
                    if (fightModel.getFightNum() == 0) {
                        fightModel.addFightNum(2);
                        this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
                        resident.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
                    } else {
                        fightModel.addFightNum(1);
                        this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
                    }
                    this.owner.AILogicScript.ideaResult = true;
                }
            })
        };
        if (this.getModel().getSocial() < ResidentMeta.ResidentSocialLowToFight &&
            GameModel.getInstance().getAllResidentNum() >= ResidentMeta.ResidentFightNum) {
            level2Results.push(cell);
        }
        level2Results.push(cell);
    }

    // 走到打架点
    startJoinFightPoint(fightModel) {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Walk);
        let pos = fightModel.getFightPosInArea();
        this.owner.residentLogicScript.walkTo({
            x: pos.x,
            y: pos.y,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.Fighting, fightModel);
        }));
    }

    // 打架
    onFight(param) {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Anger, null, RandomMgr.randomYes() ? "left" : "right");
        this.owner.residentLogicScript.setStateAniVisible(true);
        this.owner.residentLogicScript.setStateAni("ani8");
        Laya.timer.once(ResidentMeta.SocialFightStep * 10,
            this.owner.residentLogicScript,
            this.owner.residentLogicScript.onDoWorkFinish,
            [this.owner.residentLogicScript.makeParam(param)]);
    }

    // 打架结束
    onFightFinished(param) {
        let fightModel = param.extraParam;
        fightModel.addFightNum(-1);
        this.getModel().addLife(-ResidentMeta.ResidentFightReduceValue);
        if (fightModel.getFightNum() == 0) {
            GameModel.getInstance().removeFightPoint(fightModel.getFightPointId());
        } 
    }

}