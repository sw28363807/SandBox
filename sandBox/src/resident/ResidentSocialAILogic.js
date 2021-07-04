import RandomMgr from "../helper/RandomMgr";
import ResidentMeta from "../meta/ResidentMeta";
import GameModel from "../model/GameModel";

export default class ResidentSocialAILogic extends Laya.Script {

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


    processSocial(level1Results, level2Results) {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                let resident = this.owner.residentLogicScript.residentMgrInstance.getACanSocialResident(this.owner);
                if (resident) {
                    let talkingModel = GameModel.getInstance().getOrCreateTalkingPoint(this.owner.x, this.owner.y, 40, 5);
                    if (talkingModel.getTalkingNum() == 0) {
                        talkingModel.addTalkingNum(2);
                        this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                        resident.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                    } else {
                        talkingModel.addTalkingNum(1);
                        this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                    }
                    this.owner.AILogicScript.ideaResult = true;
                }
            })
        };
        let scocial = this.getModel().getSocial();
        if (scocial < ResidentMeta.ResidentSocialNeedValue) {
            level1Results.push(cell);
        } else if (RandomMgr.randomYes() && scocial < 100) {
            level2Results.push(cell);
        }
    }

    // 走到聊天点
    startJoinTalkingPoint(talkingModel) {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Walk);
        let pos = talkingModel.getTalkingPosInArea();
        this.owner.residentLogicScript.walkTo({
            x: pos.x,
            y: pos.y,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.TalkingAbout, talkingModel);
        }));
    }

    // 聊天
    onTalkingAbout(param) {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Enjoy);
        this.owner.residentLogicScript.setStateAniVisible(true);
        this.owner.residentLogicScript.setStateAni("ani6");
        Laya.timer.once(ResidentMeta.SocialTimeStep * 10,
            this.owner.residentLogicScript,
            this.owner.residentLogicScript.onDoWorkFinish,
            [this.owner.residentLogicScript.makeParam(param)]);
    }


    // 聊天结束
    onTalkingAboutFinished(param) {
        let talkingModel = param.extraParam;
        talkingModel.addTalkingNum(-1);
        this.model.addSocial(ResidentMeta.ResidentAddSocialBaseValue);
        if (talkingModel.getTalkingNum() == 0) {
            GameModel.getInstance().removeTalkingPoint(talkingModel.getTalkingPointId());
        }
    }
}