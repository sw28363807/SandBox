export default class Utils {
    // 获得符号
    static getSign(value) {
        if (value > 0) {
            return 1;
        }
        return -1;
    }

    // 获得符号包含0
    static getSign2(value) {
        if (value > 0) {
            return 1;
        } else if (value == 0) {
            return 0;
        }
        return -1;
    }

    // 设置全局层级
    static setMapZOrder(owner, custom, offY) {
        if (custom) {
            owner.zOrder = custom;
        } else {
            if (!offY) {
                offY = 0;
            }
            owner.zOrder = Math.round(owner.y + owner.height + offY);
        }
    }
};

Number.prototype.zeroPad = Number.prototype.zeroPad || function (base) {
    var nr = this, len = (String(base).length - String(nr).length) + 1;
    return len > 0 ? new Array(len).join('0') + nr : nr;
};