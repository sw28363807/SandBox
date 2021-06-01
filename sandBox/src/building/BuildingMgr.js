import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";
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

    ceateFarmLandFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.FarmLandPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let farmLand = prefabDef.create();
            config.parent.addChild(farmLand);
            let script = farmLand.getComponent(FarmLandLogic);
            cell.building = farmLand;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造农田
    createFarmLandByConfig(config, callback) {
        let model = GameModel.getInstance().newFarmLandModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.FarmLandWidth,
            height: BuildingMeta.FarmLandHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateFarmLandFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateFarmLandFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }

    ceatePastureFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.PasturePrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let pasture = prefabDef.create();
            config.parent.addChild(pasture);
            let script = pasture.getComponent(PastureLogic);
            cell.building = pasture;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造牧场
    createPastureByConfig(config, callback) {
        let model = GameModel.getInstance().newPastureModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.PastureWidth,
            height: BuildingMeta.PastureHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceatePastureFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceatePastureFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }

    ceateOperaFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.OperaPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let opera = prefabDef.create();
            config.parent.addChild(opera);
            let script = opera.getComponent(OperaLogic);
            cell.building = opera;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造歌剧院
    createOperaByConfig(config, callback) {
        let model = GameModel.getInstance().newOperaModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.OperaWidth,
            height: BuildingMeta.OperaHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateOperaFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateOperaFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }

    ceateOfficeFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.OfficePrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let office = prefabDef.create();
            config.parent.addChild(office);
            let script = office.getComponent(OfficeLogic);
            cell.building = office;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造写字楼
    createOfficeByConfig(config, callback) {
        let model = GameModel.getInstance().newOfficeModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.OfficeWidth,
            height: BuildingMeta.OfficeHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateOfficeFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateOfficeFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }


    ceatePoliceStationFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.PoliceStationPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let police = prefabDef.create();
            config.parent.addChild(police);
            let script = police.getComponent(PoliceStationLogic);
            cell.building = police;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造警察局
    createPoliceStationByConfig(config, callback) {
        let model = GameModel.getInstance().newPoliceStationModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.PoliceStationWidth,
            height: BuildingMeta.PoliceStationHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceatePoliceStationFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceatePoliceStationFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }

    ceateLabFunc(config, model, cell, callback) {
        Laya.loader.create(BuildingMeta.LabPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let lab = prefabDef.create();
            config.parent.addChild(lab);
            let script = lab.getComponent(LabLogic);
            cell.building = lab;
            script.refreshByModel(model);
            if (callback) {
                callback.runWith(cell);
            }
        }));
    }

    // 建造警察局
    createLabByConfig(config, callback) {
        let model = GameModel.getInstance().newLabModel(config);
        let cell = {
            x: config.x,
            y: config.y,
            width: BuildingMeta.LabWidth,
            height: BuildingMeta.LabHeight,
            model: model,
            building: "noBuilding",
        };
        this.buildings[String(model.getBuildingId())] = cell;
        if (Laya.loader.getRes(GameMeta.BuildingAtlasPath)) {
            this.ceateLabFunc(config, model, cell, callback);
        } else {
            Laya.loader.load(GameMeta.BuildingAtlasPath, Laya.Handler.create(this, function () {
                this.ceateLabFunc(config, model, cell, callback);
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