import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import AnimalModel from "./AnimalModel";
import BuildingModel from "./BuildingModel";
import FightPointModel from "./FightPointModel";
import FoodModel from "./FoodModel";
import ResidentModel from "./ResidentModel";
import TalkingPointModel from "./TalkingPointModel";

export default class GameModel extends Laya.Script {

    constructor() {
        super();
        this.maxResidentID = 0;         //人物最大ID
        this.maxFoodID = 0;             //食物最大ID
        this.maxBuildingID = 0;         //建筑最大ID
        this.maxTalkingID = 0;          //聊天区域最大ID
        this.maxFightID = 0;            //打架区域的最大ID
        this.maxAnimalID = 0;           //动物最大ID

        this.residentModels = {};       //角色数据
        this.foodModels = {};           //食物数据
        this.buildingModels = {};       //建筑物数据
        this.talkingPoints = {};        //聊天区域数据
        this.fightPoints = {};          //打架区域数据
        this.animalModes = {};          //动物数据


        // 通用数值
        this.treeNum = 0;
        this.stoneNum = 0;
        this.gameYear = 0;
        this.gameDay = 0;
        this.gameSeason = 0;
        this.gameHour = 0;    //时间小时
    }

    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        if (GameModel.instance) {
            return GameModel.instance
        }
        GameModel.instance = new GameModel();
        GameModel.instance.initSelf();
        return GameModel.instance;
    }

    getAllChildResidentNum() {
        let childNum = 0;
        for (let key in this.residentModels) {
            let item = this.residentModels[key];
            if (item.getAge() < ResidentMeta.ResidentAdultAge) {
                childNum++;
            }
        }
        return childNum;
    }

    getHomeNum() {
        let homeNum = 0;
        for (const key in this.buildingModels) {
            let model = this.buildingModels[key];
            if (model.getBuildingType() == BuildingMeta.BuildingType.HomeType) {
                homeNum++;
            }
        }
        return homeNum;
    }

    getAllResidentNum() {
        return Object.keys(this.residentModels).length;
    }

    getGameSeason() {
        return this.gameSeason;
    }

    getGameDay() {
        return this.gameDay;
    }

    getGameHour() {
        return this.gameHour;
    }

    getTreeNum() {
        return this.treeNum;
    }

    setTreeNum(num) {
        this.treeNum = num;
        if (this.treeNum < 0) {
            this.treeNum = 0;
        }
    }

    addTreeNum(num) {
        this.setTreeNum(this.getTreeNum() + num);
    }

    setStoneNum(num) {
        this.stoneNum = num;
        if (this.stoneNum < 0) {
            this.stoneNum = 0;
        }
    }

    getStoneNum() {
        return this.stoneNum;
    }

    addStoneNum(num) {
        this.setStoneNum(this.getStoneNum() + num);
    }

    // 新建一个动物Model
    newAnimalModel(param) {
        this.maxAnimalID++;
        let model = new AnimalModel();
        model.updateData({
            x: param.x,
            y: param.y,
            animalId: this.maxAnimalID
        });
        this.animalModes[String(this.maxAnimalID)] = model
        return model
    }

    // 移除动物
    removeAnimalModel(id) {
        delete this, this.animalModes[String(id)];
    }

    // 获取家信息
    getBuildingModel(id) {
        return this.buildingModels[String(id)];
    }

    // 获得一个聊天区域如果没有或者人数已经满了新建一个
    getOrCreateTalkingPoint(x, y, area, maxNum) {
        for (const key in this.talkingPoints) {
            let item = this.talkingPoints[key];
            let distance = new Laya.Point(x, y).distance(item.getX(), item.getY());
            if (item.getTalkingNum() < item.getTalkingMaxNum() && distance <= ResidentMeta.ResidentSocialArea) {
                return item;
            }
        }
        return this.newTalkingPoint(x, y, area, maxNum);
    }

    // 移除聊天点
    removeTalkingPoint(id) {
        let cell = this.talkingPoints[String(id)];
        cell.destroy(true);
        delete this.talkingPoints[String(id)];
    }

    // 新建一个聊天区域
    newTalkingPoint(x, y, area, maxNum) {
        this.maxTalkingID++;
        let model = new TalkingPointModel();
        model.updateData({
            x: x,
            y: y,
            area: area,
            talkingPointId: this.maxTalkingID,
            talkingMaxNum: maxNum,
        });
        this.talkingPoints[String(this.maxTalkingID)] = model;
        return model;
    }

    // 获得一个打架区域如果没有或者人数已经满了新建一个
    getOrCreateFightPoint(x, y, area, maxNum) {
        for (const key in this.fightPoints) {
            let item = this.fightPoints[key];
            let distance = new Laya.Point(x, y).distance(item.getX(), item.getY());
            if (item.getFightNum() < item.getFightMaxNum() && distance <= ResidentMeta.ResidentFightArea) {
                return item;
            }
        }
        return this.newFightPoint(x, y, area, maxNum);
    }

    // 移除打架点
    removeFightPoint(id) {
        let cell = this.fightPoints[String(id)];
        cell.destroy(true);
        delete this.fightPoints[String(id)];
    }

    // 新建一个打架区域
    newFightPoint(x, y, area, maxNum) {
        this.maxFightID++;
        let model = new FightPointModel();
        model.updateData({
            x: x,
            y: y,
            area: area,
            fightPointId: this.maxFightID,
            fightMaxNum: maxNum,
        });
        this.fightPoints[String(this.maxFightID)] = model;
        return model;
    }

    // 添加建筑Model
    newBuildingModel(param) {
        this.maxBuildingID++;
        let model = new BuildingModel();
        model.updateData({
            x: param.x,
            y: param.y,
            buildingId: this.maxBuildingID,
            buildingType: param.buildingType,
            buildingState: BuildingMeta.BuildingState.PreCreating,
        });
        this.buildingModels[String(this.maxBuildingID)] = model;
        return model;
    }

    // 添加食物Model
    newFoodModel(param) {
        this.maxFoodID++;
        let model = new FoodModel();
        model.updateData({
            x: param.x,
            y: param.y,
            foodId: this.maxFoodID,
            foodType: param.foodType
        });
        this.foodModels[String(this.maxFoodID)] = model;
        return model;
    }

    // 移除食物Model
    removeFoodModelById(id) {
        delete this.foodModels[String(id)];
    }

    randomSex() {
        let num = this.getAllChildResidentNum();
        if (num < 6) {
            if (num % 2 == 0) {
                return 1;
            } else {
                return 2;
            }
        }
        return RandomMgr.randomSex();
    }

    // 设置结婚
    setMarried(man, woman) {
        man.setMarried(2);
        woman.setMarried(2);
        man.setLoverId(woman.getResidentId());
        woman.setLoverId(man.getResidentId());
        woman.setMyHomeId(man.getMyHomeId());
    }

    // 添加角色Model
    newResidentModel(param) {
        this.maxResidentID++;
        let model = new ResidentModel();
        param.residentId = this.maxResidentID;
        model.updateData(param);
        this.residentModels[String(this.maxResidentID)] = model;
        return model;
    }

    // 移除人物Model
    removeResientModel(id) {
        delete this.residentModels[String(id)];
    }

    // 移除建筑物model
    removeBuildingModel(id) {
        delete this.buildingModels[String(id)];
    }

    // 人物数值timer
    onUpdateResidentValue() {
        // 数值计算定时器
        for (let key in this.residentModels) {
            let item = this.residentModels[key];
            item.onStep();
        }
    }

    // 时间流逝
    onGameTimeStep() {
        this.gameHour += 1;
        if (this.gameHour >= 24) {
            this.gameDay += 1;
            this.gameHour = 0;
        }
        if (this.gameDay >= 30) {
            this.gameDay = 0;
            this.gameSeason += 1;
        }
        if (this.gameSeason >= 4) {
            this.gameYear += 1;
            this.gameSeason = 0;
        }
    }

    //初始化自己 
    initSelf() {
        Laya.timer.loop(ResidentMeta.ResidentValueStep, this, this.onUpdateResidentValue);
        Laya.timer.loop(GameMeta.GameTimeStep, this, this.onGameTimeStep);
    }
}