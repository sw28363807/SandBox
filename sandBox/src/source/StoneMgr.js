import StoneLogic from "./StoneLogic";

export default class StoneMgr extends Laya.Script {

    constructor() { 
        super();
        this.stones = {};
        this.maxID = 0;
    }

        
    static getInstance() {
        let ret = StoneMgr.instance = StoneMgr.instance || new StoneMgr();
        return ret
    }

    pushStone(stone) {
        this.maxID++;
        let script = stone.getComponent(StoneLogic);
        if (script) {
            script.setStoneID(this.maxID);
        }
        this.stones[String(this.maxID)] = stone;
    }

    // 寻找最近的一块石头
    getNearstStone(x, y) {
        let distance = 99999999;
        let ret = null;
        for (let key in this.stones) {
            let stone = this.stones[key];
            let curDistance = new Laya.Point(stone.x, stone.y).distance(x, y);
            if (curDistance < distance) {
                distance = curDistance;
                ret = stone;
            }
        }
        return ret;
    }

    intersectsStone(x, y, w, h) {
        let cur = new Laya.Rectangle(x, y, w, h);
        for (let key in this.stones) {
            let item = this.stones[key];
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