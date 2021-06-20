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
import FoodLogic from "../source/FoodLogic";
import GameModel from "../model/GameModel";
import EventMgr from "../helper/EventMgr";
import GameEvent from "../meta/GameEvent";
import BuildingMeta from "../meta/BuildingMeta";
import AnimalMgr from "../animal/AnimalMgr";
import AnimalLogic from "../animal/AnimalLogic";
import Utils from "../helper/Utils";
import ResidentTipMeta from "../meta/ResidentTipMeta";
import ResidentHelper from "./ResidentHelper";
import GameMeta from "../meta/GameMeta";
import ResidentTempData from "./ResidentTempData";
import ResourceMeta from "../meta/ResourceMeta";

export default class ResidentLogic extends Laya.Script {

    constructor() {
        super();
    }

    onStart() {
        // Laya.timer.once(1000, this, function () {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindWater);
        // });
    }

    onEnable() {
        this.rigsterAllEvents();
        this.initModel();
        this.initControl();
        this.initTouch();
        this.residentTempData = new ResidentTempData();
        this.movePaths = [];
    }

    onDisable() {
        this.ResidentTempData.destroy(true);
        this.stopGoto();
        this.removeAllEvents();
        this.removeAllTimers();
    }

    removeAllTimers() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        Laya.timer.clear(this, this.hideTip);
        Laya.timer.clear(this, this.onCollectSendFinish);
        Laya.timer.clear(this, this.onPutDownSend);
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
        this.findCreateHomeTimes = 0;   //寻找盖房地点的次数
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
        this.stopGoto();
        Laya.timer.clear(this, this.onDoWorkFinish);
        let createBuildingNextState = this.canGotoCreateBuilding(state);
        let useBuildingNextState = this.canGotoUseBuilding(state);
        let sendAIMeta = this.canSendExt(state);
        let canCollect = this.canCollect(state);
        let canSendToDest = this.canSendToDest(state);
        // 是否要继续建造
        if (createBuildingNextState) {
            this.startGotoContinueCreateBuilding({
                building: param,
                nextState: createBuildingNextState
            });
        }
        // 是否要去使用建筑
        else if (useBuildingNextState) {
            this.startGotoBuildingForUse({
                building: param,
                nextState: useBuildingNextState
            });
        }
        else if (this.canStartCreateBuilding(state)) {
            this.startCreateBuilding();
        }
        else if (this.canStartUseBuilding(state)) {
            this.startUseBuilding();
        }
        // 送货
        else if (sendAIMeta) {
            this.gotoFindSend({
                sendAIMeta: sendAIMeta,
                sendInfo: param
            });
        }
        // 能够打包货物
        else if (canCollect) {
            this.colletSend(param);
        }
        // 是否能够送打包物品到目标
        else if (canSendToDest) {
            this.gotoSendToDest(param);
        }
        // 待机
        else if (state == ResidentMeta.ResidentState.IdleState) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
        }
        // 寻找可以盖房子的地方
        else if (state == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindCreateHomeBlock();
        }
        // 寻找树木
        else if (state == ResidentMeta.ResidentState.FindTree) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstTree();
        }
        // 砍树
        else if (state == ResidentMeta.ResidentState.CutDownTree) {
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            this.setStateAniVisible(true);
            this.setStateAni("ani1");
            Laya.timer.once(ResidentMeta.CutDownTreeTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
        // 寻找石头
        else if (state == ResidentMeta.ResidentState.FindStone) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstStone();
        }
        // 收集石头
        else if (state == ResidentMeta.ResidentState.CollectStone) {
            this.setStateAniVisible(true);
            this.setStateAni("ani2");
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            Laya.timer.once(ResidentMeta.CollectStoneTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
        // 搜索食物
        else if (state == ResidentMeta.ResidentState.FindFood) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstFood();
        }
        // 吃食物
        else if (state == ResidentMeta.ResidentState.EatFood) {
            this.curEatingFood = param;
            let script = this.curEatingFood.foodScript;
            let model = script.getModel();
            model.setFoodState(FoodMeta.FoodState.Eating);
            this.setStateAniVisible(true);
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            this.setStateAni("ani3");
            Laya.timer.once(model.getEatCDTime(), this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
        // 寻找水源
        else if (state == ResidentMeta.ResidentState.FindWater) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstWater();
        }
        // 喝水
        else if (state == ResidentMeta.ResidentState.DrinkWater) {
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            this.setStateAniVisible(true);
            this.setStateAni("ani4");
            Laya.timer.once(FoodMeta.DrinkWaterTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
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
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startJoinTalkingPoint(param);
        }
        // 聊天
        else if (state == ResidentMeta.ResidentState.TalkingAbout) {
            this.setAnim(ResidentMeta.ResidentAnim.Enjoy);
            this.setStateAniVisible(true);
            this.setStateAni("ani6");
            Laya.timer.once(ResidentMeta.SocialTimeStep * 10, this, this.onDoWorkFinish, [this.makeParam(param)]);
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
            this.hurtAnimal = param;
            let script = this.hurtAnimal.getComponent(AnimalLogic);
            this.hurtAnimalId = script.getModel().getAnimalId();
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startJoinHunt();
        }
        // 赶去打猎完成
        else if (state == ResidentMeta.ResidentState.Hunting) {
            if (this.hurtAnimal) {
                let script = this.hurtAnimal.getComponent(AnimalLogic);
                script.setHurt();
                this.setStateAniVisible(true);
                this.setStateAni("ani7");
                this.setAnim(ResidentMeta.ResidentAnim.Work);
            }
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
            this.startGotoRandomPoint(param);
        }
    }

    doWorkFinishClearFunc() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    // 工作完成
    onDoWorkFinish(param) {
        if (!param.residentIds.has(this.model.getResidentId())) {
            return;
        }
        let state = this.model.getFSMState();
        // 建造完成
        if (this.canFinishCreateBuilding(state)) {
            this.clearContinueCreateBuilding();
        }
        // 使用完成
        else if (this.canFinishUseBuilding(state)) {
            this.onFinishUseBuilding(state);
            this.clearUseBuilding();
        }
        // 打包送货完成 
        else if (this.canSendFinish(state)) {
            this.onFinishSend(param);
        }
        // 吃食物完成
        else if (state == ResidentMeta.ResidentState.EatFood) {
            let script = this.curEatingFood.foodScript;
            let foodModel = script.getModel();
            this.model.addFood(foodModel.getFood());
            FoodMgr.getInstance().removeFoodById(foodModel.getFoodId());
            this.curEatingFood = null;
        }
        // 喝水完成
        else if (state == ResidentMeta.ResidentState.DrinkWater) {
            this.model.addWater(ResidentMeta.ResidentDrinkWaterAddValue);
        }
        // 砍树完成
        else if (state == ResidentMeta.ResidentState.CutDownTree) {
            GameModel.getInstance().addTreeNum(ResidentMeta.ResidentAddTreeBaseValue);
        }
        // 收集石头完成
        else if (state == ResidentMeta.ResidentState.CollectStone) {
            GameModel.getInstance().addStoneNum(ResidentMeta.ResidentAddStoneBaseValue);
        }
        // 聊天结束
        else if (state == ResidentMeta.ResidentState.TalkingAbout) {
            let talkingModel = param.extraParam;
            talkingModel.addTalkingNum(-1);
            this.model.addSocial(ResidentMeta.ResidentAddSocialBaseValue);
            if (talkingModel.getTalkingNum() == 0) {
                GameModel.getInstance().removeTalkingPoint(talkingModel.getTalkingPointId());
            }
        }
        // 打架结束
        else if (state == ResidentMeta.ResidentState.Fighting) {
            let fightModel = param.extraParam;
            fightModel.addFightNum(-1);
            this.model.addLife(-100);
            if (fightModel.getFightNum() == 0) {
                GameModel.getInstance().removeFightPoint(fightModel.getFightPointId());
            }
        }
        // 正在赶去打猎
        else if (state == ResidentMeta.ResidentState.JoinHunt) {
            if (this.hurtAnimal) {
                EventMgr.getInstance().removeEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
                AnimalMgr.getInstance().removeAnimalById(this.hurtAnimalId);
                this.hurtAnimal = null;
                this.hurtAnimalId = null;
            }
        }
        // 打猎中
        else if (state == ResidentMeta.ResidentState.Hunting) {
            if (this.hurtAnimal) {
                EventMgr.getInstance().removeEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
                AnimalMgr.getInstance().removeAnimalById(this.hurtAnimalId);
                this.hurtAnimal = null;
                this.hurtAnimalId = null;
            }
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

    // 随机跑一个位置
    startGotoRandomPoint(p) {
        this.gotoDestExt({
            x: p.x,
            y: p.y,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }));
    }

    // ==================================================================================================使用建筑AIStart
    canGotoUseBuilding(fsmState) {
        let value = ResidentMeta.ResidentUseBuildingMap[String(fsmState)];
        return value;
    }

    startGotoBuildingForUse(config) {
        this.setAnim(ResidentMeta.ResidentAnim.Walk);
        this.useBuilding = config.building;
        let nextState = config.nextState;
        this.gotoDestExt({
            x: this.useBuilding.x + this.useBuilding.width / 2 - this.owner.width / 2,
            y: this.useBuilding.y + this.useBuilding.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(nextState, this.useBuilding);
        }));
    }

    canStartUseBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let value = ResidentMeta.ResidentUseBuildingMap[key];
            if (value == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canFinishUseBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let value = ResidentMeta.ResidentUseBuildingMap[key];
            if (value == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    // 使用建筑
    startUseBuilding() {
        if (this.useBuilding) {
            this.stopAni();
            this.owner.visible = false;
            let buildingModel = this.useBuilding.buildingScript.getModel();
            let buildingType = buildingModel.getBuildingType();
            let buildingMeta = BuildingMeta.BuildingDatas[String(buildingType)];
            Laya.timer.once(buildingMeta.useBuildingTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
    }

    clearUseBuilding() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.useBuilding = null;
    }

    onFinishUseBuilding(state) {
        // 治疗完成
        if (state == ResidentMeta.ResidentState.Treating) {
            this.model.setSick(1);
            this.setBuffAniVisible(false);
            this.stopBuffAni();
        }
        // 学习完成
        else if (state == ResidentMeta.ResidentState.Learning) {
            this.model.addTeach(BuildingMeta.BuildingDatas[String(BuildingMeta.BuildingType.SchoolType)].addTeach);
        }
        // 在幼儿园学习完成
        else if (state == ResidentMeta.ResidentState.ChildLearn) {
            this.model.addAgeExp(Math.round(ResidentMeta.ResidentAgePeriod / 2), true);
        }
    }
    // ==================================================================================================使用建筑AIEnd

    // ==================================================================================================建造AIStart
    canGotoCreateBuilding(fsmState) {
        let value = ResidentMeta.ResidentContinueCreateMap[String(fsmState)];
        return value;
    }

    canStartCreateBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentContinueCreateMap) {
            let value = ResidentMeta.ResidentContinueCreateMap[key];
            if (value == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canFinishCreateBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentContinueCreateMap) {
            let value = ResidentMeta.ResidentContinueCreateMap[key];
            if (value == fsmState && fsmState != undefined && fsmState != null) {
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
        EventMgr.getInstance().registEvent(GameEvent.CREATE_BUILDING_FINISH, this, this.onDoWorkFinish);
        this.setAnim(ResidentMeta.ResidentAnim.Walk);
        this.continueCreateBuilding = config.building;
        let nextState = config.nextState;
        this.continueCreateBuilding.buildingScript.joinResidentIdToBuilding(this.model.getResidentId());
        this.gotoDestExt({
            x: this.continueCreateBuilding.x + this.continueCreateBuilding.width / 2 - this.owner.width / 2,
            y: this.continueCreateBuilding.y + this.continueCreateBuilding.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(nextState, this.continueCreateBuilding);
        }));
    }

    // 建造建筑
    startCreateBuilding() {
        if (this.continueCreateBuilding) {
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            this.setStateAniVisible(true);
            this.setStateAni("ani2");
            this.continueCreateBuilding.buildingScript.startCreate();
        }
    }

    clearContinueCreateBuilding() {
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_BUILDING_FINISH, this, this.onDoWorkFinish);
        this.continueCreateBuilding = null;
    }
    // ==================================================================================================建造AIEnd


    // 赶去打猎
    startJoinHunt() {
        EventMgr.getInstance().registEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
        let script = this.hurtAnimal.getComponent(AnimalLogic);
        script.joinHunt(this.model.getResidentId());
        script.pauseWalk();
        let pos = RandomMgr.randomPointForX(this.hurtAnimal.x, this.hurtAnimal.y + this.hurtAnimal.height, this.hurtAnimal.width);
        this.gotoDestExt({
            x: pos.x - this.owner.width / 2,
            y: pos.y - this.owner.height / 2,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.Hunting);
        }));
    }

    // 走到聊天点
    startJoinTalkingPoint(talkingModel) {
        let pos = talkingModel.getTalkingPosInArea();
        this.gotoDestExt({
            x: pos.x,
            y: pos.y,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.TalkingAbout, talkingModel);
        }));
    }

    // 走到聊天点
    startJoinFightPoint(fightModel) {
        let pos = fightModel.getFightPosInArea();
        this.gotoDestExt({
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
            this.gotoDestExt({
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
            this.gotoDestExt({
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

    // 开始寻找可以建房子的空地
    startFindCreateHomeBlock() {
        if (this.findCreateHomeTimes < ResidentMeta.ResidentFindPathTimes) {
            if (this.model.getFSMState() == ResidentMeta.ResidentState.FindBlockForCreateHome) {
                let dstP = RandomMgr.randomByArea2(this.owner.x,
                    this.owner.y,
                    300,
                    GameContext.mapWidth, GameContext.mapHeight, GameMeta.MapSideOff, GameMeta.MapSideOff);
                this.gotoDestExt({ x: dstP.x, y: dstP.y }, Laya.Handler.create(this, function () {
                    this.findCreateHomeTimes++;
                    // 查看此处可不可以盖房
                    let data = BuildingMeta.BuildingDatas[String(BuildingMeta.BuildingType.HomeType)];
                    let toCreateHomeX = this.owner.x - data.width / 2 + this.owner.width / 2;
                    let toCreateHomeY = this.owner.y - data.height + this.owner.height;
                    if (!ResidentHelper.isOccupySpace(toCreateHomeX, toCreateHomeY,
                        data.width, data.height)) {
                        let building = BuildingMgr.getInstance().createBuildingByConfig({
                            parent: GameContext.mapContainer,
                            x: toCreateHomeX,
                            y: toCreateHomeY,
                            prefab: ResourceMeta.HomePrefabPath,
                            buildingType: BuildingMeta.BuildingType.HomeType,
                        });
                        this.model.setMyHomeId(building.buildingScript.getModel().getBuildingId());
                        this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateHome, building);
                    } else {
                        this.startFindCreateHomeBlock();
                    }
                }));
            }
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.findCreateHomeTimes = 0;
        }
    }

    startFindANearstTree() {
        let nearstTree = TreeMgr.getInstance().getNearstTree(this.owner.x, this.owner.y);
        if (nearstTree) {
            this.gotoDestExt({
                x: nearstTree.x + nearstTree.width / 2 - this.owner.width / 2,
                y: nearstTree.y + nearstTree.height - this.owner.height + 20
            }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.CutDownTree);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    // 寻找最近的水源
    startFindANearstWater() {
        let nearstWater = WaterMgr.getInstance().randomWater(this.owner.x, this.owner.y, 2000);
        if (nearstWater) {
            let dsp = RandomMgr.randomPointInRect(nearstWater.x, nearstWater.y, nearstWater.width, nearstWater.height);
            this.gotoDestExt({ x: dsp.x, y: dsp.y }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.DrinkWater);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    // 寻找最近的食物
    startFindANearstFood() {
        let nearstFood = FoodMgr.getInstance().getNearstFood({
            x: this.owner.x,
            y: this.owner.y,
            state: FoodMeta.FoodState.CanEat,
            area: 2000,
        });
        if (nearstFood) {
            let script = nearstFood.foodScript;
            script.getModel().setFoodState(FoodMeta.FoodState.Occupy);
            this.gotoDestExt({ x: nearstFood.x, y: nearstFood.y }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.EatFood, nearstFood);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    startFindANearstStone() {
        let nearstStone = StoneMgr.getInstance().getNearstStone(this.owner.x, this.owner.y);
        if (nearstStone) {
            let dsp = RandomMgr.randomPointInRect(nearstStone.x, nearstStone.y, nearstStone.width, nearstStone.height);
            this.gotoDestExt({ x: dsp.x, y: nearstStone.y + nearstStone.height }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.CollectStone);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    // 行走到某个位置
    _gotoDest(info, handler) {
        this.stopAGoto();
        let dstX = info.x;
        let dstY = info.y;
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let r = distance / ResidentMeta.ResidentMoveSpeed;
        let time = r * 1000;
        Laya.timer.once(time + 50, this, this.onGotoTimeOut, [info, handler]);
        this.owner.SSSX = dstX;
        this.owner.SSSY = dstY;
        let dst = null;
        if (dstX != this.owner.x) {
            dst = { x: dstX };
        }
        if (dstY != this.owner.y) {
            dst = { y: dstY };
        }
        this.tweenObject = Laya.Tween.to(this.owner, dst, time, null, Laya.Handler.create(this, function () {
            this.stopAGoto();
            if (handler) {
                handler.run();
            }
        }));
        // this.tweenObject.pause();
        // Laya.timer.once(0, this, this.onGotoTimeOut, [info, handler]);
    }

    onGotoTimeOut(info, handler) {
        // console.debug("BBBBBBBBBBBBBBBBBBBBB");
        // console.debug(this.tweenObject);
        // console.debug({ x: this.owner.x, y: this.owner.y });
        // console.debug({ x: this.owner.SSSX, y: this.owner.SSSY });
        // console.debug(info);
        // console.debug(this.movePaths.length);
        // console.debug(this.tweenObject.gid);
        // console.debug("DDDDDDDDDDDDDDDDDDDD");

        this.stopAGoto();
        this._gotoDest(info, handler);
        // if (this.tweenObject) {
        //     Laya.timer.clear(this, this.onGotoTimeOut);
        //     this.tweenObject.restart();
        // }
    }

    // 行走到某个位置
    _gotoDest2(handler) {
        if (this.movePaths.length != 0) {
            let p = this.movePaths[0];
            if (p.direct.x != 0) {
                p.direct.x < 0 ? this.ani.play(0, true, "walk_left") : this.ani.play(0, true, "walk_right");
            } else {
                p.direct.y < 0 ? this.ani.play(0, true, "walk_up") : this.ani.play(0, true, "walk_down");
            }
            this._gotoDest(p, Laya.Handler.create(this, function () {
                this.movePaths.splice(0, 1);
                this._gotoDest2(handler);
            }));
        } else {
            this.stopGoto();
            if (handler) {
                handler.run();
            }
        }
    }

    // 行走到某个位置
    gotoDestExt(info, handler) {
        // 目标点
        let dstX = Math.round(info.x);
        let dstY = Math.round(info.y);
        // 当前点
        let curX = Math.round(this.owner.x);
        let curY = Math.round(this.owner.y);
        let xDelta = dstX - curX;
        let yDelta = dstY - curY;
        if (xDelta == 0 && yDelta == 0) {
            if (handler) {
                handler.run();
            }
        }
        // this.model.Cur = String(curX) + "_"+ String(curY);
        // this.model.Dst = String(dstX) + "_"+ String(dstY);
        // let xDistance = Math.abs(xDelta);
        // let yDistance = Math.abs(yDelta);
        let signX = Utils.getSign2(xDelta);
        let signY = Utils.getSign2(yDelta);
        if (RandomMgr.randomYes() || info.forceFirstY) {
            let p1 = {
                x: curX,
                y: dstY,
                direct: { x: 0, y: signY },
            };
            let p2 = {
                x: dstX,
                y: dstY,
                direct: { x: signX, y: 0 },
            };
            if (signY != 0) {
                this.movePaths.push(p1);
            }
            if (signX != 0) {
                this.movePaths.push(p2);
            }
        } else {
            let p1 = {
                x: dstX,
                y: curY,
                direct: { x: signX, y: 0 },
            };
            let p2 = {
                x: dstX,
                y: dstY,
                direct: { x: 0, y: signY },
            };
            if (signX != 0) {
                this.movePaths.push(p1);
            }
            if (signY != 0) {
                this.movePaths.push(p2);
            }
        }
        this._gotoDest2(handler);
    }


    stopAGoto() {
        Laya.timer.clear(this, this.onGotoTimeOut);
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
    }

    stopGoto() {
        this.stopAGoto();
        this.movePaths = [];
    }

    makeParam(extraParam) {
        let ret = {};
        ret.residentIds = new Set([this.model.getResidentId()]);
        ret.extraParam = extraParam;
        return ret;
    }



    // 处理策略
    processResult() {
        this.level1Results = [];
        this.level2Results = [];
        // =================================正式================start
        // 喝水
        // this.processDrinkWater();
        //吃饭
        // this.processEatFood();
        // 社交
        // this.processSocial();
        // 砍树
        // this.processCutDownTree();
        // 收集石头
        // this.processCollectStone();
        // 跑去打猎
        // this.processHunt();
        // 盖房子
        // this.processCreateHome();
        // 找恋人
        // this.processLookForLover();
        // 去幼儿园学习
        // this.processLearnForChildSchool();
        // 打架
        // this.processFight();
        // 赶着去溜达
        // this.processRandomWalk();
        // 跑去治病
        // this.processHeal();
        // 跑去上课
        // this.processTeach();
        // 跑去建造
        this.processCreateBuilding();
        // 跑去运送
        this.processSend();
        // =================================正式================end
    }

    // 执行策略
    doResult() {
        while (this.level1Results.length != 0) {
            let index = RandomMgr.randomNumber(0, this.level1Results.length - 1);
            let cell = this.level1Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
            this.level1Results.splice(index, 1);
        }

        while (this.level2Results.length != 0) {
            let index = RandomMgr.randomNumber(0, this.level2Results.length - 1);
            let cell = this.level2Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
            this.level2Results.splice(index, 1);
        }
        this.ideaResult = false;
    }

    // 做出策略
    makeIdea() {
        if (this.model.getFSMState() != ResidentMeta.ResidentState.IdleState) {
            return;
        }
        if (!RandomMgr.randomYes(this.model.getPositive())) {
            return;
        }
        if (RandomMgr.randomYes(ResidentTipMeta.BoredTipsProbability)) {
            this.showTip(ResidentTipMeta.randomOneBoredTip());
        }
        // 处理可以做的事情
        this.processResult();
        this.doResult();
    }

    processEatFood() {
        let cell = {
            func: Laya.Handler.create(this, function () {
                let canFood = FoodMgr.getInstance().canFindFood();
                if (canFood) {
                    this.refreshFSMState(ResidentMeta.ResidentState.FindFood);
                    this.ideaResult = true;
                }
            })
        };
        let food = this.model.getFood();
        if (food < ResidentMeta.ResidentFoodNeedValue) {
            this.level1Results.push(cell);
        } else if (food < 90) {
            this.level2Results.push(cell);
        }
    }

    processDrinkWater() {
        let cell = {
            func: Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.FindWater);
                this.ideaResult = true;
            })
        };
        let water = this.model.getWater();
        if (water < ResidentMeta.ResidentWaterNeedValue) {
            this.level1Results.push(cell);
        } else if (water < 100) {
            this.level2Results.push(cell);
        }
    }

    processSocial() {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                let resident = this.residentMgrInstance.getACanSocialResident(this.owner);
                if (resident) {
                    let talkingModel = GameModel.getInstance().getOrCreateTalkingPoint(this.owner.x, this.owner.y, 40, 5);
                    if (talkingModel.getTalkingNum() == 0) {
                        talkingModel.addTalkingNum(2);
                        this.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                        resident.getComponent(ResidentLogic).refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                    } else {
                        talkingModel.addTalkingNum(1);
                        this.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                    }
                    this.ideaResult = true;
                }
            })
        };
        let scocial = this.model.getSocial();
        if (scocial < ResidentMeta.ResidentSocialNeedValue) {
            this.level1Results.push(cell);
        } else if (RandomMgr.randomYes() && scocial < 100) {
            this.level2Results.push(cell);
        }
    }

    processCutDownTree() {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                this.refreshFSMState(ResidentMeta.ResidentState.FindTree);
                this.ideaResult = true;
            })
        };
        if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell);
        }
    }

    processCollectStone() {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                this.refreshFSMState(ResidentMeta.ResidentState.FindStone);
                this.ideaResult = true;
            })
        };
        if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell);
        }
    }

    processHunt() {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                let animal = AnimalMgr.getInstance().getAnimalForAttack(this.owner.x, this.owner.y, 2000);
                if (animal) {
                    this.refreshFSMState(ResidentMeta.ResidentState.JoinHunt, animal);
                    this.ideaResult = true;
                }
            })
        };
        if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell);
        }
    }

    processCreateHome() {
        if (RandomMgr.randomYes() && this.model.getMyHomeId() == 0 && this.model.getSex() == 1 &&
            this.model.getAge() >= ResidentMeta.ResidentAdultAge &&
            BuildingMgr.getInstance().canCreateBuildingForResource(BuildingMeta.BuildingType.HomeType)) {
            let cell = {
                func: Laya.Handler.create(this, function (param) {
                    this.refreshFSMState(ResidentMeta.ResidentState.FindBlockForCreateHome);
                    this.ideaResult = true;
                })
            };
            this.level1Results.push(cell);
        }
    }

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

    processLearnForChildSchool() {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                    this.owner.y, BuildingMeta.BuildingType.ChildSchoolType,
                    2000, [BuildingMeta.BuildingState.Noraml]);
                if (building) {
                    this.refreshFSMState(ResidentMeta.ResidentState.GotoChildSchoolForLearn, building);
                    this.ideaResult = true;
                }
            }),
        };
        if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell);
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

    processRandomWalk() {
        let cell = {
            func: Laya.Handler.create(this, function () {
                let p = RandomMgr.randomByArea(this.owner.x, this.owner.y, 200);
                if (!ResidentHelper.isOccupySpace(this.owner.x,
                    this.owner.y,
                    this.owner.width,
                    this.owner.height)) {
                    this.refreshFSMState(ResidentMeta.ResidentState.RandomWalk, p);
                    this.ideaResult = true;
                }
            }),
        };
        this.level2Results.push(cell);
    }

    processHeal() {
        if (this.model.getSick() == 2) {
            let cell = {
                func: Laya.Handler.create(this, function (param) {
                    let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                        this.owner.y, BuildingMeta.BuildingType.HospitalType,
                        2000, [BuildingMeta.BuildingState.Noraml]);
                    if (building) {
                        this.refreshFSMState(ResidentMeta.ResidentState.GotoTreat, building);
                        this.ideaResult = true;
                    }
                })
            };
            this.level1Results.push(cell);
        }
    }

    processTeach() {
        if (this.model.getTeach() < 100) {
            let cell = {
                func: Laya.Handler.create(this, function (param) {
                    let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                        this.owner.y, BuildingMeta.BuildingType.SchoolType,
                        1000, [BuildingMeta.BuildingState.Noraml]);
                    if (building) {
                        this.refreshFSMState(ResidentMeta.ResidentState.GoToSchool, building);
                        this.ideaResult = true;
                    }
                })
            };
            this.level2Results.push(cell);
        }
    }

    processCreateBuilding() {
        if (this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            let createCell = {
                func: Laya.Handler.create(this, function () {
                    let AIInfo = ResidentHelper.getAIGoToCreateBuildingInfo(this.owner.x, this.owner.y);
                    if (AIInfo) {
                        this.refreshFSMState(AIInfo.state, AIInfo.building);
                        this.ideaResult = true;
                    }
                }),
            };
            this.level2Results.push(createCell);
        }
    }


    // 处理运送
    processSend() {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            if (this.canSend(key)) {
                let sendCell = {
                    func: Laya.Handler.create(this, function () {
                        let sendInfo = this.getSendAndDest(key);
                        if (sendInfo && sendInfo.send && sendInfo.dest) {
                            this.preSend(key, sendInfo);
                            this.refreshFSMState(key, sendInfo);
                            this.ideaResult = true;
                        }
                    }),
                };
                this.level2Results.push(sendCell);
            }
        }
    }

    canSendExt(fsmState) {
        return ResidentMeta.ResidentSendAIMap[fsmState];
    }

    gotoFindSend(info) {
        let sendAIMeta = info.sendAIMeta;
        let sendInfo = info.sendInfo;
        this.setAnim(ResidentMeta.ResidentAnim.Walk);
        let collectState = sendAIMeta.collectState;
        this.gotoDestExt({
            x: sendInfo.send.x + sendInfo.send.width / 2 - this.owner.width / 2,
            y: sendInfo.send.y + sendInfo.send.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(collectState, info);
        }));
    }

    canCollect(fsmState) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            let item = ResidentMeta.ResidentSendAIMap[key];
            if (fsmState == item.collectState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canSendToDest(fsmState) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            let item = ResidentMeta.ResidentSendAIMap[key];
            if (fsmState == item.lastState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canSendFinish(fsmState) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            let item = ResidentMeta.ResidentSendAIMap[key];
            if (fsmState == item.lastState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    colletSend(info) {
        this.setAnim(ResidentMeta.ResidentAnim.Work);
        this.setStateAniVisible(true);
        this.setStateAni("ani9");
        Laya.timer.once(ResidentMeta.ResidentCollectSendTime, this, this.onCollectSendFinish, [info]);
    }

    onCollectSendFinish(info) {
        let sendAIMeta = info.sendAIMeta;
        this.onGetAddValueInfo(info);
        this.refreshFSMState(sendAIMeta.lastState, info);
    }

    gotoSendToDest(info) {
        this.setStateAniVisible(true);
        this.setStateAni("ani10");
        let sendInfo = info.sendInfo;
        this.gotoDestExt({
            x: sendInfo.dest.x + sendInfo.dest.width / 2 - this.owner.width / 2,
            y: sendInfo.dest.y + sendInfo.dest.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.onPutDownSend(info);
        }));
    }

    onPutDownSend(info) {
        this.owner.visible = false;
        Laya.timer.once(1000, this, function () {
            this.owner.visible = true;
            this.onDoWorkFinish(this.makeParam(info));
        });
    }

    //此处用户定义
    // ==============================================================================
    onGetAddValueInfo(info) {
        let sendInfo = info.sendInfo;
        let fsmState = this.model.getFSMState();
        // 食物增加值
        if (fsmState == ResidentMeta.ResidentState.CollectFood) {
            let foodModel = sendInfo.send.foodScript.getModel();
            let addFoodNum = foodModel.getFood();
            FoodMgr.getInstance().removeFoodById(foodModel.getFoodId());
            sendInfo.send = null;
            info.addFood = addFoodNum;
        }
        // 水源增加值
        else if (fsmState == ResidentMeta.ResidentState.CollectWater) {
            info.addWater = ResidentMeta.ResidentSaveWaterAddValue;
        }
    }

    onFinishSend(param) {
        let extraParam = param.extraParam;
        let dest = extraParam.sendInfo.dest;
        let fsmState = this.model.getFSMState();
        // 运送食物完成
        if (fsmState == ResidentMeta.ResidentState.SendFoodToFoodPool) {
            dest.buildingScript.addFoodToPool(extraParam.addFood);
        }
        // 运送水源完成
        else if (fsmState == ResidentMeta.ResidentState.SendWaterToWaterPool) {
            dest.buildingScript.addWaterToPool(extraParam.addWater);
        }
    }

    canSend(AIType) {
        // 食物判断
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
                return false;
            }
            return true;
        }
        // 水源判断
        else if (AIType == ResidentMeta.ResidentState.FindWaterForSend) {
            if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
                return false;
            }
            return true;
        }
    }

    getSendAndDest(AIType) {
        // 食物
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            let nearstFood = FoodMgr.getInstance().getNearstFood({
                x: this.owner.x,
                y: this.owner.y,
                state: FoodMeta.FoodState.CanEat,
                area: 2000
            });
            let nearstBuilding = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.FoodPoolType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (nearstBuilding && !nearstBuilding.buildingScript.isReachFoodMax()) {
                return {
                    AIType: AIType,
                    send: nearstFood,
                    dest: nearstBuilding,
                };
            }
            return null;
        }
        // 水源
        else if (AIType == ResidentMeta.ResidentState.FindWaterForSend) {
            let nearstWater = WaterMgr.getInstance().randomWater(this.owner.x, this.owner.y, 2000);
            let nearstBuilding = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.WaterPoolType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            return {
                AIType: AIType,
                send: nearstWater,
                dest: nearstBuilding,
            };
        }
    }

    preSend(AIType, sendInfo) {
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            sendInfo.send.foodScript.getModel().setFoodState(FoodMeta.FoodState.Occupy);
        }
    }
}