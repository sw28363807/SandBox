import Waterlogic from "./Waterlogic";

export default class WaterMgr extends Laya.Script {

    constructor() { 
        super();
        this.maxID = 0;
        this.waters = {};
    }
    
    static getInstance() {
        let ret = WaterMgr.instance = WaterMgr.instance || new WaterMgr();
        return ret
    }

    pushWater(water) {
        this.maxID++;
        let script = water.getComponent(Waterlogic);
        if (script) {
            script.setWaterID(this.maxID);
        }
        this.waters[String(this.maxID)] = water;
    }

    // 寻找最近的水源
    getNearstWater(x, y) {
        let distance = 99999999;
        let ret = null;
        for (let key in this.waters) {
            let water = this.waters[key];
            let curDistance = new Laya.Point(water.x, water.y).distance(x, y);
            if (curDistance < distance) {
                distance = curDistance;
                ret = water;
            }
        }
        return ret;
    }

    intersectsWater(x, y, w, h) {
        let cur = new Laya.Rectangle(x, y, w, h);
        for (let key in this.waters) {
            let item = this.waters[key];
            if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                return true;
            }
        }
        return false;
    }

    onEnable() {
    }

    onDisable() {
    }
}