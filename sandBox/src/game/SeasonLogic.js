import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";

export default class SeasonLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.curBg = this.owner.getChildByName("curBg");
        this.toBg = this.owner.getChildByName("toBg");
        this.curSeason = GameModel.getInstance().getGameSeason();
        this.switchSeason(this.curSeason, true);
        Laya.timer.loop(1000, this, this.onTimeTick);
    }

    onDisable() {
        Laya.timer.clear(this, this.onTimeTick);
    }

    onTimeTick() {
        if (this.curSeason != GameModel.getInstance().getGameSeason()) {
            this.curSeason = GameModel.getInstance().getGameSeason();
            this.switchSeason(this.curSeason);
        }
    }

    switchSeason(toSeasonIndex, noAnimation) {
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
        let season = GameMeta.Seasons[toSeasonIndex];
        if (noAnimation) {
            this.toBg.visible = false;
            this.curBg.bgColor = season;
        } else {
            this.toBg.visible = true;
            this.toBg.bgColor = this.curBg.bgColor;
            this.curBg.bgColor = season;
            this.toBg.alpha = 1;
            this.curBg.alpha = 0;
            let time = 4000;
            this.tweenObject = Laya.Tween.to(this.curBg, { alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                if (this.tweenObject) {
                    Laya.Tween.clear(this.tweenObject);
                    this.tweenObject = null;
                }
                this.toBg.visible = false;
            }));
        }
    }
}