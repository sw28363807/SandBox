import EventMgr from "../helper/EventMgr";
import GameEvent from "../meta/GameEvent";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";

export default class ResourcePanel extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.treeLabel = this.owner.getChildByName("tree");
        this.stoneLabel = this.owner.getChildByName("stone");
        this.goldLabel = this.owner.getChildByName("gold");
        this.timeLabel = this.owner.getChildByName("time");
        this.seasonTextTable = [
            "春",
            "夏",
            "秋",
            "冬",
        ];
        this.refreshLabel();
        Laya.timer.loop(GameMeta.GameTimeStep, this, this.onTick);

        let backBtn = this.owner.getChildByName("backBtn");
        backBtn.on(Laya.Event.CLICK, this, function () {
            EventMgr.getInstance().postEvent(GameEvent.MOVE_TO_MAP_X_Y);
        });
    }

    onDisable() {
        Laya.timer.clear(this, this.onTick);
    }

    refreshLabel() {
        this.treeLabel.text = String(GameModel.getInstance().getTreeNum());
        this.stoneLabel.text = String(GameModel.getInstance().getStoneNum());
        this.goldLabel.text = String(GameModel.getInstance().getGoldNum());
        let residentNum = GameModel.getInstance().getAllResidentNum();
        let season = GameModel.getInstance().getGameSeason();
        let day = GameModel.getInstance().getGameDay();
        let hour = GameModel.getInstance().getGameHour();
        this.timeLabel.text = String(this.seasonTextTable[season]) + "  " + String((day).zeroPad(10)) + "日" + String((hour).zeroPad(10)) + "时, 人口: "+ String(residentNum);
    }

    onTick() {
        this.refreshLabel();
    }
}