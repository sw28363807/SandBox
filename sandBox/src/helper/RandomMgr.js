export default class RandomMgr {

    // 随机一个矩形区域内的点
    static randomPointInRect(x, y, w, h) {
        let addX = Math.random() * w;
        let addY = Math.random() * h;
        return { x: x + addX, y: y + addY };
    };

    //以(x, y) 为原点 distance 距离内的一个随机点
    static randomByArea(x, y, distance) {
        let signX = RandomMgr.randomSign();
        let signY = RandomMgr.randomSign();
        let factorX = Math.random();
        let factorY = Math.random();
        let retX = x + signX * factorX * distance;
        let retY = y + signY * factorY * distance;
        return { x: Math.floor(retX), y: Math.floor(retY) };
    };

    // 以(x, y) 为原点 distance 距离内的一个随机点，但是这个点不能大于maxX，maxY并且不能小于0
    static randomByArea2(x, y, distance, maxX, maxY, offX, offY) {
        let p = RandomMgr.randomByArea(x, y, distance);
        if (p.x < offX) {
            p.x = offX;
        } else if (p.x > maxX - offX) {
            p.x = maxX - offX
        }
        if (p.y < offY) {
            p.y = offY;
        } else if (p.y > maxY - offY) {
            p.y = maxY - offY
        }
        return p;
    }

    // 做一个是否的随机
    static randomYes(probability) {
        if (probability == null) {
            probability = 0.5;
        }
        if (Math.random() >= probability) {
            return true;
        } else {
            return false;
        }
    }

    static randomSign() {
        if (Math.random() >= 0.5) {
            return 1;
        } else {
            return -1;
        }
    }
}