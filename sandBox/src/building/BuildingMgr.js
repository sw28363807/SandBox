import BuildingMeta from "../meta/BuildingMeta";
import GameModel from "../model/GameModel";
import BuildingBaseLogic from "./BuildingBaseLogic";

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
        script.refreshByModel(model);
        this.buildings[String(model.getBuildingId())] = building;
        return building;
    }

    // 资源是够足够去建造
    canCreateBuildingForResource(buildingType) {
        let curTreeNum = GameModel.getInstance().getTreeNum();
        let curStoneNum = GameModel.getInstance().getStoneNum();
        let buildingMetaData = BuildingMeta.BuildingDatas[String(buildingType)];
        if (curTreeNum >= buildingMetaData.costTree &&
            curStoneNum >= buildingMetaData.CostStone) {
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

    // 获得一个最近的范围内的还未建造完成的建筑
    getNearstBuilding(x, y, buildingType, area, states) {
        let sets = new Set(states);
        let ret = null;
        for (const key in this.buildings) {
            let building = this.buildings[key];
            let distance = 99999999;
            let curDistance = new Laya.Point(building.x, building.y).distance(x, y);
            // console.debug(building.building);
            // console.debug(building.model.getBuildingState());
            // console.debug(building.model.getBuildingType());
            let model = building.buildingScript.getModel();
            if (curDistance <= area &&
                sets.has(model.getBuildingState()) &&
                model.getBuildingType() == buildingType) {
                distance = curDistance;
                ret = building;
            }
        }
        return ret;
    }


    // getRandomBuilding(x, y, buildingTypes, area, states) {
    //     let statusSets = new Set(states);
    //     let buildingTypeSets = new Set(buildingTypes);
    //     let ret = [];
    //     for (const key in this.buildings) {
    //         let building = this.buildings[key];
    //         let curDistance = new Laya.Point(building.x, building.y).distance(x, y);
    //         let model = building.buildingScript.getModel();
    //         if (curDistance <= area &&
    //             statusSets.has(model.getBuildingState()) &&
    //             buildingTypeSets.has(model.getBuildingType())) {
    //             ret.push({
    //                 building: building,
    //                 state: 
    //             });
    //         }
    //     }
    //     if (ret.length == 0) {
    //         return null;
    //     }
    //     let index = RandomMgr.randomNumer(0, ret.length - 1);
    //     return {building: ret[index], state: };
    // }
}