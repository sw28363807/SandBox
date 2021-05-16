import EventMgr from "../helper/EventMgr";
import GameEvent from "../meta/GameEvent";
import GameModel from "../model/GameModel";

export default class ResourcePanel extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.waterLabel = this.owner.getChildByName("water");
        this.stoneLabel = this.owner.getChildByName("stone");
        EventMgr.getInstance().registEvent(GameEvent.REFRESH_RESOURCE_PANEL, this, this.refreshLabel);
        this.refreshLabel();
    }

    onDisable() {
        EventMgr.getInstance().removeEvent(GameEvent.REFRESH_RESOURCE_PANEL, this, this.refreshLabel);
    }

    refreshLabel() {
        this.waterLabel.text = String(GameModel.getInstance().getTreeNum());
        this.stoneLabel.text = String(GameModel.getInstance().getStoneNum());
    }
}