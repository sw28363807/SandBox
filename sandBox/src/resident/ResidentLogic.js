import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import GameContext from "../meta/GameContext";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentModel from "../model/ResidentModel";
import ResidentDetailsPanelMgr from "../panel/ResidentDetailsPanelMgr";
import TreeMgr from "../source/TreeMgr";
import StoneMgr from "../source/StoneMgr";
import FoodMgr from "../source/FoodMgr";
import WaterMgr from "../source/WaterMgr";

export default class ResidentLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onStart() {
        // Laya.timer.once(1000, this, function () {
        //     this.setFSMState(ResidentMeta.ResidentState.FindWater);
        // });
    }
    
    onEnable() {
        this.initModel();
        this.initControl();
        this.initTouch();
    }

    onDisable() {
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
        this.curFSMState = ResidentMeta.ResidentState.NullState;
    }

    initTouch() {
        this.owner.on(Laya.Event.CLICK, this, function () {
            ResidentDetailsPanelMgr.getInstance().showPanel({
                data:this.model,
                parent: this.owner
            });
        });
    }

    // 刷新数据
    refreshByModel(model) {
        this.model = model;
        this.owner.x = this.model.getX();
        this.owner.y = this.model.getY();
        this.setFSMState(ResidentMeta.ResidentState.IdleState);
    }

    // 设置动画
    setAnim(anim) {
        if (this.stateAnim == anim) {
            return;
        }
        // new Laya.Animation().play();
        this.stateAnim = anim;
        let ext  = String(this.model.getSex());
        if (anim == ResidentMeta.ResidentAnim.Idle) {
            this.ani.play(0, true, "idle_role1_sex" + ext);
        } else if (anim == ResidentMeta.ResidentAnim.Walk) {
            this.ani.play(0, true, "walk_role1_sex" + ext);
        }
    }



    //  设置状态机状态
    setFSMState(state) {
        if (this.curFSMState == state) {
            return;
        }
        this.curFSMState = state;
        this.axAni.visible = false;
        this.axAni.stop();
        Laya.timer.clear(this, this.onDoWorkFinish);
        // 待机
        if (this.curFSMState == ResidentMeta.ResidentState.IdleState) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
        }
        // 寻找可以盖房子的地方
        else if (this.curFSMState == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindCreateHomeBlock();
        }
        // 盖房子
        else if (this.curFSMState == ResidentMeta.ResidentState.CreateHome) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
        }
        // 寻找树木
        else if (this.curFSMState == ResidentMeta.ResidentState.FindTree) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstTree();
        // 砍树
        } else if (this.curFSMState == ResidentMeta.ResidentState.CutDownTree) {
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani1");
            Laya.timer.once(ResidentMeta.CutDownTreeTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 寻找石头
        else if (this.curFSMState == ResidentMeta.ResidentState.FindStone) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstStone();
        }
        // 收集石头
        else if (this.curFSMState == ResidentMeta.ResidentState.CollectStone) {
            this.axAni.visible = true;
            this.axAni.play(0, true, "ani2");
            Laya.timer.once(ResidentMeta.CollectStoneTimeStep* 3, this, this.onDoWorkFinish);
        }
        // 搜索食物
        else if (this.curFSMState == ResidentMeta.ResidentState.FindFood) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstFood();
        }
        // 吃食物
        else if (this.curFSMState == ResidentMeta.ResidentState.EatFood) {
            this.axAni.visible = true;
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.play(0, true, "ani3");
            Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
        }
        // 寻找水源
        else if (this.curFSMState == ResidentMeta.ResidentState.FindWater) {
            this.setAnim(ResidentMeta.ResidentAnim.Walk);
            this.startFindANearstWater();
        }
        // 喝水
        else if (this.curFSMState == ResidentMeta.ResidentState.DrinkWater) {
            this.setAnim(ResidentMeta.ResidentAnim.DrinkWater);
            this.axAni.visible = true;
            this.setAnim(ResidentMeta.ResidentAnim.Idle);
            this.axAni.play(0, true, "ani4");
            Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
        }
    }


    // 工作完成
    onDoWorkFinish() {
        Laya.timer.clear(this, this.onDoWorkFinish);
        this.setFSMState(ResidentMeta.ResidentState.IdleState);
    }

    // 开始寻找可以建房子的空地
    startFindCreateHomeBlock() {
        if (this.findCreateHomeTimes < 3) {
            if (this.curFSMState == ResidentMeta.ResidentState.FindBlockForCreateHome) {
                let dstP = RandomMgr.randomByArea2(this.owner.x,
                     this.owner.y,
                      400,
                    GameContext.mapWidth, GameContext.mapHeight, 200, 200);
                this.gotoDest({x:dstP.x, y:dstP.y}, Laya.Handler.create(this, function () {
                    this.findCreateHomeTimes++;
                    // 查看此处可不可以盖房
                    if (BuildingMgr.getInstance().isCanBuildHome(this.owner.x, this.owner.y)) {
                        this.myHomeID = BuildingMgr.getInstance().createHomeByConfig({
                            parent:this.owner.parent,
                            x:this.owner.x,
                            y:this.owner.y
                        });
                        this.setFSMState(ResidentMeta.ResidentState.CreateHome);                        
                    } else {
                        this.startFindCreateHomeBlock();
                    }
                }));
            }   
        } else {
            this.curFSMState = ResidentMeta.ResidentState.NullState;
            this.findCreateHomeTimes = 0;
            this.makeIdea();
        }
    }

    startFindANearstTree() {
        if (this.curFSMState == ResidentMeta.ResidentState.FindTree) {
            let nearstTree = TreeMgr.getInstance().getNearstTree(this.owner.x, this.owner.y);
            if (nearstTree) {
                this.gotoDest({x:nearstTree.x, y:nearstTree.y} , Laya.Handler.create(this, function () {
                    this.setFSMState(ResidentMeta.ResidentState.CutDownTree);
                }));
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.setFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 寻找最近的水源
    startFindANearstWater() {
        if (this.curFSMState == ResidentMeta.ResidentState.FindWater) {
            let nearstWater = WaterMgr.getInstance().getNearstWater(this.owner.x, this.owner.y);
            if (nearstWater) {
                this.gotoDest({x: nearstWater.x, y: nearstWater.y}, Laya.Handler.create(this, function () {
                    this.setFSMState(ResidentMeta.ResidentState.DrinkWater);
                }));
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.setFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 寻找最近的食物
    startFindANearstFood() {
        if (this.curFSMState == ResidentMeta.ResidentState.FindFood) {
            let nearstFood = FoodMgr.getInstance().getNearstFood(this.owner.x, this.owner.y);
            if (nearstFood) {
                this.gotoDest({x: nearstFood.x, y: nearstFood.y}, Laya.Handler.create(this, function () {
                    this.setFSMState(ResidentMeta.ResidentState.EatFood);
                }));
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.setFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    startFindANearstStone() {
        if (this.curFSMState == ResidentMeta.ResidentState.FindStone) {
            let nearstStone = StoneMgr.getInstance().getNearstStone(this.owner.x, this.owner.y);
            if (nearstStone) {
                this.gotoDest({x: nearstStone.x, y: nearstStone.y}, Laya.Handler.create(this, function () {
                    this.setFSMState(ResidentMeta.ResidentState.CollectStone);
                }));
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        } else {
            this.setFSMState(ResidentMeta.ResidentState.IdleState);
            this.makeIdea();
        }
    }

    // 行走到某个位置
    gotoDest(info, handler) {
        let dstX = info.x;
        let dstY = info.y;
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let time = distance/ResidentMeta.ResidentMoveSpeed;
        Laya.Tween.to(this.owner, {x:dstX, y: dstY}, time*1000, null, handler);
    }

    getFSMState() {
        return this.curFSMState;
    }

    // 做出策略
    makeIdea() {
        if (this.curFSMState != ResidentMeta.ResidentState.IdleState) {
            return;
        }
        if (this.model.getWater() < 90 && RandomMgr.randomYes()) {
            this.setFSMState(ResidentMeta.ResidentState.FindWater);
            return;
        }
        if (this.model.getFood() < 90 && RandomMgr.randomYes()) {
            this.setFSMState(ResidentMeta.ResidentState.FindFood);
            return;
        }
    }

}