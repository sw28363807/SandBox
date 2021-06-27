import Utils from "./Utils";
import RandomMgr from "../helper/RandomMgr";
import ResidentMeta from "../meta/ResidentMeta";

export default class MoveLogic extends Laya.Script {

    constructor() {
        super();
        this.movePaths = [];
        this.curDest = null;
        this.finishHandler = null;
    }

    // 设置回调
    setCallbackFunc(config) {
        this.leftFunc = config.leftFunc;
        this.rightFunc = config.rightFunc;
        this.upFunc = config.upFunc;
        this.downFunc = config.downFunc;
    }

    onStart() {
    }

    onDestroy() {
        this.stopGoto();
    }

    refreshDirectCallback() {
        if (this.curDest) {
            if (this.curDest.x) {
                if (this.curDest.direct > 0) {
                    if (this.rightFunc) {
                        this.rightFunc();
                    }
                } else {
                    if (this.leftFunc) {
                        this.leftFunc();
                    }
                }
            } else {
                if (this.curDest.direct > 0) {
                    if (this.downFunc) {
                        this.downFunc();
                    }
                } else {
                    if (this.upFunc) {
                        this.upFunc();
                    }
                }
            }
        }
    }

    startGoto() {
        if (!this.curDest) {
            if (this.movePaths.length == 0) {
                if (this.finishHandler) {
                    this.finishHandler.run();
                    return;
                }
            }
            this.curDest = this.movePaths[0];
            this.refreshDirectCallback();
            this.lastFrameTime = Laya.Browser.now();
            Laya.timer.frameLoop(1, this, this._onFrameUpdate);
        }
    }

    stopGoto() {
        this.movePaths = [];
        this.curDest = null;
        this.lastFrameTime = 0;
        Laya.timer.clear(this, this._onFrameUpdate);
    }

    // 行走到某个位置
    gotoDest(info, handler) {
        this.finishHandler = handler;
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
            if (this.finishHandler) {
                this.finishHandler.run();
            }
        }
        let signX = Utils.getSign2(xDelta);
        let signY = Utils.getSign2(yDelta);
        if (info.forceFirstY || (RandomMgr.randomYes() && (info.forceFirstY == undefined || info.forceFirstY == null))) {
            let p1 = {
                y: dstY,
                direct: signY,
            };
            let p2 = {
                x: dstX,
                direct: signX,
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
                direct: signX,
            };
            let p2 = {
                y: dstY,
                direct: signY,
            };
            if (signX != 0) {
                this.movePaths.push(p1);
            }
            if (signY != 0) {
                this.movePaths.push(p2);
            }
            info.isFirstY = false;
        }
        this.startGoto();
    }


    _onFrameUpdate() {
        let deltay = Laya.Browser.now() - this.lastFrameTime;
        this._onTick(deltay);
        this.lastFrameTime = Laya.Browser.now();
    }

    _onTick(dt) {
        if (this.curDest.x != undefined && this.curDest.x != null) {
            // console.debug("start1");
            // console.debug(this.curDest);
            // console.debug(this.owner.x);
            // console.debug(Utils.getSign2(this.curDest.x - this.owner.x));
            // console.debug(this.curDest.direct);
            // console.debug(this.movePaths.length);
            // console.debug("end1");
            if (Utils.getSign2(this.curDest.x - this.owner.x) == this.curDest.direct) {
                this.owner.x += this.curDest.direct * this.speed * dt / 30;
            } else {
                this.owner.x = this.curDest.x;
                this.movePaths.splice(0, 1);
                if (this.movePaths.length != 0) {
                    this.curDest = this.movePaths[0];
                    this.refreshDirectCallback();
                } else {
                    this.stopGoto();
                    if (this.finishHandler) {
                        this.finishHandler.run();
                    }
                }
            }
        } else {
            // console.debug("start");
            // console.debug(this.curDest);
            // console.debug(this.owner.y);
            // console.debug(Utils.getSign2(this.curDest.y - this.owner.y));
            // console.debug(this.curDest.direct);
            // console.debug(this.movePaths.length);
            // console.debug("end");
            if (Utils.getSign2(this.curDest.y - this.owner.y) == this.curDest.direct) {
                this.owner.y += this.curDest.direct * this.speed * dt / 30;
            } else {
                this.owner.y = this.curDest.y;
                this.movePaths.splice(0, 1);
                if (this.movePaths.length != 0) {
                    this.curDest = this.movePaths[0];
                    this.refreshDirectCallback();
                } else {
                    this.stopGoto();
                    if (this.finishHandler) {
                        this.finishHandler.run();
                    }
                }
            }
        }
    }
}