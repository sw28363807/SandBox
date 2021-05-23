import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";
import HomeLogic from "./HomeLogic";
import HospitalLogic from "./HospitalLogic";
import SchoolLogic from "./SchoolLogic";

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

    ceateHomeFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.HomePrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let home = prefabDef.create();
            config.parent.addChild(home);
            let script = home.getComponent(HomeLogic);
            cell.building = home;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造家园
    createHomeByConfig(config, callback) {
        let model = GameModel.getInstance().newHomeModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.HomeWidth,
            height: BuildingMeta.HomeHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateHomeFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateHomeFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }


    ceateHospitalFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.HospitalPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let hospital = prefabDef.create();
            config.parent.addChild(hospital);
            let script = hospital.getComponent(HospitalLogic);
            cell.building = hospital;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造医院
    createHospitalByConfig(config, callback) {
        let model = GameModel.getInstance().newHospitalModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.HospitalWidth,
            height: BuildingMeta.HospitalHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateHospitalFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateHospitalFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }


    ceateSchoolFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.SchoolPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let school = prefabDef.create();
            config.parent.addChild(school);
            let script = school.getComponent(SchoolLogic);
            cell.building = school;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造学校
    createSchoolByConfig(config, callback) {
        let model = GameModel.getInstance().newSchoolModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.SchoolWidth,
            height: BuildingMeta.SchoolHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateSchoolFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateSchoolFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }

    // 是否可以建造建筑
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
    getNearstBuilding(x, y, buildingType, area, state) {
        let ret = null;
        for (const key in this.buildings) {
            let building = this.buildings[key];
            let distance = 99999999;
            let curDistance = new Laya.Point(building.x, building.y).distance(x, y);
            if (curDistance <= area &&
                building.building != "noBuilding" &&
                building.model.getBuildingState() == state &&
                building.model.getBuildingType() == buildingType) {
                distance = curDistance;
                ret = building;
            }
        }
        return ret;
    }
}