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
        EventMgr.getInstance().registEvent(GameEvent.CREATE_HOME_FINISH, this, this.onDoWorkFinish);

        this.initModel();
        this.initControl();
        this.initTouch();
        this.owner.zOrder = ResidentMeta.ResidentZOrder;
    }

    onDisable() {
        this.stopGoto();
        EventMgr.getInstance().removeEvent(GameEvent.CREATE_HOME_FINISH, this, this.onDoWorkFinish);
        Laya.timer.clear(this, this.onDoWorkFinish);
    }

    //初始化控件
    initControl() {
        this.ani = this.owner.getChildByName("ani");
        this.axAni = this.owner.getChildByName("ax");
        this.axAni.visible = false;
    }

    //初始化属性
    initModel() {
        this.findCreateHomeTimes = 0;   //寻找盖房地点的次数
        this.stateAnim = ResidentMeta.ResidentAnim.Null;
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
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    getModel() {
        return this.model;
    }

    // 设置动画
    setAnim(anim) {
        if (this.stateAnim == anim) {
            return;
        }
        this.stateAnim = anim;
        if (this.model.getAge() < ResidentMeta.ResidentAdultAge) {
            if (anim == ResidentMeta.ResidentAnim.Idle) {
                this.ani.play(0, true, "idle_baby");
            } else if (anim == ResidentMeta.ResidentAnim.Walk) {
                this.ani.play(0, true, "walk_baby");
            } else if (anim == ResidentMeta.ResidentAnim.Enjoy) {
                this.ani.play(0, true, "enjoy_baby");
            }
        } else {
            let ext = String(this.model.getSex());
            if (anim == ResidentMeta.ResidentAnim.Idle) {
                this.ani.play(0, true, "idle_role1_sex" + ext);
            } else if (anim == ResidentMeta.ResidentAnim.Walk) {
                this.ani.play(0, true, "walk_role1_sex" + ext);
            } else if (anim == ResidentMeta.ResidentAnim.Enjoy) {
                this.ani.play(0, true, "enjoy_role1_sex" + ext);
            }
        }
    }



    //  设置状态机状态
    refreshFSMState(state, param) {
        if (this.model.getFSMState() == state) {
            return;
        }
        this.model.setFSMState(state);
        this.axAni.visible = false;
        this.owner.visible = true;
        this.axAni.stop();
        this.ani.stop();
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
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani2");
        }
        // 寻找树木
        else if (state == ResidentMeta.ResidentState.FindTree) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstTree();
            // 砍树
        } else if (state == ResidentMeta.ResidentState.CutDownTree) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani1");
            Laya.timer.once(ResidentMeta.CutDownTreeTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 寻找石头
        else if (state == ResidentMeta.ResidentState.FindStone) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstStone();
        }
        // 收集石头
        else if (state == ResidentMeta.ResidentState.CollectStone) {
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani2");
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            Laya.timer.once(ResidentMeta.CollectStoneTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 搜索食物
        else if (state == ResidentMeta.ResidentState.FindFood) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstFood();
        }
        // 吃食物
        else if (state == ResidentMeta.ResidentState.EatFood) {
            this.axAni.visible = true;
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.play(0, true, "ani3");
            Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 寻找水源
        else if (state == ResidentMeta.ResidentState.FindWater) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstWater();
        }
        // 喝水
        else if (state == ResidentMeta.ResidentState.DrinkWater) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani4");
            Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 恋爱男方
        else if (state == ResidentMeta.ResidentState.LoverMan) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani5");
            this.startFindWoman();
        }
        // 恋爱女方
        else if (state == ResidentMeta.ResidentState.LoverWoman) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani5");
        }
        // 两口子一起回家
        else if (state == ResidentMeta.ResidentState.LoverGoHomeMakeLove) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani5");
            this.startGoHomeAndWoman();
        }
        // 生孩子
        else if (state == ResidentMeta.ResidentState.LoverMakeLove) {
            this.owner.visible = false;
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
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani6");
            Laya.timer.once(ResidentMeta.SocialTimeStep * 3, this, this.onDoWorkFinish, [param]);
        }
    }

    // 工作完成
    onDoWorkFinish(param) {
        // 吃食物完成
        let state = this.model.getFSMState()
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
            if (talkingModel.getTalkingNum() == 0) {
                GameModel.getInstance().removeTalkingPoint(talkingModel.getTalkingPointId());
            }
        }
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.refreshFSMState(ResidentMeta.ResidentState.IdleState);
    }

    // 走到聊天点
    startJoinTalkingPoint(talkingModel) {
        let pos = talkingModel.getTalkingPosInArea();
        this.gotoDest({
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
            this.gotoDest({
                x: woman.x,
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
            this.gotoDest({
                x: myHome.x,
                y: myHome.y
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
                this.gotoDest({ x: dstP.x, y: dstP.y }, Laya.Handler.create(this, function () {
                    this.findCreateHomeTimes++;
                    // 查看此处可不可以盖房
                    let toCreateHomeX = this.owner.x - BuildingMeta.HomeWidth / 2 + this.owner.width / 2;
                    let toCreateHomeY = this.owner.y - BuildingMeta.HomeHeight + this.owner.height;
                    if (BuildingMgr.getInstance().isCanBuildHome(toCreateHomeX, toCreateHomeY)) {
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
                this.gotoDest({ x: nearstTree.x, y: nearstTree.y }, Laya.Handler.create(this, function () {
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
                this.gotoDest({ x: dsp.x, y: dsp.y }, Laya.Handler.create(this, function () {
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
                this.gotoDest({ x: nearstFood.x, y: nearstFood.y }, Laya.Handler.create(this, function () {
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
                this.gotoDest({ x: dsp.x, y: dsp.y }, Laya.Handler.create(this, function () {
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
    gotoDest(info, handler) {
        this.stopGoto();
        let dstX = info.x;
        let dstY = info.y;
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let time = distance / ResidentMeta.ResidentMoveSpeed;
        this.tweenObject = Laya.Tween.to(this.owner, { x: dstX, y: dstY }, time * 1000, null, handler);
    }

    stopGoto() {
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
    }

    // 做出策略
    makeIdea() {
        if (this.model.getFSMState() != ResidentMeta.ResidentState.IdleState) {
            return;
        }
        // 社交
        if (this.model.getSocial() < ResidentMeta.ResidentSocialNeedValue) {
            let resident = this.residentMgrInstance.getACanSocialResident(this.owner.x, this.owner.y);
            if (resident) {
                let talkingModel = GameModel.getInstance().getOrCreateTalkingPoint(this.owner.x, this.owner.y, 100, 5);
                if (talkingModel.getTalkingNum()  == 0 ) {
                    talkingModel.addTalkingNum(2);
                    this.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                    resident.getComponent(ResidentLogic).refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                } else {
                    talkingModel.addTalkingNum(1);
                    this.refreshFSMState(ResidentMeta.ResidentState.JoinTalking, talkingModel);
                }
                return;
            }
        }
        // //喝水
        // if (this.model.getWater() < 100) {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindWater);
        //     return;
        // }
        // //吃饭
        // if (this.model.getFood() < 30 && FoodMgr.getInstance().canFindFood()) {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindFood);
        //     return;
        // }
        // // 砍树
        // if (RandomMgr.randomYes()) {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindTree);
        //     return;
        // }

        // // 收集石头
        // if (RandomMgr.randomYes()) {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindStone);
        //     return;
        // }

        // // 找恋人
        // if (this.model.getMarried() == 1 &&
        //     this.model.getAge() > 0 &&
        //     this.model.getSex() == 1 &&
        //     this.model.getMyHomeId() != 0) {
        //     let myHomeModel = GameModel.getInstance().getBuildingModel(this.model.getMyHomeId());
        //     if (myHomeModel != null && myHomeModel.getBuidlingState() == BuildingMeta.BuildingState.Noraml) {
        //         let model = GameModel.getInstance().getCanMarriedFemaleNModel();
        //         if (model) {
        //             let womanId = model.getResidentId();
        //             let womanResident = this.residentMgrInstance.getResidentById(womanId);
        //             if (womanResident) {
        //                 GameModel.getInstance().setMarried(this.model, model);
        //                 this.refreshFSMState(ResidentMeta.ResidentState.LoverMan);
        //                 womanResident.getComponent(ResidentLogic).refreshFSMState(ResidentMeta.ResidentState.LoverWoman);
        //                 return;
        //             }
        //         }
        //     }
        // }

        // // 盖房子
        // if (RandomMgr.randomYes() && this.model.getMyHomeId() == 0 && this.model.getSex() == 1) {
        //     this.refreshFSMState(ResidentMeta.ResidentState.FindBlockForCreateHome);
        //     return;
        // }

    }

}