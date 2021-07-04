import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import GameContext from "../meta/GameContext";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentDetailsPanelMgr from "../panel/ResidentDetailsPanelMgr";
import TreeMgr from "../source/TreeMgr";
import StoneMgr from "../source/StoneMgr";
import FoodMgr from "../source/FoodMgr";
import WaterMgr from "../source/WaterMgr";
import FoodMeta from "../meta/FoodMeta";
import GameModel from "../model/GameModel";
import EventMgr from "../helper/EventMgr";
import GameEvent from "../meta/GameEvent";
import BuildingMeta from "../meta/BuildingMeta";
import AnimalMgr from "../animal/AnimalMgr";
import AnimalLogic from "../animal/AnimalLogic";
import ResidentTipMeta from "../meta/ResidentTipMeta";
import ResidentHelper from "./ResidentHelper";
import GameMeta from "../meta/GameMeta";
import ResourceMeta from "../meta/ResourceMeta";
import PetLogic from "../animal/PetLogic";


export default class ResidentLogic extends Laya.Script {

    constructor() {
        super();
    }

    onStart() {
        // Laya.timer.once(1000, this, function () {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindWater);
        // });
        this.initMoveLogic();
    }

    onEnable() {
        this.rigsterAllEvents();
        this.initModel();
        this.initControl();
        this.initTouch();
    }

    onDisable() {
        this.removeAllEvents();
        this.removeAllTimers();
    }

    onDestroy() {
    }

    initMoveLogic() {
        let owner = this;
        this.leftFunc = function () {
            owner.ani.play(0, true, "walk_left");
        };
        this.rightFunc = function () {
            owner.ani.play(0, true, "walk_right");
        };
        this.upFunc = function () {
            owner.ani.play(0, true, "walk_up");
        };
        this.downFunc = function () {
            owner.ani.play(0, true, "walk_down");
        };
        this.getMoveScript().setCallbackFunc({
            leftFunc: this.leftFunc,
            rightFunc: this.rightFunc,
            upFunc: this.upFunc,
            downFunc: this.downFunc,
        });
    }

    removeAllTimers() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        Laya.timer.clear(this, this.hideTip);
    }

    // 注册消息
    rigsterAllEvents() {
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_SICK, this, this.onSick);
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_DIE, this, this.onDie);
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_GROWUP, this, this.onGrowUp);
    }

    removeAllEvents() {
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_SICK, this, this.onSick);
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_DIE, this, this.onDie);
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_GROWUP, this, this.onGrowUp);
    }

    //初始化控件
    initControl() {
        this.initAnim();
        this.stateAni = this.owner.getChildByName("stateAni");
        this.buffAni = this.owner.getChildByName("buff");
        this.tipSpr = this.owner.getChildByName("tipSpr");
        this.boredTip = this.tipSpr.getChildByName("text");
        this.hideTip();
        this.setStateAniVisible(false);
        this.setBuffAniVisible(false);
    }

    initAnim() {
        this.manAni = this.owner.getChildByName("manAni");
        this.womanAni = this.owner.getChildByName("womanAni");
        this.babyAni = this.owner.getChildByName("babyAni");
        this.manAni.stop();
        this.womanAni.stop();
        this.babyAni.stop();
        this.manAni.visible = false;
        this.womanAni.visible = false;
        this.babyAni.visible = false;
    }

    onGrowUp(residentModel) {
        if (this.model.getResidentId() != residentModel.getResidentId()) {
            return;
        }
        this.growup();
    }

    onDie(residentModel) {
        if (this.model.getResidentId() != residentModel.getResidentId()) {
            return;
        }
        this.refreshFSMState(ResidentMeta.ResidentState.Die);
    }

    // 生病回调
    onSick(residentModel) {
        if (this.model.getResidentId() != residentModel.getResidentId()) {
            return;
        }
        let sick = residentModel.getSick();
        // 生病
        if (sick == 2) {
            this.setBuffAni("sickAni");
            this.setBuffAniVisible(true);
        } else {
            this.stopBuffAni();
            this.setBuffAniVisible(false);
        }
    }

    // 隐藏tip
    hideTip() {
        if (this.tipTweenObject) {
            Laya.Tween.clear(this.tipTweenObject);
            this.tipTweenObject = null;
        }
        Laya.timer.clear(this, this.hideTip);
        this.tipSpr.scaleX = 0;
        this.tipSpr.scaleY = 0;
        this.tipSpr.visible = false;
        this.boredTip.text = "";
    }

    // 显示Tip
    showTip(text, forceShow) {
        if (forceShow == null || forceShow == undefined) {
            forceShow = false;
        }
        if (this.tipTweenObject && forceShow == false) {
            return;
        }
        this.hideTip();
        this.boredTip.text = text;
        this.tipSpr.visible = true;
        this.tipTweenObject = Laya.Tween.to(this.tipSpr, { scaleX: 1, scaleY: 1 }, 200,
            Laya.Ease.backIn, Laya.Handler.create(this, function () {
            }));
        Laya.timer.once(3000, this, this.hideTip);
    }

    setBuffAni(aniName) {
        this.buffAni.play(0, true, aniName);
    }

    setBuffAniVisible(visible) {
        this.buffAni.visible = visible;
    }

    stopBuffAni() {
        this.buffAni.stop();
    }

    setStateAni(aniName) {
        this.stateAni.play(0, true, aniName);
    }

    setStateAniVisible(visible) {
        this.stateAni.visible = visible;
    }

    stopStateAni() {
        this.stateAni.stop();
    }

    //初始化属性
    initModel() {
        this.findCreateBuildingTimes = 0;   //寻找盖房地点的次数
        this.curStateAnim = ResidentMeta.ResidentAnim.Null;
    }

    initTouch() {
        this.owner.on(Laya.Event.CLICK, this, function () {
            ResidentDetailsPanelMgr.getInstance().showPanel({
                data: this.model,
                parent: this.owner
            });
        });
    }

    // 设置manager
    setResidentMgrInstance(instance) {
        this.residentMgrInstance = instance;
    }


    // 刷新数据
    refreshByModel(model) {
        this.model = model;
        this.owner.x = this.model.getX();
        this.owner.y = this.model.getY();

        if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
            this.ani = this.babyAni;
            if (this.model.getSex() == 1) {
                this.womanAni.destroy(true);
                this.womanAni = null;
            } else {
                this.manAni.destroy(true);
                this.manAni = null;
            }
        } else {
            if (this.model.getSex() == 1) {
                this.ani = this.manAni;
                this.womanAni.destroy(true);
                this.womanAni = null;
            } else {
                this.ani = this.womanAni;
                this.manAni.destroy(true);
                this.manAni = null;
            }
        }
        this.ani.visible = true;
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    getModel() {
        return this.model;
    }

    // 长大
    growup() {
        let animName = this.curStateAnim;
        let loop = this.curStateAnimLoop;
        let visible = this.ani.visible;
        this.curStateAnim = "";
        this.babyAni.destroy(true);
        this.babyAni = null;
        if (this.model.getSex() == 1) {
            this.ani = this.manAni;
        } else if (this.model.getSex() == 2) {
            this.ani = this.womanAni;
        }
        this.ani.visible = visible;
        this.setAnim(animName, loop);
    }

    // 设置动画
    setAnim(anim, loop, param) {
        if (this.curStateAnim == anim) {
            return;
        }
        if (loop == undefined || loop == null) {
            loop = true;
        }
        if (anim == ResidentMeta.ResidentAnim.Idle) {
            this.ani.play(0, loop, "idle");
        } else if (anim == ResidentMeta.ResidentAnim.Walk) {

        } else if (anim == ResidentMeta.ResidentAnim.Enjoy) {
            this.ani.play(0, loop, "enjoy");
        } else if (anim == ResidentMeta.ResidentAnim.Work) {
            this.ani.play(0, loop, "work");
        } else if (anim == ResidentMeta.ResidentAnim.Die) {
            this.ani.play(0, loop, "die");
        } else if (anim == ResidentMeta.ResidentAnim.Anger) {
            if (param == "right") {
                this.ani.play(0, loop, "anger_right");
            } else {
                this.ani.play(0, loop, "anger_left");
            }
        }
        this.curStateAnim = anim;
        this.curStateAnimLoop = loop;
    }

    stopAni() {
        this.curStateAnim = null;
        this.ani.stop();
    }

    setVisible(visible) {
        this.owner.visible = visible;
    }

    getMoveScript() {
        return this.owner.residentMoveLogicScript;
    }

    //  设置状态机状态
    refreshFSMState(state, param) {
        let curState = this.model.getFSMState();
        if (curState == state) {
            return;
        }
        if (curState == ResidentMeta.ResidentState.Die) {
            return;
        }
        this.model.setFSMState(state);
        this.setStateAniVisible(false);
        this.setVisible(true);
        this.stopStateAni();
        this.stopAni();
        this.getMoveScript().stopGoto();
        Laya.timer.clear(this, this.onDoWorkFinish);
        let createBuildingNextState = this.owner.createBuildingScript.canGotoCreateBuilding(state);
        let useBuildingNextState = this.owner.useBuildingScript.canGotoUseBuilding(state);
        let sendAIMeta = this.owner.sendScript.canSendExt(state);
        let canCollect = this.owner.sendScript.canCollect(state);
        let canSendToDest = this.owner.sendScript.canSendToDest(state);
        let canFindBlockForCreateBuilding = this.owner.findBlockForCreateScript.canFindCreateBuildingBlock(state);
        let useData = this.owner.useBuildingScript.canStartUseBuilding(state);
        let canGotoTargetExt = this.owner.doSomeThingScript.canGotoTargetExt(state);
        let canDOSomeThing = this.owner.doSomeThingScript.canDoSomeThingExt(state);
        // 能否走过去做某些事情
        if (canGotoTargetExt) {
            this.owner.doSomeThingScript.gotoTargetForDoSomeThing(state, param);
        }
        // 是否要做某些事情
        else if (canDOSomeThing) {
            this.owner.doSomeThingScript.doSomeThing(state, param);
        }
        // 是否要继续建造
        else if (createBuildingNextState) {
            this.owner.createBuildingScript.startGotoContinueCreateBuilding({
                building: param,
                nextState: createBuildingNextState
            });
        }
        // 是否要去使用建筑
        else if (useBuildingNextState) {
            this.owner.useBuildingScript.startGotoBuildingForUse({
                building: param,
                nextState: useBuildingNextState.nextState
            });
        }
        else if (this.owner.createBuildingScript.canStartCreateBuilding(state)) {
            this.owner.createBuildingScript.startCreateBuilding();
        }
        else if (useData) {
            this.owner.useBuildingScript.startUseBuilding(useData);
        }
        // 送货
        else if (sendAIMeta) {
            this.owner.sendScript.gotoFindSend({
                sendAIMeta: sendAIMeta,
                sendInfo: param
            });
        }
        // 能够打包货物
        else if (canCollect) {
            this.owner.sendScript.colletSend(param);
        }
        // 是否能够送打包物品到目标
        else if (canSendToDest) {
            this.owner.sendScript.gotoSendToDest(param);
        }
        // 待机
        else if (state == ResidentMeta.ResidentState.IdleState) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
        }
        // 搜寻
        else if (canFindBlockForCreateBuilding) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.owner.findBlockForCreateScript.findCreateBuildingTimes = 0;
            this.owner.findBlockForCreateScript.startFindCreateBuildingBlock(param);
        }
        // 恋爱男方
        else if (state == ResidentMeta.ResidentState.LoverMan) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.setStateAniVisible(true);
            this.setStateAni("ani5");
            this.startFindWoman();
        }
        // 恋爱女方
        else if (state == ResidentMeta.ResidentState.LoverWoman) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.setStateAniVisible(true);
            this.setStateAni("ani5");
        }
        // 两口子一起回家
        else if (state == ResidentMeta.ResidentState.LoverGoHomeMakeLove) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.setStateAniVisible(true);
            this.setStateAni("ani5");
            this.startGoHomeAndWoman();
        }
        // 生孩子
        else if (state == ResidentMeta.ResidentState.LoverMakeLove) {
            this.setVisible(false);
            this.startMakelove();
        }
        // 加入到聊天中
        else if (state == ResidentMeta.ResidentState.JoinTalking) {
            this.owner.socialScript.startJoinTalkingPoint(param);
        }
        // 聊天
        else if (state == ResidentMeta.ResidentState.TalkingAbout) {
            this.owner.socialScript.onTalkingAbout(param);
        }
        // 加入到打架中
        else if (state == ResidentMeta.ResidentState.JoinFight) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startJoinFightPoint(param);
        }
        // 打架
        else if (state == ResidentMeta.ResidentState.Fighting) {
            this.setAnim(ResidentMeta.ResidentAnim.Anger, null, RandomMgr.randomYes() ? "left" : "right");
            this.setStateAniVisible(true);
            this.setStateAni("ani8");
            Laya.timer.once(ResidentMeta.SocialFightStep * 10, this, this.onDoWorkFinish, [this.makeParam(param)]);
        }
        // 赶去打猎
        else if (state == ResidentMeta.ResidentState.JoinHunt) {
            this.owner.huntScript.startJoinHunt(param);
        }
        // 赶去打猎完成
        else if (state == ResidentMeta.ResidentState.Hunting) {
            this.owner.huntScript.onHunting();
        }
        // 死亡
        else if (state == ResidentMeta.ResidentState.Die) {
            this.setBuffAniVisible(false);
            this.setStateAniVisible(false);
            this.setAnim(ResidentMeta.ResidentAnim.Die, false);
            Laya.timer.once(ResidentMeta.DieTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
        // 随机走一个位置
        else if (state == ResidentMeta.ResidentState.RandomWalk) {
            this.owner.randomWalkScript.startGotoRandomPoint(param);
        }
    }

    doWorkFinishClearFunc() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    // 工作完成
    onDoWorkFinish(param) {
        if (!param.residentIds.has(this.getModel().getResidentId())) {
            return;
        }
        let state = this.model.getFSMState();
        // 建造完成
        if (this.owner.createBuildingScript.canFinishCreateBuilding(state)) {
            this.owner.createBuildingScript.clearContinueCreateBuilding();
        }
        // 使用完成
        else if (this.owner.useBuildingScript.canFinishUseBuilding(state)) {
            this.owner.useBuildingScript.onFinishUseBuilding(state);
            this.owner.useBuildingScript.clearUseBuilding();
        }
        // 打包送货完成 
        else if (this.owner.sendScript.canSendFinish(state)) {
            this.owner.sendScript.onFinishSend(param);
        }
        else if (this.owner.doSomeThingScript.canDoSomeThingExt(state)) {
            this.owner.doSomeThingScript.onFinishDoSomeThing(state);
        }
        // 聊天结束
        else if (state == ResidentMeta.ResidentState.TalkingAbout) {
            this.owner.socialScript.onTalkingAboutFinished(param);
        }
        // 打架结束
        else if (state == ResidentMeta.ResidentState.Fighting) {
            let fightModel = param.extraParam;
            fightModel.addFightNum(-1);
            this.model.addLife(-ResidentMeta.ResidentFightReduceValue);
            if (fightModel.getFightNum() == 0) {
                GameModel.getInstance().removeFightPoint(fightModel.getFightPointId());
            }
        }
        // 正在赶去打猎
        else if (state == ResidentMeta.ResidentState.JoinHunt || state == ResidentMeta.ResidentState.Hunting) {
            this.owner.huntScript.onHuntFinished();
        }
        else if (state == ResidentMeta.ResidentState.Die) {
            BuildingMgr.getInstance().removeBuildingById(this.model.getMyHomeId());
            this.residentMgrInstance.removeResidentById(this.model.getResidentId());
            return;
        }
        else if (state == ResidentMeta.ResidentState.CreateHome) {
            this.clearContinueCreateBuilding();
        }
        this.doWorkFinishClearFunc();
    }

    // 走到打架点
    startJoinFightPoint(fightModel) {
        let pos = fightModel.getFightPosInArea();
        this.walkTo({
            x: pos.x,
            y: pos.y,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.Fighting, fightModel);
        }));
    }

    // 开始生孩子
    startMakelove() {
        if (this.model.getSex() == 1) {
            let myHome = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
            let homeScript = myHome.buildingScript;
            homeScript.startMakeLove(Laya.Handler.create(this, function () {
                let womanId = this.model.getLoverId();
                let woman = this.residentMgrInstance.getResidentById(womanId);
                woman.y += ResidentMeta.ResidentGotoYOff;
                this.owner.y += ResidentMeta.ResidentGotoYOff;
                woman.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);

                this.residentMgrInstance.createResidentByConfig({
                    parent: GameContext.mapContainer,
                    x: woman.x,
                    y: woman.y,
                    age: 1,
                    sex: GameModel.getInstance().randomSex(),
                    food: 70,
                    water: 70,
                });
            }));
        }
        this.model.recordMakeLoveSystemTime();
    }
    // 开始去找即将要成亲的女方
    startFindWoman() {
        let womanId = this.model.getLoverId();
        let woman = this.residentMgrInstance.getResidentById(womanId);
        if (woman) {
            this.walkTo({
                x: woman.x + woman.width,
                y: woman.y,
            }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.LoverGoHomeMakeLove);
                woman.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.LoverGoHomeMakeLove);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    // 和媳妇一起回家生孩子
    startGoHomeAndWoman() {
        let myHome = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
        if (myHome) {
            this.walkTo({
                x: myHome.x + myHome.width / 2 - this.owner.width / 2,
                y: myHome.y + myHome.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
                forceFirstY: true,
            }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.LoverMakeLove);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    walkTo(config, handler) {
        this.getMoveScript().gotoDest(config, handler);
        if (this.getPet()) {
            let copyConfig = {
                x: config.x + 60,
                y: config.y - 40,
                forceFirstY: config.isFirstY,
            };
            Laya.timer.once(1000, this, function () {
                this.getPetScript().walkTo(copyConfig);
            });
        }
    }

    makeParam(extraParam) {
        let ret = {};
        ret.residentIds = new Set([this.model.getResidentId()]);
        ret.extraParam = extraParam;
        return ret;
    }

    // processHunt() {
    //     let cell = {
    //         func: Laya.Handler.create(this, function (param) {
    //             let animal = AnimalMgr.getInstance().getAnimalForAttack(this.owner.x, this.owner.y, 2000);
    //             if (animal) {
    //                 this.refreshFSMState(ResidentMeta.ResidentState.JoinHunt, animal);
    //                 this.ideaResult = true;
    //             }
    //         })
    //     };
    //     if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
    //         this.level2Results.push(cell);
    //     }
    // }

    processLookForLover() {
        if (RandomMgr.randomYes(0.2)) {
            if (this.model.canAskMarry()) {
                let home = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
                if (home) {
                    let homeModel = home.buildingScript.getModel();
                    let curNum = GameModel.getInstance().getAllResidentNum();
                    let maxNum = GameModel.getInstance().getHomeNum() * ResidentMeta.ResidentNumPerHome;
                    if (homeModel.getBuildingState() == BuildingMeta.BuildingState.Noraml &&
                        curNum <= maxNum) {
                        let cell = {
                            func: Laya.Handler.create(this, function (param) {
                                let woman = this.residentMgrInstance.getCanMarryWoman(this.model);
                                if (woman) {
                                    let womanScript = woman.residentLogicScript;
                                    let womanModel = womanScript.getModel();
                                    GameModel.getInstance().setMarried(this.model, womanModel);
                                    this.refreshFSMState(ResidentMeta.ResidentState.LoverMan);
                                    womanScript.refreshFSMState(ResidentMeta.ResidentState.LoverWoman);
                                    this.ideaResult = true;
                                }
                            })
                        };
                        this.level1Results.push(cell);
                    }
                }
            }
        }
    }

    processFight() {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                let resident = this.residentMgrInstance.getACanFightResident(this.model, this.owner.x, this.owner.y);
                if (resident) {
                    let fightModel = GameModel.getInstance().getOrCreateFightPoint(this.owner.x, this.owner.y, 30, 5);
                    if (fightModel.getFightNum() == 0) {
                        fightModel.addFightNum(2);
                        this.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
                        resident.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
                    } else {
                        fightModel.addFightNum(1);
                        this.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
                    }
                    this.ideaResult = true;
                }
            })
        };
        if (this.model.getSocial() < ResidentMeta.ResidentSocialLowToFight &&
            GameModel.getInstance().getAllResidentNum() >= ResidentMeta.ResidentFightNum) {
            this.level2Results.push(cell);
        }
    }

    //此处用户定义
    // ==============================================================================

    // 添加宠物
    addPetByPetType(petType) {
        let petPrefabDef = Laya.loader.getRes(ResourceMeta.PetPrefabPath);
        let pet = petPrefabDef.create();
        pet.petScript = pet.getComponent(PetLogic);
        this.pet = pet;
        this.owner.parent.addChild(this.pet);
        this.pet.x = this.owner.x + this.owner.width;
        this.pet.y = this.owner.y + 20;
    }

    // 获得宠物
    getPet() {
        return this.pet;
    }

    getPetScript() {
        return this.getPet().petScript;
    }
}