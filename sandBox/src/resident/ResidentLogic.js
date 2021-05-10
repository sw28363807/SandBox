import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import GameContext from "../meta/GameContext";
import GameMeta from "../meta/GameMeta";
import NameMeta from "../meta/NameMeta";
import ResidentDetailsPanelMgr from "../panel/ResidentDetailsPanelMgr";

export default class ResidentLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onStart() {
        this.refreshSex();
        this.setFSMState(2);
    }
    
    onEnable() {
        this.initModel();
        this.initControl();
        this.initTouch();
    }

    onDisable() {
    }

    //初始化控件
    initControl() {
        this.residentImage = this.owner.getChildByName("image");
        this.sexImage = this.residentImage.getChildByName("sexImage");
    }

    //初始化属性
    initModel() {
        // 面上的数值
        this.life = 100;    //生命
        this.water = 50;   //水源
        this.enjoy = 40;   //娱乐
        this.food = 50;    //食物
        this.teach = 0;     //教育
        this.health = 75;  //健康
        this.social = 30;    //社交

        // 隐藏数值
        this.createBuildingIdea = 0;    //盖房的心态
        this.findCreateHomeTimes = 0;   //寻找盖房地点的次数

        this.temperature = 36;  //体温
        this.age = 1;       //年龄
        this.sex = 1;   // 性别 1 男 2 女
        this.married = 1; //1 未婚 2 已婚
        this.residentName = NameMeta.randomOneName();


        this.stateAnim = null;
        this.curFSMState = 0;   //0-空状态 1-待机 2-搜索寻找盖房的地方 3-建造房子
    }

    initTouch() {
        this.owner.on(Laya.Event.CLICK, this, function () {
            ResidentDetailsPanelMgr.getInstance().showPanel({
                parent: this.owner,
                life: this.life,
                water: this.water,
                enjoy: this.enjoy,
                food: this.food,
                teach: this.teach,
                health: this.health,
                temperature: this.temperature,
                age: this.age,
                sex: this.sex,
                married: this.married,
                residentName: this.residentName,
                social: this.social,
            });
        });
    }

    // 刷新性别
    refreshSex() {
        if (this.sexImage && this.sex == 1) {
            this.sexImage.visible = false;
        }
    }

    // 设置动画
    setAnim(anim) {
        if (this.stateAnim == anim) {
            return;
        }
        this.stateAnim = anim;
        this.stopAnimAction();
        if (anim == "normalState") {
            this.residentImage.loadImage(GameMeta.ResidentStateImagePath[anim], Laya.Handler.create(this, function() {
            }));
            this.setIdleAction();
        } else if (anim == "walkState") {
            this.residentImage.loadImage(GameMeta.ResidentStateImagePath[anim], Laya.Handler.create(this, function() {
            }));
            this.setMoveAction();
        } else if (anim == "createBuildingState") {
            this.residentImage.loadImage(GameMeta.ResidentStateImagePath[anim], Laya.Handler.create(this, function() {
            }));
            this.setIdleAction();
        }
    }

    stopAnimAction() {
        // 停止待机动作
        Laya.Tween.clearAll(this.residentImage);
        Laya.timer.clear(this, this.setIdleAction1);
        Laya.timer.clear(this, this.setMoveAction1);
        this.residentImage.rotation = 0;
    }

    // -------------------------------------待机动作
    setIdleAction1() {
        let time = 200;
        let scaleBig = 1;
        let scaleSmall = 0.9;
        Laya.Tween.to(this.residentImage, {scaleY:scaleSmall}, time, null, Laya.Handler.create(this, function() {
            Laya.Tween.to(this.residentImage, {scaleY:scaleBig}, time, null, Laya.Handler.create(this, function() {
            }), 0, true, true);
        }), 0, true, true);
    }
    setIdleAction() {
        let time = 200;
        this.setIdleAction1();
        Laya.timer.loop(2*time, this, this.setIdleAction1);
    }
    // -------------------------------------行走动作
    setMoveAction1() {
        let time = 200;
        let rotation = 10
        Laya.Tween.to(this.residentImage, {rotation:rotation}, time, null, Laya.Handler.create(this, function() {
            Laya.Tween.to(this.residentImage, {rotation:-rotation}, time, null, Laya.Handler.create(this, function() {
            }), 0, true, true);
        }), 0, true, true);
    }
    setMoveAction() {
        let time = 200;
        this.setMoveAction1();
        Laya.timer.loop(2*time, this, this.setMoveAction1);
    }
    // -------------------------------------建造动作


    //  设置状态机状态
    setFSMState(state) {
        if (this.curFSMState == state) {
            return;
        }
        this.curFSMState = state;
        // 待机
        if (this.curFSMState == 1) {
            this.setAnim("normalState");
        }
        // 寻找可以盖房子的地方
        else if (this.curFSMState == 2) {
            this.setAnim("walkState");
            this.startFindCreateHomeBlock();
        }
        // 盖房子
        else if (this.curFSMState == 3) {
            this.setAnim("createBuildingState");
        }
    }

    // 开始寻找可以建房子的空地
    startFindCreateHomeBlock() {
        if (this.findCreateHomeTimes < 3) {
            if (this.curFSMState == 2) {
                let dstP = RandomMgr.randomByArea2(this.owner.x,
                     this.owner.y,
                      400,
                    GameContext.mapWidth, GameContext.mapHeight, 200, 200);
                this.goto(dstP.x, dstP.y, Laya.Handler.create(this, function () {
                    this.findCreateHomeTimes++;
                    // 查看此处可不可以盖房
                    if (BuildingMgr.getInstance().isCanBuildHome(this.owner.x, this.owner.y)) {
                        BuildingMgr.getInstance().createHomeByConfig({
                            parent:this.owner.parent,
                            x:this.owner.x,
                            y:this.owner.y
                        });                        
                    } else {
                        this.startFindCreateHomeBlock();
                    }
                }));
            }   
        } else {
            this.curFSMState = 0;
            this.findCreateHomeTimes = 0;
            this.makeIdea();
        }
    }

    // 行走到某个位置
    goto(dstX, dstY, handler) {
        let speed = 40;
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let time = distance/speed;
        Laya.Tween.to(this.owner, {x: dstX, y: dstY}, time*1000, null, handler);
    }

    getFSMState() {
        return this.curFSMState;
    }

    // 做出策略
    makeIdea() {
        let state = this.curFSMState;
        if (state == 0) {
            // 
        }
    }

}