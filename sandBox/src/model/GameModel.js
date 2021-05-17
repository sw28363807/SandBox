import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import BuildingModel from "./BuildingModel";
import FoodModel from "./FoodModel";
import ResidentModel from "./ResidentModel";

export default class GameModel extends Laya.Script {

    constructor() {
        super();
        this.maxResidentID = 0;         //人物最大ID
        this.maxFoodID = 0;             //食物最大ID
        this.maxBuildingID = 0;         //建筑最大ID
        this.residentModels = {};       //角色数据
        this.foodModels = {};           //食物数据
        this.buildingModels = {};       //建筑物数据


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

    // 获取家信息
    getBuildingModel(id) {
        return this.buildingModels[String(id)];
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

    // 添加食物Model
    newFoodModel(param) {
        this.maxFoodID++;
        let model = new FoodModel();
        model.updateData({
            x: param.x,
            y: param.y,
            foodId: this.maxFoodID
        });
        this.foodModels[String(this.maxFoodID)] = model;
        return model;
    }

    // 设置结婚
    setMarried(man, woman) {
        man.setMarried(2);
        woman.setMarried(2);
        man.setLoverId(woman.getResidentId());
        woman.setLoverId(man.getResidentId());
        woman.setMyHomeId(man.getMyHomeId());
    }

    // 获得一个可以结婚的女性Model
    getCanMarriedFemaleNModel() {
        for (let key in this.residentModels) {
            let model = this.residentModels[key];
            if (model.getAge() > 0 &&
                model.getMarried() == 1 &&
                model.getFSMState() == ResidentMeta.ResidentState.IdleState &&
                model.getSex() == 2) {
                return model;
            }
        }
        return null;
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