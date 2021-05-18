import RandomMgr from "../helper/RandomMgr";

export default class TalkingPointModel extends Laya.Script {

    constructor() { 
        super();
        this.x = 0;
        this.y = 0;
        this.area = 0;
        this.talkingPointId = 0;
        this.talkingNum = 0;
        this.talkingMaxNum = 0;
    }

    getTalkingPointId() {
        return this.talkingPointId;
    }

    // 获取到一个可以聊天的点(一个随机点)
    getTalkingPosInArea() {
        return RandomMgr.randomByArea(this.x, this.y, this.area);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    addTalkingNum(num) {
        this.setTalkingNum(this.getTalkingNum() + num);
    }

    setTalkingNum(num) {
        this.talkingNum = num;
    }

    getTalkingNum() {
        return this.talkingNum;
    }

    getTalkingMaxNum() {
        return this.talkingMaxNum;
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
            if (data.talkingPointId) {
                this.talkingPointId = data.talkingPointId;
            }
            if (data.talkingMaxNum) {
                this.talkingMaxNum = data.talkingMaxNum;
            }
        }
    }
}