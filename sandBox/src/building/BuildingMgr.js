import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";
import BuildingBaseLogic from "./BuildingBaseLogic";
import ChildSchoolLogic from "./ChildSchoolLogic";
import FarmLandLogic from "./FarmLandLogic";
import HomeLogic from "./HomeLogic";
import HospitalLogic from "./HospitalLogic";
import LabLogic from "./LabLogic";
import OfficeLogic from "./OfficeLogic";
import OperaLogic from "./OperaLogic";
import PastureLogic from "./PastureLogic";
import PoliceStationLogic from "./PoliceStationLogic";
import PowerPlantLogic from "./PowerPlantLogic";
import SchoolLogic from "./SchoolLogic";
import ShopLogic from "./ShopLogic";

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

    ceateBuildingFunc(config, model, cell, callback) {
        Laya.loader.create(config.prefab, Laya.Handler.create(this, function (prefabDef) {
            let building = prefabDef.create();
            config.parent.addChild(building);
            let script = building.getComponent(BuildingBaseLogic);
            cell.building = building;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造建筑物
    createBuildingByConfig(config, callback) {
        let model = GameModel.getInstance().newBuildingModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateBuildingFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateBuildingFunc(config, model, cell, callback);
            }));
        }
        return cell;
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
            if (curDistance <= area &&
                building.building != "noBuilding" &&
                sets.has(building.model.getBuildingState()) &&
                building.model.getBuildingType() == buildingType) {
                distance = curDistance;
                ret = building;
            }
        }
        return ret;
    }
}