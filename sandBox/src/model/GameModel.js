import BuildingMeta from "../meta/BuildingMeta";
import ResidentMeta from "../meta/ResidentMeta";
import AnimalModel from "./AnimalModel";
import BuildingModel from "./BuildingModel";
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
        this.maxAnimalID = 0;           //动物最大ID

        this.residentModels = {};       //角色数据
        this.foodModels = {};           //食物数据
        this.buildingModels = {};       //建筑物数据
        this.talkingPoints = {};        //聊天区域数据
        this.animalModes = {};          //动物数据



        // 通用数值
        this.treeNum = 0;
        this.stoneNum = 0;
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

    // 添加住房Model
    newHomeModel(param) {
        this.maxBuildingID++;
        let model = new BuildingModel();
        model.updateData({
            x: param.x,
            y: param.y,
            buildingId: this.maxBuildingID,
            buildingType: BuildingMeta.BuildingType.HomeType,
            buildingState: BuildingMeta.BuildingState.Creating,
        });
        this.buildingModels[String(this.maxBuildingID)] = model;
        return model;
    }

    // 添加医院Model
    newHospitalModel(param) {
        this.maxBuildingID++;
        let model = new BuildingModel();
        model.updateData({
            x: param.x,
            y: param.y,
            buildingId: this.maxBuildingID,
            buildingType: BuildingMeta.BuildingType.HospitalType,
            buildingState: BuildingMeta.BuildingState.PreCreating,
        });
        this.buildingModels[String(this.maxBuildingID)] = model;
        return model;
    }

    // 添加发电厂Model
    newPowerPlantModel(param) {
        this.maxBuildingID++;
        let model = new BuildingModel();
        model.updateData({
            x: param.x,
            y: param.y,
            buildingId: this.maxBuildingID,
            buildingType: BuildingMeta.BuildingType.PowerPlantType,
            buildingState: BuildingMeta.BuildingState.PreCreating,
        });
        this.buildingModels[String(this.maxBuildingID)] = model;
        return model;
    }

    // 添加商店Model
    newShopModel(param) {
        this.maxBuildingID++;
        let model = new BuildingModel();
        model.updateData({
            x: param.x,
            y: param.y,
            buildingId: this.maxBuildingID,
            buildingType: BuildingMeta.BuildingType.ShopType,
            buildingState: BuildingMeta.BuildingState.PreCreating,
        });
        this.buildingModels[String(this.maxBuildingID)] = model;
        return model;
    } 

    // 添加学校Model
    newSchoolModel(param) {
        this.maxBuildingID++;
        let model = new BuildingModel();
        model.updateData({
            x: param.x,
            y: param.y,
            buildingId: this.maxBuildingID,
            buildingType: BuildingMeta.BuildingType.SchoolType,
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
        model.updateData({
            x: param.x,
            y: param.y,
            sex: param.sex,
            age: param.age,
            residentId: this.maxResidentID,
        });
        this.residentModels[String(this.maxResidentID)] = model;
        return model;
    }

    // 移除人物Model
    removeResientModel(id) {
        delete this.residentModels[String(id)];
    }

    // 人物数值timer
    onUpdateResidentValue() {
        // 数值计算定时器
        for (let key in this.residentModels) {
            let item = this.residentModels[key];
            item.onStep();
        }
    }

    //初始化自己 
    initSelf() {
        Laya.timer.loop(ResidentMeta.ResidentValueStep, this, this.onUpdateResidentValue);
    }
}