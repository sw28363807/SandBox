import EventMgr from "../helper/EventMgr";
import GameEvent from "../meta/GameEvent";
import BuildingBaseLogic from "./BuildingBaseLogic";

export default class OfficeLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {

    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        EventMgr.getInstance().postEvent(GameEvent.CREATE_OFFICE_FINISH, this.makeParam(this.model));
    }
}