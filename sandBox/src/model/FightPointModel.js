import RandomMgr from "../helper/RandomMgr";

export default class FightPointModel extends Laya.Script {

    constructor() { 
        super();
        this.x = 0;
        this.y = 0;
        this.area = 0;
        this.fightingPointId = 0;
        this.fightingNum = 0;
        this.fightingMaxNum = 0;
    }
    
    getFightingPointId() {
        return this.fightingPointId;
    }

    // 获取到一个可以打架的点(一个随机点)
    getFightingPosInArea() {
        return RandomMgr.randomByArea(this.x, this.y, this.area);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    addFightingNum(num) {
        this.setFightingNum(this.getFightingNum() + num);
    }

    setFightingNum(num) {
        this.fightingNum = num;
    }

    getFightingNum() {
        return this.fightingNum;
    }

    getFightingMaxNum() {
        return this.fightingMaxNum;
    }

    updateData(data) {
        if (data) {
            if (data.x) {
                this.x = data.x;
            }
            if (data.y) {
                this.y = data.y;
            }
            if (data.area) {
                this.area = data.area;
            }
            if (data.fightingPointId) {
                this.fightingPointId = data.fightingPointId;
            }
            if (data.fightingMaxNum) {
                this.fightingMaxNum = data.fightingMaxNum;
            }
        }
    }
}