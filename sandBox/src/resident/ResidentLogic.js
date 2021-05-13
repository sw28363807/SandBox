import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import GameContext from "../meta/GameContext";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentModel from "../model/ResidentModel";
import ResidentDetailsPanelMgr from "../panel/ResidentDetailsPanelMgr";
import TreeMgr from "../source/TreeMgr";

export default class ResidentLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onStart() {
        this.setFSMState(ResidentMeta.ResidentState.FindTree);
    }
    
    onEnable() {
        this.initModel();
        this.initControl();
        this.initTouch();
    }

    onDisable() {
        Laya.timer.clear(this, this.onCutDownTreeFinish);
    }

    //初始化控件
    initControl() {
        this.ani = this.owner.getChildByName("ani");
        this.axAni = this.owner.getChildByName("ax");
        this.axAni.visible = false;
    }

    //初始化属性
    initModel() {
        this.model = new ResidentModel();
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

    refreshInfo(config) {
        if (config.x) {
            this.owner.x = config.x;
        }
        if (config.y) {
            this.owner.y = config.y;
        }
        if (config.sex) {
            this.model.sex = config.sex;
        }
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
            this.ani.play(0, true, "idle"+ext);
        } else if (anim == ResidentMeta.ResidentAnim.Walk) {
            this.ani.play(0, true, "walk"+ext);
        } else if (anim == ResidentMeta.ResidentAnim.CreateBuilding) {
            this.ani.play(0, true, "idle"+ext);
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
        Laya.timer.clear(this, this.onCutDownTreeFinish);
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
            this.setAnim(ResidentMeta.ResidentAnim.CreateBuilding);
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
            Laya.timer.once(ResidentMeta.CutDownTreeTimeStep * 3, this, this.onCutDownTreeFinish);
        }
    }

    // 砍树回调
    onCutDownTreeFinish() {
        Laya.timer.clear(this, this.onCutDownTreeFinish);
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
                this.goto(dstP.x, dstP.y, Laya.Handler.create(this, function () {
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
                this.goto(nearstTree.x, nearstTree.y, Laya.Handler.create(this, function () {
                    this.setFSMState(ResidentMeta.ResidentState.CutDownTree);
                }));
            } else {
                this.makeIdea();
            }
        } else {
            this.makeIdea();
        }
    }

    // 行走到某个位置
    goto(dstX, dstY, handler) {
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let time = distance/ResidentMeta.ResidentMoveSpeed;
        Laya.Tween.to(this.owner, {x: dstX, y: dstY}, time*1000, null, handler);
    }

    getFSMState() {
        return this.curFSMState;
    }

    // 做出策略
    makeIdea() {
        let state = this.curFSMState;
        if (state == ResidentMeta.ResidentState.NullState) {
            
        }
    }

}