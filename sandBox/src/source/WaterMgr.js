export default class WaterMgr extends Laya.Script {

    constructor() { 
        super();
        this.waters = [];
    }
    
    static getInstance() {
        let ret = WaterMgr.instance = WaterMgr.instance || new WaterMgr();
        return ret
    }

    pushWater(water) {
        this.waters.push(water);
    }

    // 寻找最近的水源
    getNearstWater(x, y) {
        let distance = 99999999;
        let ret = null;
        for (let index = 0; index < this.waters.length; index++) {
            let water = this.waters[index];
            let curDistance = new Laya.Point(water.x, water.y).distance(x, y);
            if (curDistance < distance) {
                distance = curDistance;
                ret = water;
            }
        }
        return ret;
    }

    onEnable() {
    }

    onDisable() {
    }
}