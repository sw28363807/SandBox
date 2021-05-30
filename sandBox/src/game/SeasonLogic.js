import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";

export default class SeasonLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.curBg = this.owner.getChildByName("curBg");
        this.toBg = this.owner.getChildByName("toBg");

        Laya.timer.loop(1000, this, this.onTimeTick);
        // let tick = GameModel.getInstance().getGameTimeTick();
        this.switchSeason(1, true);
        this.switchSeason(3);
    }

    onDisable() {
        Laya.timer.clear(this, this.onTimeTick);
    }

    onTimeTick() {

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