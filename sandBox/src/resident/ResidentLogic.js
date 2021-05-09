import ResidentIdleAction from "../action/ResidentIdleAction";
import GameMeta from "../meta/GameMeta";
import NameMeta from "../meta/NameMeta";
import ResidentDetailsPanelMgr from "../panel/ResidentDetailsPanelMgr";

export default class ResidentLogic extends Laya.Script {

    constructor() { 
        super();
    }

    onStart() {
        this.refreshSex();
        this.setFSMState(1);
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
        this.life = 100;    //生命
        this.water = 100;   //水源
        this.enjoy = 100;   //娱乐
        this.food = 100;    //食物
        this.teach = 0;     //教育
        this.health = 100;  //健康

        this.temperature = 36;  //体温
        this.age = 1;       //年龄
        this.sex = 1;   // 性别 1 男 2 女
        this.married = 1; //1 未婚 2 已婚
        this.residentName = NameMeta.randomOneName();


        this.stateAnim = null;
        this.curFSMState = 0;   //0-空状态 1-待机
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
                residentName: this.residentName
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