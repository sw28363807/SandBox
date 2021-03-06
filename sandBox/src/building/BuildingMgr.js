import BuildingMeta from "../meta/BuildingMeta";
import GameModel from "../model/GameModel";
import BuildingBaseLogic from "./BuildingBaseLogic";
import RandomMgr from "../helper/RandomMgr";

export default class BuildingMgr extends Laya.Script {

    constructor() {
        super();
        this.buildings = {};
        
    }

    static getInstance() {
        return BuildingMgr.instance = BuildingMgr.instance || new BuildingMgr();
    }

    onEnable() {
    }

    onDisable() {
    }

    // 获取建筑物
    getBuildingById(id) {
        return this.buildings[String(id)];
    }

    // 获取所有的建筑
    getBuildings() {
        return this.buildings;
    }

    // 建造建筑物
    createBuildingByConfig(config) {
        let model = GameModel.getInstance().newBuildingModel(config);
        let prefabDef = Laya.loader.getRes(config.prefab);
        let building = prefabDef.create();
        config.parent.addChild(building);
        let script = building.getComponent(BuildingBaseLogic);
        building.buildingScript = script;
        script.setBuildingMgr(this);
        script.refreshByModel(model);
        this.buildings[String(model.getBuildingId())] = building;
        return building;
    }

    // 移除建筑物
    removeBuildingById(id) {
        let building = this.buildings[String(id)];
        if (building) {
            delete this.buildings[String(id)];
            building.destroy(true);
            GameModel.getInstance().removeBuildingModel(id);
        }
    }

    // 资源是够足够去建造
    canCreateBuildingForResource(buildingType) {
        let curTreeNum = GameModel.getInstance().getTreeNum();
        let curStoneNum = GameModel.getInstance().getStoneNum();
        let buildingMetaData = BuildingMeta.BuildingDatas[String(buildingType)];
        if (curTreeNum >= buildingMetaData.costTree &&
            curStoneNum >= buildingMetaData.costStone) {
            return true;
        }
        return false;
    }

    // 是否有交集
    intersectsBuilding(x, y, w, h) {
        let cur = new Laya.Rectangle(x, y, w, h);
        for (let key in this.buildings) {
            let item = this.buildings[key];
            if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                return true;
            }
        }
        return false;
    }

    // 获得所有符合条件的建筑
    getAlltBuildingForCondition(x, y, buildingType, area, states, conditionFunc, isRandomOne) {
        let sets = new Set(states);
        let ret = [];
        for (const key in this.buildings) {
            let building = this.buildings[key];
            let curDistance = new Laya.Point(building.x, building.y).distance(x, y);
            let model = building.buildingScript.getModel();
            if (curDistance <= area) {
                if (sets.has(model.getBuildingState())) {
                    if (model.getBuildingType() == buildingType) {
                        let funRet = (conditionFunc && conditionFunc(building));
                        if ((conditionFunc == undefined || conditionFunc == null || funRet)) {
                            ret.push(building);
                        }
                    }
                }
            }
        }
        if (isRandomOne) {
            return RandomMgr.randomACellInArray(ret);
        }
        return ret;
    }
}