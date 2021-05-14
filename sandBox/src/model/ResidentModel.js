import NameMeta from "../meta/NameMeta";
import ResidentMeta from "../meta/ResidentMeta";

export default class ResidentModel extends Laya.Script {
    constructor() { 
        super();
        // 面上的数值
        this.life = 100;    //生命
        this.water = 100;   //水源
        this.enjoy = 100;   //娱乐
        this.food = 100;    //食物
        this.teach = 0;     //教育
        this.health = 100;  //健康
        this.social = 100;    //社交

        // 隐藏数值
        this.createBuildingIdea = 0;    //盖房的欲望值
        this.cutDownTreeIdea = 0;       //砍树的欲望值
        this.transportStoneIdea = 0;    //搬运石头的欲望值
        this.myHomeID = 0;              //我的家的ID

        this.temperature = 36;  //体温
        this.age = 1;       //年龄
        this.sex = 1;   // 性别 1 男 2 女
        this.married = 1; //1 未婚 2 已婚
        this.residentName = NameMeta.randomOneName();


        this.x = 0;     //当前角色所处坐标x
        this.y = 0;     //当前角色所处坐标y
        this.residentId = 0;    //角色Id
    }

    uopdateData(data) {
        if (data) {
            if (data.life) {
                this.life = data.life;
            }
            if (data.water) {
                this.water = data.water;
            }
            if (data.enjoy) {
                this.enjoy = data.enjoy;
            }
            if (data.food) {
                this.food = data.food;
            }
            if (data.teach) {
                this.teach = data.teach;
            }
            if (data.health) {
                this.health = data.health;
            }
            if (data.social) {
                this.social = data.social;
            }
            if (data.createBuildingIdea) {
                this.createBuildingIdea = data.createBuildingIdea;
            }
            if (data.myHomeID) {
                this.myHomeID = data.myHomeID;
            }
            if (data.temperature) {
                this.temperature = data.temperature;
            }
            if (data.age) {
                this.age = data.age;
            }
            if (data.sex) {
                this.sex = data.sex;
            }
            if (data.married) {
                this.married = data.married;
            }
            if (data.residentName) {
                this.residentName = data.residentName;
            }
            if (data.x) {
                this.x = data.x;
            }
            if (data.y) {
                this.y = data.y;
            }
            if (data.residentId) {
                this.residentId = data.residentId;
            }
        }
    }

    // 下降需求和上升满足
    onStep() {
        this.changeWater(ResidentMeta.ResidentReduceWaterBaseValue);
        this.changeFood(ResidentMeta.ResidentReduceFoodBaseValue);
    }

    // 调整食物
    changeFood(delta) {
        this.food = this.food + delta;
        if (this.food < 0) {
            this.food = 0;
        } else if (this.food > 100) {
            this.food = 100;  
        }
    }

    // 调整水源
    changeWater(delta) {
        this.water = this.water + delta;
        if (this.water < 0) {
            this.water = 0;
        } else if (this.water > 100) {
            this.water = 100;  
        }
    }

    // 获得性别
    getSex() {
        return this.sex;
    }

    // 获得坐标x
    getX() {
        return this.x;
    }

    // 获得坐标x
    getY() {
        return this.y;
    }

    // 获得水源
    getWater() {
        return this.water;
    }

    // 获得食物
    getFood() {
        return this.food;
    }
}