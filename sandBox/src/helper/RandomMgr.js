export default class RandomMgr {

    //以(x, y) 为原点 distance 距离内的一个随机点
    static randomByArea(x, y, distance) {
        let signX = RandomMgr.randomSign();
        let signY = RandomMgr.randomSign();
        let factorX = Math.random();
        let factorY = Math.random();
        let retX = x + signX * factorX * distance;
        let retY = y + signY * factorY * distance;
        return {x: Math.floor(retX), y: Math.floor(retY)};
    };


    static randomSign() {
        if (Math.random() >= 0.5) {
            return 1;
        } else {
            return -1;
        }
    }
}