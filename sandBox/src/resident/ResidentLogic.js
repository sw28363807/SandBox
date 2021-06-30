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
        let createBuildingNextState = this.canGotoCreateBuilding(state);
        let useBuildingNextState = this.canGotoUseBuilding(state);
        let sendAIMeta = this.canSendExt(state);
        let canCollect = this.canCollect(state);
        let canSendToDest = this.canSendToDest(state);
        let canFindBlockForCreateBuilding = this.canFindCreateBuildingBlock(state);
        let useData = this.canStartUseBuilding(state);
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
                nextState: useBuildingNextState.nextState
            });
        }
        else if (this.canStartCreateBuilding(state)) {
            this.startCreateBuilding();
        }
        else if (useData) {
            this.startUseBuilding(useData);
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
        // 搜寻
        else if (canFindBlockForCreateBuilding) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.findCreateBuildingTimes = 0;
            this.startFindCreateBuildingBlock(param);
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
            this.model.addLife(-ResidentMeta.ResidentFightReduceValue);
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
        this.walkTo({
            x: p.x,
            y: p.y,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }));
    }

    // ==================================================================================================使用建筑AIStart
    onUseBuildingCondition(aiData) {
        // 去治疗
        if (aiData == ResidentMeta.ResidentState.GotoTreat) {
            if (this.model.getSick() == 2) {
                this.useBuildingAIPriority = 1;
                return true;
            }
            return false;
        }
        // 去学校
        else if (aiData == ResidentMeta.ResidentState.GoToSchool) {
            if (this.model.getTeach() < 100) {
                return true;
            }
            return false;
        }
        // 去幼儿园
        else if (aiData == ResidentMeta.ResidentState.GotoChildSchoolForLearn) {
            if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
                return true;
            }
            return false;
        }
        // 去食物库
        else if (aiData == ResidentMeta.ResidentState.GotoFoodPoolForEat) {
            if (this.model.getFood() < 90) {
                return true;
            }
            return false;
        }
        // 去水库
        else if (aiData == ResidentMeta.ResidentState.GotoWaterPoolForDrink) {
            if (this.model.getWater() < 90) {
                return true;
            }
            return false;
        }
        // 去宠物店
        else if (aiData == ResidentMeta.ResidentState.GotoPetShopForTakeOutPet) {
            if (this.model.getPetType() != 0) {
                return false;
            }
            return true;
        }
        // 去火堆周围
        else if (aiData == ResidentMeta.ResidentState.GotoFireForHeating) {
            if (this.model.getTemperature() < ResidentMeta.ResidentDangerTemperature) {
                return true;
            }
            if (this.model.getTemperature() <= 32) {
                this.useBuildingAIPriority = 1;
                return true;
            }
            return false;
        }
    }

    // 获取建筑
    onGetBuilding(aiData, data) {
        // 去治疗
        if (aiData == ResidentMeta.ResidentState.GotoTreat) {
            let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            return building
        }
        // 去学校
        else if (aiData == ResidentMeta.ResidentState.GoToSchool) {
            let building = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            return building
        }
        // 去幼儿园
        else if (aiData == ResidentMeta.ResidentState.GotoChildSchoolForLearn) {
            let building = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            return building
        }
        // 去食物库
        else if (aiData == ResidentMeta.ResidentState.GotoFoodPoolForEat) {
            let buildings = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (buildings.length != 0) {
                for (const key in buildings) {
                    let item = buildings[key];
                    let curSaveFood = item.buildingScript.getCurSaveFood();
                    if (curSaveFood > 0) {
                        return item;
                    }
                }
            }
            return null;
        }
        // 去水库
        else if (aiData == ResidentMeta.ResidentState.GotoWaterPoolForDrink) {
            let buildings = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (buildings.length != 0) {
                for (const key in buildings) {
                    let item = buildings[key];
                    let curSaveWater = item.buildingScript.getCurSaveWater();
                    if (curSaveWater > 0) {
                        return item;
                    }
                }
            }
            return null;
        }
        // 去宠物店
        else if (aiData == ResidentMeta.ResidentState.GotoPetShopForTakeOutPet) {
            let buildings = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (buildings.length != 0) {
                for (const key in buildings) {
                    let item = buildings[key];
                    let petTypeId = item.buildingScript.getFirstPetInPetList();
                    if (petTypeId > 0) {
                        item.buildingScript.getModel().setBuildingState(BuildingMeta.BuildingState.Occupy);
                        return item;
                    }
                }
            }
            return null;
        }
        // 去火堆
        else if (aiData == ResidentMeta.ResidentState.GotoFireForHeating) {
            let building = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], function (building) {
                    return building.buildingScript.getHeatingTimes() < building.buildingScript.getHeatingMaxTimes();
                });
            return building;
        }
    }


    onGotoUseBuildingPre() {
        let model = this.useBuilding.buildingScript.getModel();
        let buildingType = model.getBuildingType();
        if (buildingType == BuildingMeta.BuildingType.FireType) {
            this.useBuilding.buildingScript.addHeatingTimes(1);
            this.useBuilding.buildingScript.joinResidentIdToBuildingForUse(this.model.getResidentId());
        }
        
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
        // 在食物库吃饭完成
        else if (state == ResidentMeta.ResidentState.EatFoodInFoodPool) {
            let residentFood = this.model.getFood();
            let curSaveFood = this.useBuilding.buildingScript.getCurSaveFood();
            let needFood = Math.round(100 - residentFood);
            let deltay = 0;
            if (needFood >= curSaveFood) {
                deltay = curSaveFood
            } else {
                deltay = needFood;
            }
            if (deltay > 40) {
                deltay = 40;
            }
            this.useBuilding.buildingScript.addFoodToPool(-deltay);
            this.model.addFood(deltay);
        }
        // 在水库喝水完成
        else if (state == ResidentMeta.ResidentState.DrinkWaterInWaterPool) {
            let residentWater = this.model.getWater();
            let curSaveWater = this.useBuilding.buildingScript.getCurSaveWater();
            let needWater = Math.round(100 - residentWater);
            let deltay = 0;
            if (needWater >= curSaveWater) {
                deltay = curSaveWater
            } else {
                deltay = needWater;
            }
            if (deltay > 40) {
                deltay = 40;
            }
            this.useBuilding.buildingScript.addWaterToPool(-deltay);
            this.model.addWater(deltay);
        }
        // 宠物店领取宠物完成
        else if (state == ResidentMeta.ResidentState.TakeOutPet) {
            let first = this.useBuilding.buildingScript.popFirstPet();
            this.model.setPetType(first);
            this.addPetByPetType(first);
            this.useBuilding.buildingScript.getModel().setBuildingState(BuildingMeta.BuildingState.Noraml);
        }
        // 火堆烤火完成
        else if (state == ResidentMeta.ResidentState.Heating) {
            this.model.setTemperature(ResidentMeta.ResidentStandardTemperature);
            let buildingScript = this.useBuilding.buildingScript;
            buildingScript.removeResidentIdToBuildingForUse(this.model.getResidentId());
            if (buildingScript.getHeatingTimes() >= buildingScript.getHeatingMaxTimes()) {
                let num = buildingScript.getResidentIdToBuildingForUseNum();
                if (num == 0) {
                    BuildingMgr.getInstance().removeBuildingById(buildingScript.getModel().getBuildingId());
                }
            }
        }
    }

    onUseBuildingPre(useData) {
        if (useData.buildingType == BuildingMeta.BuildingType.FireType) {
            this.setAnim(ResidentMeta.ResidentAnim.Enjoy);
            this.setStateAniVisible(true);
            this.setStateAni("ani11");
        }
        // console.debug(useData);
    }

    canGotoUseBuilding(fsmState) {
        let value = ResidentMeta.ResidentUseBuildingMap[String(fsmState)];
        return value;
    }

    startGotoBuildingForUse(config) {
        let data = ResidentMeta.ResidentUseBuildingMap[this.model.getFSMState()];
        this.setAnim(ResidentMeta.ResidentAnim.Walk);
        this.useBuilding = config.building;
        let nextState = config.nextState;
        let destX = this.useBuilding.x + this.useBuilding.width / 2 - this.owner.width / 2;
        let destY = this.useBuilding.y + this.useBuilding.height - this.owner.height + ResidentMeta.ResidentGotoYOff;
        if (data.useType == 2) {
            destY = this.useBuilding.y + this.useBuilding.height / 2 - this.owner.height + ResidentMeta.ResidentGotoYOff;
            let p = RandomMgr.randomByArea3(destX, destY, 70, 100);
            destX = p.x;
            destY = p.y;
        }
        this.onGotoUseBuildingPre();
        this.walkTo({
            x: destX,
            y: destY,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(nextState, this.useBuilding);
        }));
    }

    canStartUseBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let value = ResidentMeta.ResidentUseBuildingMap[key];
            if (value.nextState == fsmState && fsmState != undefined && fsmState != null) {
                return value;
            }
        }
        return null;
    }

    canFinishUseBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let value = ResidentMeta.ResidentUseBuildingMap[key];
            if (value.nextState == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    // 使用建筑
    startUseBuilding(useData) {
        if (this.useBuilding) {
            this.stopAni();
            if (useData.useType != 2) {
                this.owner.visible = false;
            }
            let buildingModel = this.useBuilding.buildingScript.getModel();
            let buildingType = buildingModel.getBuildingType();
            let buildingMeta = BuildingMeta.BuildingDatas[String(buildingType)];
            this.onUseBuildingPre(useData);
            Laya.timer.once(buildingMeta.useBuildingTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
    }

    clearUseBuilding() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.useBuilding = null;
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
        this.continueCreateBuilding.buildingScript.joinResidentIdToBuildingForCreate(this.model.getResidentId());
        this.walkTo({
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
        this.walkTo({
            x: pos.x - this.owner.width / 2,
            y: pos.y - this.owner.height / 2,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.Hunting);
        }));
    }

    // 走到聊天点
    startJoinTalkingPoint(talkingModel) {
        let pos = talkingModel.getTalkingPosInArea();
        this.walkTo({
            x: pos.x,
            y: pos.y,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.TalkingAbout, talkingModel);
        }));
    }

    // 走到聊天点
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

    // 开始寻找可以建房子的空地
    startFindCreateBuildingBlock(itemData) {
        if (this.findCreateBuildingTimes < ResidentMeta.ResidentFindPathTimes) {
            let dstP = RandomMgr.randomByArea2(this.owner.x,
                this.owner.y,
                300,
                GameContext.mapWidth, GameContext.mapHeight, GameMeta.MapSideOff, GameMeta.MapSideOff);
            this.walkTo({ x: dstP.x, y: dstP.y }, Laya.Handler.create(this, function () {
                this.findCreateBuildingTimes++;
                // 查看此处可不可以建筑
                let data = BuildingMeta.BuildingDatas[itemData.buildingType];
                let toCreateX = this.owner.x - data.width / 2 + this.owner.width / 2;
                let toCreateY = this.owner.y - data.height + this.owner.height;
                if (!ResidentHelper.isOccupySpace(toCreateX, toCreateY,
                    data.width, data.height)) {
                    let building = BuildingMgr.getInstance().createBuildingByConfig({
                        parent: GameContext.mapContainer,
                        x: toCreateX,
                        y: toCreateY,
                        prefab: data.prefab,
                        buildingType: itemData.buildingType,
                    });
                    this.onFindBlockForCreateBuilding(building, itemData);
                    this.refreshFSMState(itemData.nextState, building);
                } else {
                    this.startFindCreateBuildingBlock(itemData);
                }
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.findCreateBuildingTimes = 0;
        }
    }

    startFindANearstTree() {
        let nearstTree = TreeMgr.getInstance().getNearstTree(this.owner.x, this.owner.y);
        if (nearstTree) {
            this.walkTo({
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
            this.walkTo({ x: dsp.x, y: dsp.y }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.DrinkWater);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    // 寻找最近的食物
    startFindANearstFood() {
        let nearstFood = FoodMgr.getInstance().getRandomFood({
            x: this.owner.x,
            y: this.owner.y,
            state: FoodMeta.FoodState.CanEat,
            area: 2000,
        });
        if (nearstFood) {
            let script = nearstFood.foodScript;
            script.getModel().setFoodState(FoodMeta.FoodState.Occupy);
            this.walkTo({ x: nearstFood.x, y: nearstFood.y }, Laya.Handler.create(this, function () {
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
            this.walkTo({ x: dsp.x, y: nearstStone.y + nearstStone.height }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.CollectStone);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
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
        this.processDrinkWater();
        //吃饭
        this.processEatFood();
        // 社交
        this.processSocial();
        // 砍树
        this.processCutDownTree();
        // 收集石头
        this.processCollectStone();
        // 跑去打猎
        this.processHunt();
        // 找恋人
        this.processLookForLover();
        // 打架
        this.processFight();
        // 赶着去溜达
        this.processRandomWalk();
        // 跑去建造
        this.processCreateBuilding();
        // // 跑去运送
        this.processSend();
        // 跑去使用建筑
        this.processUseBuildingAI();
        // 自动搜索建筑去建造AI
        this.processResidentFindCreateBuildingBlockAI();
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
        } else if (food < 50) {
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
        } else if (water < 50) {
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
        this.walkTo({
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
        this.walkTo({
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
            let nearstFood = FoodMgr.getInstance().getRandomFood({
                x: this.owner.x,
                y: this.owner.y,
                state: FoodMeta.FoodState.CanEat,
                area: 2000
            });
            let nearstBuilding = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
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
            let nearstBuilding = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.WaterPoolType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (nearstBuilding && !nearstBuilding.buildingScript.isReachWaterMax()) {
                return {
                    AIType: AIType,
                    send: nearstWater,
                    dest: nearstBuilding,
                };
            }
            return null;
        }
    }

    preSend(AIType, sendInfo) {
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            sendInfo.send.foodScript.getModel().setFoodState(FoodMeta.FoodState.Occupy);
        }
    }

    //处理使用建筑
    processUseBuildingAI() {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let item = ResidentMeta.ResidentUseBuildingMap[key];
            this.useBuildingAIPriority = 2;
            if (this.onUseBuildingCondition(key)) {
                let cell = {
                    func: Laya.Handler.create(this, function () {
                        let building = this.onGetBuilding(key, item);
                        if (building) {
                            this.refreshFSMState(key, building);
                            this.ideaResult = true;
                        }
                    })
                };
                if (this.useBuildingAIPriority == 2) {
                    this.level2Results.push(cell);
                } else {
                    this.level1Results.push(cell);
                }
            }
        }
    }

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


    processResidentFindCreateBuildingBlockAI() {
        for (const key in ResidentMeta.ResidentFindCreateBuildingBlockAIMap) {
            this.findBlockAIPriority = 2;
            let item = ResidentMeta.ResidentFindCreateBuildingBlockAIMap[key];
            let can = this.canFindCreateBuildingBlockCondition(key, item);
            if (can) {
                let cell = {
                    func: Laya.Handler.create(this, function () {
                        this.refreshFSMState(key, item);
                        this.ideaResult = true;
                    })
                };
                if (this.findBlockAIPriority == 2) {
                    this.level2Results.push(cell);
                } else {
                    this.level1Results.push(cell);
                }
            }
        }
    }

    onFindBlockForCreateBuilding(building, itemData) {
        let fsmState = this.model.getFSMState();
        // 建造房屋
        if (fsmState == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.model.setMyHomeId(building.buildingScript.getModel().getBuildingId());
        }
        // 建造火堆
        else if (fsmState == ResidentMeta.ResidentState.FindBlockForCreateFire) {
            // this.firNum = 1;
            // this.model.setMyHomeId(building.buildingScript.getModel().getBuildingId());
        }
    }

    canFindCreateBuildingBlock(fsmState) {
        return ResidentMeta.ResidentFindCreateBuildingBlockAIMap[fsmState];
    }

    // 是否能够去搜索
    canFindCreateBuildingBlockCondition(findType, itemData) {
        // 建造房屋
        if (findType == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.findBlockAIPriority = 1;
            return RandomMgr.randomYes() && this.model.getMyHomeId() == 0 && this.model.getSex() == 1 &&
                this.model.getAge() >= ResidentMeta.ResidentAdultAge &&
                BuildingMgr.getInstance().canCreateBuildingForResource(BuildingMeta.BuildingType.HomeType);
        }
        // 建造火堆
        else if (findType == ResidentMeta.ResidentState.FindBlockForCreateFire) {
            if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
                return false;
            }
            if (!BuildingMgr.getInstance().canCreateBuildingForResource(BuildingMeta.BuildingType.FireType)) {
                return false;
            }
            if (this.model.getTemperature() >= ResidentMeta.ResidentStandardTemperature - 3) {
                return false;
            }
            let buildings = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.FireType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (buildings.length != 0) {
                return false;
            }
            return true;
        }
    }
}