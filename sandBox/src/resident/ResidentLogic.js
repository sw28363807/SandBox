import ResidentIdleAction from "../action/ResidentIdleAction";
import GameMeta from "../meta/GameMeta";

export default class ResidentLogic extends Laya.Script {

    constructor(config) { 
        super();
    }

    onStart() {
        this.initModel();
        this.initControl();
        this.setFSMState(1);
        // this.setAnim("normalState");
    }
    
    onEnable() {
    }

    onDisable() {
    }

    //初始化控件
    initControl() {
        this.residentImage = this.owner.getChildByName("image");
    }

    //初始化属性
    initModel() {
        this.life = 100;    //生命
        this.water = 100;   //水源
        this.enjoy = 100;   //娱乐
        this.food = 100;    //食物
        this.teach = 0;     //教育
        this.temperature = 36;  //体温
        this.health = 100;  //健康
        this.age = 1;       //年龄
        this.sex = 1;   // 性别 1 男 2 女


        this.stateAnim = null;
        this.curFSMState = 0;   //0-空状态 1-待机
    }

    //  时间流失
    intiTimer() {
        this.owner.timer.loop(5000, this, function () {
            this.food = this.food - 1;
        });
    }

    // 设置动画
    setAnim(anim) {
        if (this.stateAnim == anim) {
            return;
        }
        this.stateAnim = anim;
        if (anim == "normalState") {
            this.residentImage.loadImage(GameMeta.ResidentStateImagePath[anim], Laya.Handler.create(this, function() {
            }));
            ResidentIdleAction.createAction(this.residentImage);
        }
    }

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
    }

    // 做出策略
    makeIdea() {

    }

}