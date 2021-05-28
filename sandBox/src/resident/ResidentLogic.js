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
import HomeLogic from "../building/HomeLogic";
import AnimalMgr from "../animal/AnimalMgr";
import AnimalLogic from "../animal/AnimalLogic";
import HospitalLogic from "../building/HospitalLogic";
import SchoolLogic from "../building/SchoolLogic";
import Utils from "../helper/Utils";
import PowerPlantLogic from "../building/PowerPlantLogic";

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
        this.owner.zOrder = ResidentMeta.ResidentZOrder;
        this.curDirect = null;
        this.movePaths = [];
    }

    onDisable() {
        this.stopGoto();
        this.removeAllEvents();
        Laya.timer.clear(this, this.onDoWorkFinish);
    }

    // 注册消息
    rigsterAllEvents() {
        EventMgr.getInstance().registEvent(GameEvent.CREATE_HOME_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_HOSPITAL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_SCHOOL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_POWERPLANT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_SICK, this, this.onSick);
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_DIE, this, this.onDie);
    }

    removeAllEvents() {
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_HOME_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_HOSPITAL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_SCHOOL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_POWERPLANT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_SICK, this, this.onSick);
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_DIE, this, this.onDie);
    }

    //初始化控件
    initControl() {
        this.initAnim();
        this.stateAni = this.owner.getChildByName("stateAni");
        this.buffAni = this.owner.getChildByName("buff");
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
        } else if (this.model.getSex() == 1) {
            this.ani = this.manAni;
            this.womanAni.destroy(true);
            this.womanAni = null;
        } else {
            this.ani = this.womanAni;
            this.manAni.destroy(true);
            this.manAni = null;
        }
        this.ani.visible = true;
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    getModel() {
        return this.model;
    }

    // 设置动画
    setAnim(anim) {
        if (this.curStateAnim == anim) {
            return;
        }
        if (anim == ResidentMeta.ResidentAnim.Idle) {
            this.ani.play(0, true, "idle");
        } else if (anim == ResidentMeta.ResidentAnim.Walk) {

        } else if (anim == ResidentMeta.ResidentAnim.Enjoy) {
            this.ani.play(0, true, "enjoy");
        } else if (anim == ResidentMeta.ResidentAnim.Work) {
            this.ani.play(0, true, "work");
        } else if (anim == ResidentMeta.ResidentAnim.Die) {
            this.ani.play(0, false, "die");
        }
        this.curStateAnim = anim;
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
        if (this.model.getFSMState() == state) {
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
        // 待机
        if (state == ResidentMeta.ResidentState.IdleState) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
        }
        // 寻找可以盖房子的地方
        else if (state == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindCreateHomeBlock();
        }
        // 盖房子
        else if (state == ResidentMeta.ResidentState.CreateHome) {
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            this.setStateAniVisible(true);
            this.setStateAni("ani2");
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
            Laya.timer.once(ResidentMeta.CutDownTreeTimeStep * 3, this, this.onDoWorkFinish);
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
            Laya.timer.once(ResidentMeta.CollectStoneTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 搜索食物
        else if (state == ResidentMeta.ResidentState.FindFood) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstFood();
        }
        // 吃食物
        else if (state == ResidentMeta.ResidentState.EatFood) {
            this.setStateAniVisible(true);
            this.setAnim(ResidentMeta.ResidentAnim.Enjoy);
            this.setStateAni("ani3");
            Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
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
            Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
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
            Laya.timer.once(ResidentMeta.SocialTimeStep * 10, this, this.onDoWorkFinish, [param]);
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
            this.setAnim(ResidentMeta.ResidentAnim.Die);
            Laya.timer.once(ResidentMeta.DieTime, this, this.onDoWorkFinish);
        }
        // 跑去建造医院
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateHospital) {
            this.willCreateHospital = param;
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateHospital(this.willCreateHospital);
        }
        // 建造医院
        else if (state == ResidentMeta.ResidentState.CreateHospital) {
            if (this.willCreateHospital) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                let script = this.willCreateHospital.building.getComponent(HospitalLogic);
                script.startCreate();
            }
        }
        // 跑去建造医院
        else if (state == ResidentMeta.ResidentState.GotoContinueCreatePowerPlant) {
            this.willCreatePowerPlant = param;
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreatePowerPlant(this.willCreatePowerPlant);
        }
        // 建造医院
        else if (state == ResidentMeta.ResidentState.CreatePowerPlant) {
            if (this.willCreatePowerPlant) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                let script = this.willCreatePowerPlant.building.getComponent(PowerPlantLogic);
                script.startCreate();
            }
        }
        // 去治疗
        else if (state == ResidentMeta.ResidentState.GotoTreat) {
            let hospital = param;
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.setStateAniVisible(false);
            this.startGoToHospitalForTreat(hospital);
        }
        // 去治疗
        else if (state == ResidentMeta.ResidentState.Treating) {
            this.setVisible(false);
            Laya.timer.once(ResidentMeta.ResidentTreatTime, this, this.onDoWorkFinish);
        }
        // 跑去建造学校
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateSchool) {
            this.willCreateSchool = param;
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateSchool(this.willCreateSchool);
        }
        // 建造学校
        else if (state == ResidentMeta.ResidentState.CreateSchool) {
            if (this.willCreateSchool) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                let script = this.willCreateSchool.building.getComponent(SchoolLogic);
                script.startCreate();
            }
        }
        // 跑去学校
        else if (state == ResidentMeta.ResidentState.GoToSchool) {
            let school = param;
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGotoSchoolForLearn(school);
        }
        // 学习
        else if (state == ResidentMeta.ResidentState.Learning) {
            this.model.addTeach(100);
            this.setVisible(false);
            Laya.timer.once(ResidentMeta.ResidentLearnTime, this, this.onDoWorkFinish);
        }
    }

    // 工作完成
    onDoWorkFinish(param) {
        // 吃食物完成
        let state = this.model.getFSMState();
        if (state == ResidentMeta.ResidentState.EatFood) {
            let script = this.curEatingFood.getComponent(FoodLogic);
            let foodModel = script.getModel();
            this.model.addFood(foodModel.getFood());
            foodModel.setState(FoodMeta.FoodState.EatFinish);
            FoodMgr.getInstance().removeFoodById(foodModel.getFoodId());
            this.curEatingFood = null;
        }
        // 喝水完成
        else if (state == ResidentMeta.ResidentState.DrinkWater) {
            this.model.addWater(100);
        }
        // 砍树完成
        else if (state == ResidentMeta.ResidentState.CutDownTree) {
            GameModel.getInstance().addTreeNum(ResidentMeta.ResidentAddTreeBaseValue);
            EventMgr.getInstance().postEvent(GameEvent.REFRESH_RESOURCE_PANEL);
        }
        // 收集石头完成
        else if (state == ResidentMeta.ResidentState.CollectStone) {
            GameModel.getInstance().addStoneNum(ResidentMeta.ResidentAddStoneBaseValue);
            EventMgr.getInstance().postEvent(GameEvent.REFRESH_RESOURCE_PANEL);
        }
        // 聊天结束
        else if (state == ResidentMeta.ResidentState.TalkingAbout) {
            let talkingModel = param;
            talkingModel.addTalkingNum(-1);
            this.model.addSocial(ResidentMeta.ResidentAddSocialBaseValue);
            if (talkingModel.getTalkingNum() == 0) {
                GameModel.getInstance().removeTalkingPoint(talkingModel.getTalkingPointId());
            }
        }
        // 正在赶去打猎
        else if (state == ResidentMeta.ResidentState.JoinHunt) {
            if (param != null && this.hurtAnimal && this.hurtAnimal == param) {
                AnimalMgr.getInstance().removeAnimalById(this.hurtAnimalId);
                this.hurtAnimal = null;
                this.hurtAnimalId = null;
            }
        }
        // 打猎中
        else if (state == ResidentMeta.ResidentState.Hunting) {
            if (param != null && this.hurtAnimal && this.hurtAnimal == param) {
                AnimalMgr.getInstance().removeAnimalById(this.hurtAnimalId);
                this.hurtAnimal = null;
                this.hurtAnimalId = null;
            }
        }
        else if (state == ResidentMeta.ResidentState.Die) {
            this.residentMgrInstance.removeResidentById(this.model.getResidentId());
            return;
        }
        else if (state == ResidentMeta.ResidentState.CreateHospital) {
            // todo 此处要判断是不是我自己在建造的完成了，不能所有人都建造完
            let script = this.willCreateHospital.building.getComponent(HospitalLogic);
            if (!script || script.getModel() != param.model) {
                return;
            }
            this.willCreateHospital = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateSchool) {
            // todo 此处要判断是不是我自己在建造的完成了，不能所有人都建造完
            let script = this.willCreateSchool.building.getComponent(SchoolLogic);
            if (!script || script.getModel() != param.model) {
                return;
            }
            this.willCreateSchool = null;
        }
        else if (state == ResidentMeta.ResidentState.CreatePowerPlant) {
            // todo 此处要判断是不是我自己在建造的完成了，不能所有人都建造完
            let script = this.willCreatePowerPlant.building.getComponent(PowerPlantLogic);
            if (!script || script.getModel() != param.model) {
                return;
            }
            this.willCreatePowerPlant = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateHome) {
            // todo 此处要判断是不是我自己在建造的完成了，不能所有人都建造完
        }
        // 治疗完成
        else if (state == ResidentMeta.ResidentState.Treating) {
            this.model.setSick(1);
            this.setBuffAniVisible(false);
            this.stopBuffAni();
        }
        // 学习完成
        else if (state == ResidentMeta.ResidentState.Learning) {
            this.model.setSick(1);
        }
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    // 跑去学校
    startGotoSchoolForLearn(school) {
        this.gotoDestExt({
            x: school.x + school.width / 2 - this.owner.width / 2,
            y: school.y + school.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.Learning, school);
        }));
    }

    // 跑去医院准备治疗
    startGoToHospitalForTreat(hospital) {
        this.gotoDestExt({
            x: hospital.x + hospital.width / 2 - this.owner.width / 2,
            y: hospital.y + hospital.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.Treating, hospital);
        }));
    }

    // 跑去未建成的医院周围
    startGoToContinueCreateHospital(hospital) {
        this.gotoDestExt({
            x: hospital.x + hospital.width / 2 - this.owner.width / 2,
            y: hospital.y + hospital.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateHospital, hospital);
        }));
    }

    // 跑去未建成的学校周围
    startGoToContinueCreateSchool(school) {
        this.gotoDestExt({
            x: school.x + school.width / 2 - this.owner.width / 2,
            y: school.y + school.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateSchool, school);
        }));
    }

    // 跑去未建成的学校周围
    startGoToContinueCreatePowerPlant(powerPlant) {
        this.gotoDestExt({
            x: powerPlant.x + powerPlant.width / 2 - this.owner.width / 2,
            y: powerPlant.y + powerPlant.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreatePowerPlant, powerPlant);
        }));
    }



    // 赶去打猎
    startJoinHunt() {
        let script = this.hurtAnimal.getComponent(AnimalLogic);
        script.pauseWalk();
        let pos = RandomMgr.randomByArea3(this.hurtAnimal.x + this.hurtAnimal.width / 2, this.hurtAnimal.y + this.hurtAnimal.height / 2, 90, 150);
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

    // 开始生孩子
    startMakelove() {
        if (this.model.getSex() == 1) {
            let myHome = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
            myHome.building.getComponent(HomeLogic).startMakeLove(Laya.Handler.create(this, function () {
                let womanId = this.model.getLoverId();
                let woman = this.residentMgrInstance.getResidentById(womanId);
                woman.getComponent(ResidentLogic).refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);

                this.residentMgrInstance.createResidentByConfig({
                    parent: GameContext.mapContainer,
                    x: woman.x, y: woman.y, age: 1
                }, Laya.Handler.create(this, function (obj) {
                }));
            }));
        }
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
                woman.getComponent(ResidentLogic).refreshFSMState(ResidentMeta.ResidentState.LoverGoHomeMakeLove);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 和媳妇一起回家生孩子
    startGoHomeAndWoman() {
        let myHome = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
        if (myHome) {
            this.gotoDestExt({
                x: myHome.x + BuildingMeta.HomeWidth / 2 - this.owner.width / 2,
                y: myHome.y + BuildingMeta.HomeHeight - this.owner.height,
            }, Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.LoverMakeLove);
            }));
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 开始寻找可以建房子的空地
    startFindCreateHomeBlock() {
        if (this.findCreateHomeTimes < ResidentMeta.ResidentFindPathTimes) {
            if (this.model.getFSMState() == ResidentMeta.ResidentState.FindBlockForCreateHome) {
                let dstP = RandomMgr.randomByArea2(this.owner.x,
                    this.owner.y,
                    200,
                    GameContext.mapWidth, GameContext.mapHeight, 200, 200);
                this.gotoDestExt({ x: dstP.x, y: dstP.y }, Laya.Handler.create(this, function () {
                    this.findCreateHomeTimes++;
                    // 查看此处可不可以盖房
                    let toCreateHomeX = this.owner.x - BuildingMeta.HomeWidth / 2 + this.owner.width / 2;
                    let toCreateHomeY = this.owner.y - BuildingMeta.HomeHeight + this.owner.height;
                    if (!BuildingMgr.getInstance().intersectsBuilding(
                        toCreateHomeX,
                        toCreateHomeY,
                        BuildingMeta.HomeWidth,
                        BuildingMeta.HomeHeight) &&
                        !TreeMgr.getInstance().intersectsTree(toCreateHomeX,
                            toCreateHomeY,
                            BuildingMeta.HomeWidth,
                            BuildingMeta.HomeHeight)) {
                        let buildingCell = BuildingMgr.getInstance().createHomeByConfig({
                            parent: this.owner.parent,
                            x: toCreateHomeX,
                            y: toCreateHomeY
                        });
                        this.model.setMyHomeId(buildingCell.model.getBuildingId());
                        this.refreshFSMState(ResidentMeta.ResidentState.CreateHome);
                    } else {
                        this.startFindCreateHomeBlock();
                    }
                }));
            }
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.findCreateHomeTimes = 0;
            this.makeIdea();
        }
    }

    startFindANearstTree() {
        if (this.model.getFSMState() == ResidentMeta.ResidentState.FindTree) {
            let nearstTree = TreeMgr.getInstance().getNearstTree(this.owner.x, this.owner.y);
            if (nearstTree) {
                this.gotoDestExt({
                    x: nearstTree.x + nearstTree.width / 2 - this.owner.width / 2,
                    y: nearstTree.y + nearstTree.height - this.owner.height
                }, Laya.Handler.create(this, function () {
                    this.refreshFSMState(ResidentMeta.ResidentState.CutDownTree);
                }));
            } else {
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 寻找最近的水源
    startFindANearstWater() {
        if (this.model.getFSMState() == ResidentMeta.ResidentState.FindWater) {
            let nearstWater = WaterMgr.getInstance().getNearstWater(this.owner.x, this.owner.y);
            if (nearstWater) {
                let dsp = RandomMgr.randomPointInRect(nearstWater.x, nearstWater.y, nearstWater.width, nearstWater.height);
                this.gotoDestExt({ x: dsp.x, y: dsp.y }, Laya.Handler.create(this, function () {
                    this.refreshFSMState(ResidentMeta.ResidentState.DrinkWater);
                }));
            } else {
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 寻找最近的食物
    startFindANearstFood() {
        if (this.model.getFSMState() == ResidentMeta.ResidentState.FindFood) {
            let nearstFood = FoodMgr.getInstance().getNearstFood({
                x: this.owner.x,
                y: this.owner.y,
                state: FoodMeta.FoodState.CanEat,
            });
            if (nearstFood) {
                let script = nearstFood.getComponent(FoodLogic);
                script.getModel().setState(FoodMeta.FoodState.Occupy);
                this.gotoDestExt({ x: nearstFood.x, y: nearstFood.y }, Laya.Handler.create(this, function () {
                    let script = nearstFood.getComponent(FoodLogic);
                    script.getModel().setState(FoodMeta.FoodState.Eating);
                    this.curEatingFood = nearstFood;
                    this.refreshFSMState(ResidentMeta.ResidentState.EatFood);
                }));
            } else {
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    startFindANearstStone() {
        if (this.model.getFSMState() == ResidentMeta.ResidentState.FindStone) {
            let nearstStone = StoneMgr.getInstance().getNearstStone(this.owner.x, this.owner.y);
            if (nearstStone) {
                let dsp = RandomMgr.randomPointInRect(nearstStone.x, nearstStone.y, nearstStone.width, nearstStone.height);
                this.gotoDestExt({ x: dsp.x, y: dsp.y }, Laya.Handler.create(this, function () {
                    this.refreshFSMState(ResidentMeta.ResidentState.CollectStone);
                }));
            } else {
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 行走到某个位置
    _gotoDest(info, handler) {
        this.stopGoto();
        let dstX = info.x;
        let dstY = info.y;
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let time = distance / ResidentMeta.ResidentMoveSpeed;
        this.tweenObject = Laya.Tween.to(this.owner, { x: dstX, y: dstY }, time * 1000, null, handler);
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
                this._gotoDest2(handler);
            }));
            this.movePaths.splice(0, 1);
        } else {
            if (handler) {
                handler.run();
            }
        }
    }

    // 行走到某个位置
    gotoDestExt(info, handler) {
        // 目标点
        let dstX = info.x;
        let dstY = info.y;
        // 当前点
        let curX = this.owner.x;
        let curY = this.owner.y;
        let xDelta = dstX - curX;
        let yDelta = dstY - curY;
        // let xDistance = Math.abs(xDelta);
        // let yDistance = Math.abs(yDelta);
        let signX = Utils.getSign2(xDelta);
        let signY = Utils.getSign2(yDelta);
        if (RandomMgr.randomYes()) {
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
            this.movePaths.push(p1);
            this.movePaths.push(p2);
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
            this.movePaths.push(p1);
            this.movePaths.push(p2);
        }
        this._gotoDest2(handler);
    }

    stopGoto() {
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
            this.movePaths = [];
            this.curDirect = null;
        }
    }



    // 处理策略
    processResult() {
        this.level1Results = [];
        this.level2Results = [];

        // // 赶着去建造学校
        // let cell1 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.SchoolType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateSchool, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell1);

        // // 跑去上课
        // if (this.model.getTeach() < 100) {
        //     let cell2 = {
        //         func: Laya.Handler.create(this, function (param) {
        //             let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //                 this.owner.y, BuildingMeta.BuildingType.SchoolType,
        //                 1000, BuildingMeta.BuildingState.Noraml);
        //             if (building) {
        //                 this.refreshFSMState(ResidentMeta.ResidentState.GoToSchool, building);
        //                 this.ideaResult = true;
        //             }
        //         })
        //     };
        //     this.level2Results.push(cell2);
        // }

        // // 赶着去建造医院
        // let cell3 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.HospitalType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateHospital, building);
        //             this.ideaResult = true;
        //         }
        //     })
        // };
        // this.level1Results.push(cell3);

        // // 跑去治病
        // if (this.model.getSick() == 2) {
        //     let cell4 = {
        //         func: Laya.Handler.create(this, function (param) {
        //             let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //                 this.owner.y, BuildingMeta.BuildingType.HospitalType,
        //                 1000, BuildingMeta.BuildingState.Noraml);
        //             if (building) {
        //                 this.refreshFSMState(ResidentMeta.ResidentState.GotoTreat, building);
        //                 this.ideaResult = true;
        //             }
        //         })
        //     };
        //     this.level1Results.push(cell4);
        // }


        // //喝水
        // let cell5 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         this.refreshFSMState(ResidentMeta.ResidentState.FindWater);
        //         this.ideaResult = true;
        //     })
        // };
        // let water = this.model.getWater();
        // if (water < ResidentMeta.ResidentWaterNeedValue) {
        //     this.level1Results.push(cell5);
        // } else if (water < 100) {
        //     this.level2Results.push(cell5);
        // }


        // //吃饭
        // let cell6 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let canFood = FoodMgr.getInstance().canFindFood();
        //         if (canFood) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.FindFood);
        //             this.ideaResult = true;
        //         }
        //     })
        // };
        // let food = this.model.getFood();
        // if (food < ResidentMeta.ResidentFoodNeedValue) {
        //     this.level1Results.push(cell6);
        // } else if (food < 100) {
        //     this.level2Results.push(cell6);
        // }


        // // 社交
        // let cell7 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let resident = this.residentMgrInstance.getACanSocialResident(this.owner.x, this.owner.y);
        //         if (resident) {
        //             let talkingModel = GameModel.getInstance().getOrCreateTalkingPoint(this.owner.x, this.owner.y, 100, 5);
        //             if (talkingModel.getTalkingNum() == 0) {
        //                 talkingModel.addTalkingNum(2);
        //                 this.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
        //                 resident.getComponent(ResidentLogic).refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
        //             } else {
        //                 talkingModel.addTalkingNum(1);
        //                 this.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
        //             }
        //             this.ideaResult = true;
        //         }
        //     })
        // };
        // let social = this.model.getSocial();
        // if (social < ResidentMeta.ResidentSocialNeedValue) {
        //     this.level1Results.push(cell7);
        // } else if (social < 100) {
        //     this.level2Results.push(cell7);
        // }

        // // 砍树
        // let cell8 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         this.refreshFSMState(ResidentMeta.ResidentState.FindTree);
        //         this.ideaResult = true;
        //     })
        // };
        // this.level2Results.push(cell8);


        // // 收集石头
        // let cell9 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         this.refreshFSMState(ResidentMeta.ResidentState.FindStone);
        //         this.ideaResult = true;
        //     })
        // };
        // this.level2Results.push(cell9);


        // // 跑去打猎
        // let cell10 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let item = AnimalMgr.getInstance().getAnimalForAttack(this.owner.x, this.owner.y, 3000);
        //         if (item) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.JoinHunt, item);
        //             this.ideaResult = true;
        //         }
        //     })
        // };
        // this.level2Results.push(cell10);

        // // 盖房子
        // if (this.model.getMyHomeId() == 0 && this.model.getSex() == 1) {
        //     let cell11 = {
        //         func: Laya.Handler.create(this, function (param) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.FindBlockForCreateHome);
        //             this.ideaResult = true;
        //         })
        //     };
        //     this.level1Results.push(cell11);
        // }

        // // 找恋人
        // if (this.model.canAskMarry()) {
        //     let home = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
        //     if (home.model.getBuildingState() == BuildingMeta.BuildingState.Noraml) {
        //         let cell12 = {
        //             func: Laya.Handler.create(this, function (param) {
        //                 let woman = this.residentMgrInstance.getCanMarryWoman(this.model);
        //                 if (woman) {
        //                     let womanScript = woman.getComponent(ResidentLogic);
        //                     let womanModel = womanScript.getModel()
        //                     GameModel.getInstance().setMarried(this.model, womanModel);
        //                     this.refreshFSMState(ResidentMeta.ResidentState.LoverMan);
        //                     womanScript.refreshFSMState(ResidentMeta.ResidentState.LoverWoman);
        //                     this.ideaResult = true;
        //                 }
        //             })
        //         };
        //         this.level1Results.push(cell12);
        //     }
        // }

        // 赶着去建造发电厂
        let cell13 = {
            func: Laya.Handler.create(this, function (param) {
                let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                    this.owner.y, BuildingMeta.BuildingType.PowerPlantType,
                    500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
                if (building) {
                    this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreatePowerPlant, building);
                    this.ideaResult = true;
                }
            }),
        };
        this.level2Results.push(cell13);
    }

    // 执行策略
    doResult() {
        if (this.level1Results.length != 0) {
            let index = RandomMgr.randomNumer(0, this.level1Results.length - 1);
            let cell = this.level1Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
        }
        if (this.level2Results.length != 0) {
            let index = RandomMgr.randomNumer(0, this.level2Results.length - 1);
            let cell = this.level2Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
        }
    }

    // 做出策略
    makeIdea() {
        if (this.model.getFSMState() != ResidentMeta.ResidentState.IdleState) {
            return;
        }
        if (!RandomMgr.randomYes(this.model.getPositive())) {
            return;
        }
        // 处理可以做的事情
        this.processResult();
        this.doResult();
    }

}