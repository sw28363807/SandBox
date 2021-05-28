import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";
import HomeLogic from "./HomeLogic";
import HospitalLogic from "./HospitalLogic";
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

    ceatePowerPlantFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.PowerPlantPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let powerPlant = prefabDef.create();
            config.parent.addChild(powerPlant);
            let script = powerPlant.getComponent(PowerPlantLogic);
            cell.building = powerPlant;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }
    // 建造发电厂
    createPowerPlantByConfig(config, callback) {
        let model = GameModel.getInstance().newPowerPlantModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.PowerPlantWidth,
            height: BuildingMeta.PowerPlantHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceatePowerPlantFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceatePowerPlantFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }


    ceateShopFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.ShopPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let shop = prefabDef.create();
            config.parent.addChild(shop);
            let script = shop.getComponent(ShopLogic);
            cell.building = shop;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造商店
    createShopByConfig(config, callback) {
        let model = GameModel.getInstance().newShopModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.ShopWidth,
            height: BuildingMeta.ShopHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateShopFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateShopFunc(config, model, cell, callback);
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