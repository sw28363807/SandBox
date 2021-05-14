import StoneLogic from "./StoneLogic";

export default class StoneMgr extends Laya.Script {

    constructor() { 
        super();
        this.stones = [];
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
        this.stones.push(stone);
    }

    // 寻找最近的一块石头
    getNearstStone(x, y) {
        let distance = 99999999;
        let ret = null;
        for (let index = 0; index < this.stones.length; index++) {
            let stone = this.stones[index];
            let curDistance = new Laya.Point(stone.x, stone.y).distance(x, y);
            if (curDistance < distance) {
                distance = curDistance;
                ret = stone;
            }
        }
        return ret;
    }
    
    onEnable() {
    }

    onDisable() {
    }
}