import EventMgr from "../helper/EventMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameEvent from "../meta/GameEvent";
import GameModel from "../model/GameModel";
export default class HomeLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.ani = this.owner.getChildByName("ani"); 
        this.sliderControl = this.owner.getChildByName("sliderControl");
        this.slider = this.sliderControl.getChildByName("slider");
        this.sliderControl.visible = false;
        this.sliderMax = 194;
        this.addValue = BuildingMeta.HomeCreatingStepValue/this.sliderMax;
    }

    onDisable() {
        Laya.timer.clear(this, this.onMakeLove);
        Laya.timer.clear(this, this.onCreateProgress);
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
        this.startCreate();
    }

    getModel() {
        return this.model;
    }

    // 开始生孩子
    startMakeLove(handler) {
        this.makeLoveHandler = handler;
        this.ani.play(0, true, "makelove");
        Laya.timer.once(5000, this, this.onMakeLove);
    }

    onMakeLove() {
        if (this.makeLoveHandler) {
            this.makeLoveHandler.run();
            this.makeLoveHandler = null;
            this.ani.play(0, true, "idle");
            Laya.timer.clear(this, this.onMakeLove);
        }
    }

    // 开始建造
    startCreate() {
        this.ani.play(0, true, "creating");
        this.sliderControl.visible = true;
        this.slider.width = 1;
        Laya.timer.loop(BuildingMeta.HomeCreatingStep, this, this.onCreateProgress);
    }

    onCreateProgress() {
        this.slider.width = this.slider.width + this.addValue;
        if (this.slider.width > this.sliderMax) {
            this.slider.width = this.sliderMax;
            this.onCreateFinish();
        }
    }

    onCreateFinish() {
        this.ani.play(0, true, "idle");
        this.sliderControl.visible = false;
        Laya.timer.clear(this, this.onCreateProgress);
        this.model.setBuildingState(BuildingMeta.BuildingState.Noraml);
        GameModel.getInstance().addTreeNum(-BuildingMeta.CreateHomeNeedValues.tree);
        GameModel.getInstance().addStoneNum(-BuildingMeta.CreateHomeNeedValues.stone);
        EventMgr.getInstance().postEvent(GameEvent.CREATE_HOME_FINISH, {model: this.model});
    }
}