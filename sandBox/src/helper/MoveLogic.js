import Utils from "./Utils";
import RandomMgr from "../helper/RandomMgr";
import ResidentMeta from "../meta/ResidentMeta";

export default class MoveLogic extends Laya.Script {

    constructor() {
        super();
        this.movePaths = [];
    }

    // 设置回调
    setCallbackFunc(config) {
        this.leftFunc = config.leftFunc;
        this.rightFunc = config.rightFunc;
        this.upFunc = config.upFunc;
        this.downFunc = config.downFunc;
    }

    onEnable() {

    }

    onDisable() {
        this.stopGoto();
    }

    // 行走到某个位置
    gotoDestExt(info, handler) {
        if (info.speed) {
            this.speed = info.speed;
        } else {
            this.speed = ResidentMeta.ResidentMoveSpeed;
        }
        // 目标点
        let dstX = Math.round(info.x);
        let dstY = Math.round(info.y);
        // 当前点
        let curX = Math.round(this.owner.x);
        let curY = Math.round(this.owner.y);
        let xDelta = dstX - curX;
        let yDelta = dstY - curY;
        if (xDelta == 0 && yDelta == 0) {
            if (handler) {
                handler.run();
            }
        }
        let signX = Utils.getSign2(xDelta);
        let signY = Utils.getSign2(yDelta);
        if (info.forceFirstY || (RandomMgr.randomYes() && (info.forceFirstY == undefined || info.forceFirstY == null) ) ) {
            let p1 = {
                x: curX,
                y: dstY,
                direct: { x: 0, y: signY },
            };
            let p2 = {
                x: dstX,
                y: dstY,
                direct: { x: signX, y: 0 },
            };
            if (signY != 0) {
                this.movePaths.push(p1);
            }
            if (signX != 0) {
                this.movePaths.push(p2);
            }
            info.isFirstY = true;
        } else {
            let p1 = {
                x: dstX,
                y: curY,
                direct: { x: signX, y: 0 },
            };
            let p2 = {
                x: dstX,
                y: dstY,
                direct: { x: 0, y: signY },
            };
            if (signX != 0) {
                this.movePaths.push(p1);
            }
            if (signY != 0) {
                this.movePaths.push(p2);
            }
            info.isFirstY = false;
        }
        this._gotoDest2(handler);
    }

    // 行走到某个位置
    _gotoDest2(handler) {
        if (this.movePaths.length != 0) {
            let p = this.movePaths[0];
            if (p.direct.x != 0) {
                if (p.direct.x < 0) {
                    if (this.leftFunc) {
                        this.leftFunc();
                    }
                } else {
                    if (this.rightFunc) {
                        this.rightFunc();
                    }
                }
            } else {
                if (p.direct.y < 0) {
                    if (this.upFunc) {
                        this.upFunc();
                    }
                } else {
                    if (this.downFunc) {
                        this.downFunc();
                    }
                }
            }
            this._gotoDest(p, Laya.Handler.create(this, function () {
                this.movePaths.splice(0, 1);
                this._gotoDest2(handler);
            }));
        } else {
            this.stopGoto();
            if (handler) {
                handler.run();
            }
        }
    }


    // 行走到某个位置
    _gotoDest(info, handler) {
        this.stopAGoto();
        let dstX = info.x;
        let dstY = info.y;
        let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
        let r = distance / this.speed;
        let time = r * 1000;
        Laya.timer.once(time + 50, this, this._onGotoTimeOut, [info, handler]);
        let dst = null;
        if (dstX != this.owner.x) {
            dst = { x: dstX };
        }
        if (dstY != this.owner.y) {
            dst = { y: dstY };
        }
        this.tweenObject = Laya.Tween.to(this.owner, dst, time, null, Laya.Handler.create(this, function () {
            this.stopAGoto();
            if (handler) {
                handler.run();
            }
        }));
    }

    _onGotoTimeOut(info, handler) {
        this.stopAGoto();
        this._gotoDest(info, handler);
    }

    stopAGoto() {
        Laya.timer.clear(this, this._onGotoTimeOut);
        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }
    }

    stopGoto() {
        this.stopAGoto();
        this.movePaths = [];
    }
}