import EventMgr from "../helper/EventMgr";
import RandomMgr from "../helper/RandomMgr";
import Utils from "../helper/Utils";
import GameContext from "../meta/GameContext";
import GameEvent from "../meta/GameEvent";
import FoodMgr from "../source/FoodMgr";
import AnimalMeta from "./AnimalMeta";

export default class AnimalLogic extends Laya.Script {

    constructor() {
        super();
    }

    onDestroy() {
        if (this.trigger) {
            this.trigger.addNum(-1);
        }
        FoodMgr.getInstance().createFoodByConfig({
            parent: GameContext.mapContainer,
            x: this.owner.x + this.owner.width / 2,
            y: this.owner.y + this.owner.height / 2,
            foodType: 2
        }, Laya.Handler.create(this, function (obj) {

        }));
    }

    onEnable() {
        this.trigger = null;
        this.root = this.owner.getChildByName("root");
        this.ani = this.root.getChildByName("ani");
    }

    onDisable() {
        Laya.timer.clear(this, this.onWalkFinish);
        Laya.timer.clear(this, this.onHurtFinish);
    }

    onStart() {
        this.owner.alpha = 0;
        Laya.Tween.to(this.owner, { alpha: 1 }, 1000, Laya.Ease.circIn);
        this.setIdle();
        this.setWalk();
    }

    joinHunt(residentId) {
        this.model.addHuntResidentIds(residentId);
    }

    setIdle() {
        if (this.model.getState() == AnimalMeta.AnimalState.Idle) {
            return;
        }
    if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
        this.model.setState(AnimalMeta.AnimalState.Idle);
        this.ani.play(0, true, "idle1");
    }

    setWalk() {
        this.onWalkFinish();
        Laya.timer.loop(3000, this, this.onWalkFinish);
    }

    pauseWalk() {
        this.setIdle();
        Laya.timer.clear(this, this.onWalkFinish);
    }

    setHurt() {
        if (this.model.getState() == AnimalMeta.AnimalState.Hurt) {
            return;
        }
        Laya.timer.once(AnimalMeta.AnimalHurtTime, this, this.onHurtFinish);
        Laya.timer.clear(this, this.onWalkFinish);
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
        this.model.setState(AnimalMeta.AnimalState.Hurt);
        this.ani.play(0, true, "hurt1");
    }

    makeParam(extraParam) {
        let ret = {};
        ret.residentIds = this.model.getHuntResidentIds();
        ret.extraParam = extraParam;
        return ret;
    }

    onHurtFinish() {
        Laya.timer.clear(this, this.onHurtFinish);
        EventMgr.getInstance().postEvent(GameEvent.HUNT_FINISH, this.makeParam(this.owner));
        this.model.clearHuntResidentIds();
    }

    onWalkFinish() {
        if (this.model.getState() == AnimalMeta.AnimalState.Walk) {
            return;
        }
        this.model.setState(AnimalMeta.AnimalState.Walk);
        this.ani.play(0, true, "walk1");
        let pos = RandomMgr.randomByArea(this.trigger.owner.x, this.trigger.owner.y, 150);
        this.gotoDest({
            x: pos.x,
            y: pos.y,
        }, Laya.Handler.create(this, function () {
            this.setIdle();
        }));
    }

    setTrigger(trigger) {
        this.trigger = trigger;
    }

    getTrigger() {
        return this.trigger;
    }

    refreshByModel(model) {
        this.model = model;
        this.owner.x = model.getX();
        this.owner.y = model.getY();
    }

    getModel() {
        return this.model;
    }

    gotoDest(info, handler) {
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
        let dstX = info.x;
        let dstY = info.y;
        let sign = Utils.getSign(dstX - this.owner.x);
        this.root.scaleX = sign * Math.abs(this.root.scaleX);
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let time = distance / AnimalMeta.AnimalMoveSpeed;
        this.tweenObject = Laya.Tween.to(this.owner, { x: dstX, y: dstY }, time * 1000, null, handler);
    }


}