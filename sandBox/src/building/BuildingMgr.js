import BuildingMeta from "../meta/BuildingMeta";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";
import HomeLogic from "./HomeLogic";

export default class BuildingMgr extends Laya.Script {

    constructor() { 
        super();
        this.buildings = [];
    }

    static getInstance() {
        return BuildingMgr.instance = BuildingMgr.instance || new BuildingMgr();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    ceateHomeFunc(config, model, cell, callback) {
        Laya.loader.create(GameMeta.HomePrefabPath, Laya.Handler.create(this, function (prefabDef) {
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
        this.buildings.push(cell);
        if (Laya.loader.getRes("res/atlas/source/building.atlas")) {
            this.ceateHomeFunc(config, model, cell, callback);
        } else {
            Laya.loader.load("res/atlas/source/building.atlas",Laya.Handler.create(this, function() {
                this.ceateHomeFunc(config, model, cell, callback);
            }));
        }
        return cell;
    }

    // 是否可以盖房
    isCanBuildHome(x, y) {
        let cur = new Laya.Rectangle(x, y, BuildingMeta.HomeWidth, BuildingMeta.HomeHeight);
        for (let index = 0; index < this.buildings.length; index++) {
            let item = this.buildings[index];
            if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                return false;
            }
        };
        return true;
    }
}