import NameMeta from "../meta/NameMeta";

export default class ResidentModel extends Laya.Script {
    constructor() { 
        super();
        // 面上的数值
        this.life = 100;    //生命
        this.water = 50;   //水源
        this.enjoy = 40;   //娱乐
        this.food = 50;    //食物
        this.teach = 0;     //教育
        this.health = 75;  //健康
        this.social = 30;    //社交

        // 隐藏数值
        this.createBuildingIdea = 0;    //盖房的欲望值
        this.cutDownTreeIdea = 0;       //砍树的欲望值
        this.myHomeID = 0;              //我的家的ID

        this.temperature = 36;  //体温
        this.age = 1;       //年龄
        this.sex = 1;   // 性别 1 男 2 女
        this.married = 1; //1 未婚 2 已婚
        this.residentName = NameMeta.randomOneName();
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
        }
    }

    // 获得性别
    getSex() {
        return this.sex;
    }
}