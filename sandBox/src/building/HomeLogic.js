import EventMgr from "../helper/EventMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameEvent from "../meta/GameEvent";
import GameModel from "../model/GameModel";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class HomeLogic extends BuildingBaseLogic {

    constructor() { 
        super();
    }
    
    // 建筑初始化
    onInitBuilding() {

    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        GameModel.getInstance().addTreeNum(-BuildingMeta.CreateHomeNeedValues.tree);
        GameModel.getInstance().addStoneNum(-BuildingMeta.CreateHomeNeedValues.stone);
        EventMgr.getInstance().postEvent(GameEvent.CREATE_HOME_FINISH, this.makeParam(this.model));
    }
    
    onDisable() {
        Laya.timer.clear(this, this.onMakeLove);
        Laya.timer.clear(this, this.onCreateProgress);
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
}