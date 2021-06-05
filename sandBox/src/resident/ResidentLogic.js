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
        Laya.timer.clear(this, this.onDoWorkFinish);
        Laya.timer.clear(this, this.hideTip);
    }

    // 注册消息
    rigsterAllEvents() {
        EventMgr.getInstance().registEvent(GameEvent.CREATE_HOME_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_HOSPITAL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_SCHOOL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_POWERPLANT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_SHOP_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_FARMLAND_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_PASTURE_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_OPERA_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_POLICESTATION_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_LAB_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_OFFICE_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.CREATE_CHILDSCHOOL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_SICK, this, this.onSick);
        EventMgr.getInstance().registEvent(GameEvent.RESIDENT_DIE, this, this.onDie);
    }

    removeAllEvents() {
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_HOME_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_HOSPITAL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_SCHOOL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_POWERPLANT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_SHOP_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_FARMLAND_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_PASTURE_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_OPERA_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_POLICESTATION_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_LAB_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_OFFICE_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_CHILDSCHOOL_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.HUNT_FINISH, this, this.onDoWorkFinish);
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_SICK, this, this.onSick);
        EventMgr.getInstance().removeEvent(GameEvent.RESIDENT_DIE, this, this.onDie);
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
            this.willCreateHome = param;
            this.setAnim(ResidentMeta.ResidentAnim.Work);
            this.setStateAniVisible(true);
            this.setStateAni("ani2");
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.willCreateHome.buildingScript.startCreate();
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
            let script = this.curEatingFood.getComponent(FoodLogic);
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
        // 跑去建造医院
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateHospital) {
            this.willCreateHospital = param;
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.startGoToContinueCreateHospital(this.willCreateHospital);
        }
        // 建造医院
        else if (state == ResidentMeta.ResidentState.CreateHospital) {
            if (this.willCreateHospital) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateHospital.buildingScript.startCreate();
            }
        }
        // 跑去建造发电厂
        else if (state == ResidentMeta.ResidentState.GotoContinueCreatePowerPlant) {
            this.willCreatePowerPlant = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreatePowerPlant(this.willCreatePowerPlant);
        }
        // 建造发电厂
        else if (state == ResidentMeta.ResidentState.CreatePowerPlant) {
            if (this.willCreatePowerPlant) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreatePowerPlant.buildingScript.startCreate();
            }
        }
        // 跑去建造商店
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateShop) {
            this.willCreateShop = param;
            this.willCreateShop.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateShop(this.willCreateShop);
        }
        // 建造商店
        else if (state == ResidentMeta.ResidentState.CreateShop) {
            if (this.willCreateShop) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateShop.buildingScript.startCreate();
            }
        }
        // 跑去建造农田
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateFarmLand) {
            this.willCreateFarmLand = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateFarmLand(this.willCreateFarmLand);
        }
        // 建造农田
        else if (state == ResidentMeta.ResidentState.CreateFarmLand) {
            if (this.willCreateFarmLand) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateFarmLand.buildingScript.startCreate();
            }
        }
        // 跑去建造牧场
        else if (state == ResidentMeta.ResidentState.GotoContinueCreatePasture) {
            this.willCreatePasture = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreatePasture(this.willCreatePasture);
        }
        // 建造牧场
        else if (state == ResidentMeta.ResidentState.CreatePasture) {
            if (this.willCreatePasture) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreatePasture.buildingScript.startCreate();
            }
        }
        // 跑去建造歌剧院
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateOpera) {
            this.willCreateOpera = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateOpera(this.willCreateOpera);
        }
        // 建造歌剧院
        else if (state == ResidentMeta.ResidentState.CreateOpera) {
            if (this.willCreateOpera) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateOpera.buildingScript.startCreate();
            }
        }
        // 跑去建造写字楼
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateOffice) {
            this.willCreateOffice = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateOffice(this.willCreateOffice);
        }
        // 建造写字楼
        else if (state == ResidentMeta.ResidentState.CreateOffice) {
            if (this.willCreateOffice) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateOffice.buildingScript.startCreate();
            }
        }
        // 跑去建造警察局
        else if (state == ResidentMeta.ResidentState.GotoContinueCreatePoliceStation) {
            this.willCreatePoliceStation = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreatePoliceStation(this.willCreatePoliceStation);
        }
        // 建造警察局
        else if (state == ResidentMeta.ResidentState.CreatePoliceStation) {
            if (this.willCreatePoliceStation) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreatePoliceStation.buildingScript.startCreate();
            }
        }
        // 跑去建造科学实验室
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateLab) {
            this.willCreateLab = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateLab(this.willCreateLab);
        }
        // 建造科学实验室
        else if (state == ResidentMeta.ResidentState.CreateLab) {
            if (this.willCreateLab) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateLab.buildingScript.startCreate();
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
            Laya.timer.once(ResidentMeta.ResidentTreatTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
        }
        // 跑去建造学校
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateSchool) {
            this.willCreateSchool = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateSchool(this.willCreateSchool);
        }
        // 建造学校
        else if (state == ResidentMeta.ResidentState.CreateSchool) {
            if (this.willCreateSchool) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateSchool.buildingScript.startCreate();
            }
        }
        // 跑去建造幼儿园
        else if (state == ResidentMeta.ResidentState.GotoContinueCreateChildSchool) {
            this.willCreateChildSchool = param;
            param.buildingScript.joinCreateBuilding(this.model.getResidentId());
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startGoToContinueCreateChildSchool(this.willCreateChildSchool);
        }
        // 建造幼儿园
        else if (state == ResidentMeta.ResidentState.CreateChildSchool) {
            if (this.willCreateChildSchool) {
                this.setAnim(ResidentMeta.ResidentAnim.Work);
                this.setStateAniVisible(true);
                this.setStateAni("ani2");
                this.willCreateChildSchool.buildingScript.startCreate();
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
            Laya.timer.once(ResidentMeta.ResidentLearnTime, this, this.onDoWorkFinish, [this.makeParam(null)]);
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
        // 吃食物完成
        let state = this.model.getFSMState();
        if (state == ResidentMeta.ResidentState.EatFood) {
            let script = this.curEatingFood.getComponent(FoodLogic);
            let foodModel = script.getModel();
            this.model.addFood(foodModel.getFood());
            foodModel.setFoodState(FoodMeta.FoodState.EatFinish);
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
                AnimalMgr.getInstance().removeAnimalById(this.hurtAnimalId);
                this.hurtAnimal = null;
                this.hurtAnimalId = null;
            }
        }
        // 打猎中
        else if (state == ResidentMeta.ResidentState.Hunting) {
            if (this.hurtAnimal) {
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
            this.willCreateHospital = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateSchool) {
            this.willCreateSchool = null;
        }
        else if (state == ResidentMeta.ResidentState.CreatePowerPlant) {
            this.willCreatePowerPlant = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateShop) {
            this.willCreateShop = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateFarmLand) {
            this.willCreateFarmLand = null;
        }
        else if (state == ResidentMeta.ResidentState.CreatePasture) {
            this.willCreatePasture = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateOpera) {
            this.willCreateOpera = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateOffice) {
            this.willCreateOffice = null;
        }
        else if (state == ResidentMeta.ResidentState.CreatePoliceStation) {
            this.willCreatePoliceStation = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateLab) {
            this.willCreateLab = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateHome) {
            this.willCreateHome = null;
        }
        else if (state == ResidentMeta.ResidentState.CreateChildSchool) {
            this.willCreateChildSchool = null;
        }
        // 治疗完成
        else if (state == ResidentMeta.ResidentState.Treating) {
            this.model.setSick(1);
            this.setBuffAniVisible(false);
            this.stopBuffAni();
        }
        // 学习完成
        else if (state == ResidentMeta.ResidentState.Learning) {
            // this.model.setSick(1);
        }
        this.doWorkFinishClearFunc();
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

    // 随机跑一个位置
    startGotoRandomPoint(p) {
        this.gotoDestExt({
            x: p.x - this.owner.width / 2,
            y: p.y - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
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

    // 跑去未建成的幼儿园周围
    startGoToContinueCreateChildSchool(childSchool) {
        this.gotoDestExt({
            x: childSchool.x + childSchool.width / 2 - this.owner.width / 2,
            y: childSchool.y + childSchool.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateChildSchool, childSchool);
        }));
    }

    // 跑去未建成的发电厂周围
    startGoToContinueCreatePowerPlant(powerPlant) {
        this.gotoDestExt({
            x: powerPlant.x + powerPlant.width / 2 - this.owner.width / 2,
            y: powerPlant.y + powerPlant.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreatePowerPlant, powerPlant);
        }));
    }

    // 跑去未建成的商店周围
    startGoToContinueCreateShop(shop) {
        this.gotoDestExt({
            x: shop.x + shop.width / 2 - this.owner.width / 2,
            y: shop.y + shop.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateShop, shop);
        }));
    }

    // 跑去未建成的农田周围
    startGoToContinueCreateFarmLand(farmLand) {
        this.gotoDestExt({
            x: farmLand.x + farmLand.width / 2 - this.owner.width / 2,
            y: farmLand.y + farmLand.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateFarmLand, farmLand);
        }));
    }


    // 跑去未建成的牧场周围
    startGoToContinueCreatePasture(pasture) {
        this.gotoDestExt({
            x: pasture.x + pasture.width / 2 - this.owner.width / 2,
            y: pasture.y + pasture.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreatePasture, pasture);
        }));
    }

    // 跑去未建成的歌剧院周围
    startGoToContinueCreateOpera(opera) {
        this.gotoDestExt({
            x: opera.x + opera.width / 2 - this.owner.width / 2,
            y: opera.y + opera.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateOpera, opera);
        }));
    }

    // 跑去未建成的写字楼周围
    startGoToContinueCreateOffice(office) {
        this.gotoDestExt({
            x: office.x + office.width / 2 - this.owner.width / 2,
            y: office.y + office.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateOffice, office);
        }));
    }

    // 跑去未建成的警察局周围
    startGoToContinueCreatePoliceStation(policeStation) {
        this.gotoDestExt({
            x: policeStation.x + policeStation.width / 2 - this.owner.width / 2,
            y: policeStation.y + policeStation.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreatePoliceStation, policeStation);
        }));
    }

    // 跑去未建成的科学实验室周围
    startGoToContinueCreateLab(lab) {
        this.gotoDestExt({
            x: lab.x + lab.width / 2 - this.owner.width / 2,
            y: lab.y + lab.height - this.owner.height,
        }, Laya.Handler.create(this, function () {
            this.refreshFSMState(ResidentMeta.ResidentState.CreateLab, lab);
        }));
    }


    // 赶去打猎
    startJoinHunt() {
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
            myHome.buildingScript.startMakeLove(Laya.Handler.create(this, function () {
                let womanId = this.model.getLoverId();
                let woman = this.residentMgrInstance.getResidentById(womanId);
                woman.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.residentMgrInstance.createResidentByConfig({
                    parent: GameContext.mapContainer,
                    x: woman.x, y: woman.y, age: 1
                });
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
                    let toCreateHomeX = this.owner.x - BuildingMeta.HomeWidth / 2 + this.owner.width / 2;
                    let toCreateHomeY = this.owner.y - BuildingMeta.HomeHeight + this.owner.height;
                    if (ResidentHelper.isOccupySpace(toCreateHomeX, toCreateHomeY,
                        BuildingMeta.HomeWidth, BuildingMeta.HomeHeight)) {
                        let building = BuildingMgr.getInstance().createBuildingByConfig({
                            parent: GameContext.mapContainer,
                            x: toCreateHomeX,
                            y: toCreateHomeY,
                            prefab: ResourceMeta.HomePrefabPath,
                            buildingType: BuildingMeta.BuildingType.HomeType,
                        });
                        this.refreshFSMState(ResidentMeta.ResidentState.CreateHome, building);
                        this.model.setMyHomeId(building.buildingScript.getModel().getBuildingId());
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
        let nearstWater = WaterMgr.getInstance().getNearstWater(this.owner.x, this.owner.y);
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
        });
        if (nearstFood) {
            let script = nearstFood.getComponent(FoodLogic);
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
        Laya.timer.once(time + 100, this, this.onGotoTimeOut, [info, handler]);
        this.owner.SSSX = dstX;
        this.owner.SSSY = dstY;
        let dst = null;
        if (dstX != this.owner.x) {
            dst = { x: dstX};
        }
        if (dstY != this.owner.y) {
            dst = { y: dstY};
        }
        this.tweenObject = Laya.Tween.to(this.owner, dst, time, null, Laya.Handler.create(this, function () {
            this.stopAGoto();
            if (handler) {
                handler.run();
            }
        }));
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
        // if (this.tweenObject) {
        //     Laya.Tween.clear(this.tweenObject);
        //     this.tweenObject = null;
        // }
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




        // =================================正式================start

        // 喝水
        let cell5 = {
            func: Laya.Handler.create(this, function () {
                this.refreshFSMState(ResidentMeta.ResidentState.FindWater);
                this.ideaResult = true;
            })
        };
        let water = this.model.getWater();
        if (water < ResidentMeta.ResidentWaterNeedValue) {
            this.level1Results.push(cell5);
        } else if (water < 90) {
            this.level2Results.push(cell5);
        }

        //吃饭
        let cell6 = {
            func: Laya.Handler.create(this, function (param) {
                let canFood = FoodMgr.getInstance().canFindFood();
                if (canFood) {
                    this.refreshFSMState(ResidentMeta.ResidentState.FindFood);
                    this.ideaResult = true;
                }
            })
        };
        let food = this.model.getFood();
        if (food < ResidentMeta.ResidentFoodNeedValue) {
            this.level1Results.push(cell6);
        } else if (food < 90) {
            this.level2Results.push(cell6);
        }

        // 社交
        let cell7 = {
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
        let social = this.model.getSocial();
        if (social < ResidentMeta.ResidentSocialNeedValue) {
            this.level1Results.push(cell7);
        } else if (social < 90) {
            this.level2Results.push(cell7);
        }

        // 砍树
        let cell8 = {
            func: Laya.Handler.create(this, function (param) {
                this.refreshFSMState(ResidentMeta.ResidentState.FindTree);
                this.ideaResult = true;
            })
        };
        if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell8);
        }

        // 收集石头
        let cell9 = {
            func: Laya.Handler.create(this, function (param) {
                this.refreshFSMState(ResidentMeta.ResidentState.FindStone);
                this.ideaResult = true;
            })
        };
        if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell9);
        }

        // 跑去打猎
        let cell10 = {
            func: Laya.Handler.create(this, function (param) {
                let animal = AnimalMgr.getInstance().getAnimalForAttack(this.owner.x, this.owner.y, 200);
                if (animal) {
                    this.refreshFSMState(ResidentMeta.ResidentState.JoinHunt, animal);
                    this.ideaResult = true;
                }
            })
        };
        if (RandomMgr.randomYes() && this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell10);
        }


        // 盖房子
        if (RandomMgr.randomYes() && this.model.getMyHomeId() == 0 && this.model.getSex() == 1 &&
            this.model.getAge() >= ResidentMeta.ResidentAdultAge
            && GameModel.getInstance().getTreeNum() >= BuildingMeta.CreateHomeNeedValues.tree &&
            GameModel.getInstance().getStoneNum() >= BuildingMeta.CreateHomeNeedValues.stone) {
            let cell11 = {
                func: Laya.Handler.create(this, function (param) {
                    this.refreshFSMState(ResidentMeta.ResidentState.FindBlockForCreateHome);
                    this.ideaResult = true;
                })
            };
            this.level1Results.push(cell11);
        }

        // 找恋人
        if (this.model.canAskMarry()) {
            let home = BuildingMgr.getInstance().getBuildingById(this.model.getMyHomeId());
            if (home.buildingScript.getModel().getBuildingState() == BuildingMeta.BuildingState.Noraml) {
                let cell12 = {
                    func: Laya.Handler.create(this, function (param) {
                        let woman = this.residentMgrInstance.getCanMarryWoman(this.model);
                        if (woman) {
                            let womanScript = woman.getComponent(ResidentLogic);
                            let womanModel = womanScript.getModel()
                            GameModel.getInstance().setMarried(this.model, womanModel);
                            this.refreshFSMState(ResidentMeta.ResidentState.LoverMan);
                            womanScript.refreshFSMState(ResidentMeta.ResidentState.LoverWoman);
                            this.ideaResult = true;
                        }
                    })
                };
                this.level1Results.push(cell12);
            }
        }

        //赶着去溜达
        let cell21 = {
            func: Laya.Handler.create(this, function () {
                let p = RandomMgr.randomByArea(this.owner.x, this.owner.y, 200);
                if (ResidentHelper.isOccupySpace(this.owner.x,
                    this.owner.y,
                    this.owner.width,
                    this.owner.height)) {
                    this.refreshFSMState(ResidentMeta.ResidentState.RandomWalk, p);
                    this.ideaResult = true;
                }
            }),
        };
        this.level2Results.push(cell21);

        // 赶着去建造幼儿园
        let cell22 = {
            func: Laya.Handler.create(this, function (param) {
                let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
                    this.owner.y, BuildingMeta.BuildingType.ChildSchoolType,
                    500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
                if (building) {
                    this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateChildSchool, building);
                    this.ideaResult = true;
                }
            }),
        };
        if (this.model.getAge() >= ResidentMeta.ResidentAdultAge) {
            this.level2Results.push(cell22);
        }
        // =================================正式================end







        // // 赶着去建造发电厂
        // let cell13 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.PowerPlantType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreatePowerPlant, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell13);

        // // 赶着去建造商店
        // let cell14 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.ShopType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateShop, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell14);

        // // 赶着去建造农田
        // let cell15 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.FarmLandType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateFarmLand, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell15);

        // // 赶着去建造牧场
        // let cell16 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.PastureType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreatePasture, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell16);

        // //赶着去建造歌剧院
        // let cell17 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.OperaType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateOpera, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell17);


        // // 打架
        // let cell18 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let resident = this.residentMgrInstance.getACanFightResident(this.owner.x, this.owner.y);
        //         if (resident) {
        //             let fightModel = GameModel.getInstance().getOrCreateFightPoint(this.owner.x, this.owner.y, 30, 5);
        //             if (fightModel.getFightNum() == 0) {
        //                 fightModel.addFightNum(2);
        //                 this.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
        //                 resident.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
        //             } else {
        //                 fightModel.addFightNum(1);
        //                 this.refreshFSMState(ResidentMeta.ResidentState.JoinFight, fightModel);
        //             }
        //             this.ideaResult = true;
        //         }
        //     })
        // };
        // let social = this.model.getSocial();
        // if (social < ResidentMeta.ResidentSocialLowToFight) {
        //     this.level2Results.push(cell18);
        // }

        // //赶着去建造警察局
        // let cell19 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.PoliceStationType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreatePoliceStation, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell19);

        // //赶着去建造科学实验室
        // let cell20 = {
        //     func: Laya.Handler.create(this, function (param) {
        //         let building = BuildingMgr.getInstance().getNearstBuilding(this.owner.x,
        //             this.owner.y, BuildingMeta.BuildingType.OfficeType,
        //             500, [BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        //         if (building) {
        //             this.refreshFSMState(ResidentMeta.ResidentState.GotoContinueCreateOffice, building);
        //             this.ideaResult = true;
        //         }
        //     }),
        // };
        // this.level2Results.push(cell20);

        // 21
    }

    // 执行策略
    doResult() {
        while (this.level1Results.length != 0) {
            let index = RandomMgr.randomNumer(0, this.level1Results.length - 1);
            let cell = this.level1Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
            this.level1Results.splice(index, 1);
        }

        while (this.level2Results.length != 0) {
            let index = RandomMgr.randomNumer(0, this.level2Results.length - 1);
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

}