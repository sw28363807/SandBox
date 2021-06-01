import RandomMgr from "../helper/RandomMgr";

export default class FightPointModel extends Laya.Script {

    constructor() { 
        super();
        this.x = 0;
        this.y = 0;
        this.area = 0;
        this.fightPointId = 0;
        this.fightNum = 0;
        this.fightMaxNum = 0;
    }
    
    getFightPointId() {
        return this.fightPointId;
    }

    // 获取到一个可以打架的点(一个随机点)
    getFightPosInArea() {
        return RandomMgr.randomByArea(this.x, this.y, this.area);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    addFightNum(num) {
        this.setFightNum(this.getFightNum() + num);
    }

    setFightNum(num) {
        this.fightNum = num;
    }

    getFightNum() {
        return this.fightNum;
    }

    getFightMaxNum() {
        return this.fightMaxNum;
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
            if (data.fightPointId) {
                this.fightPointId = data.fightPointId;
            }
            if (data.fightMaxNum) {
                this.fightMaxNum = data.fightMaxNum;
            }
        }
    }
}