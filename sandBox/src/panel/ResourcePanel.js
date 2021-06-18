import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";

export default class ResourcePanel extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.treeLabel = this.owner.getChildByName("tree");
        this.stoneLabel = this.owner.getChildByName("stone");
        this.timeLabel = this.owner.getChildByName("time");
        this.seasonTextTable = [
            "春",
            "夏",
            "秋",
            "冬",
        ];
        this.refreshLabel();
        Laya.timer.loop(GameMeta.GameTimeStep, this, this.onTick);
    }

    onDisable() {
        Laya.timer.clear(this, this.onTick);
    }

    refreshLabel() {
        this.treeLabel.text = String(GameModel.getInstance().getTreeNum());
        this.stoneLabel.text = String(GameModel.getInstance().getStoneNum());
        let season = GameModel.getInstance().getGameSeason();
        let day = GameModel.getInstance().getGameDay();
        let hour = GameModel.getInstance().getGameHour();
        this.timeLabel.text = String(this.seasonTextTable[season]) + "  " + String((day).zeroPad(10)) + "日" + String((hour).zeroPad(10)) + "时";
        
    }

    onTick() {
        this.refreshLabel();
    }
}