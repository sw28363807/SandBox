import GameMeta from "../meta/GameMeta";
import HomeLogic from "./HomeLogic";

export default class BuildingMgr extends Laya.Script {

    constructor() { 
        super();
        this.buildings = [];
        this.maxID = 0;
    }

    static getInstance() {
        return BuildingMgr.instance = BuildingMgr.instance || new BuildingMgr();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    // 建造家园
    createHomeByConfig(config, callback) {
        this.maxID++;
        let cell = {
            x: config.x,
            y: config.y,
            width: GameMeta.HomeWidth,
            height: GameMeta.HomeHeight,
            building: "loadingRes",
            id: this.maxID,
        };
        Laya.loader.create(GameMeta.HomePrefabPath, Laya.Handler.create(this, function (prefabDef) {
            config.id = this.maxID;
            let home = prefabDef.create();
            config.parent.addChild(home);
            let script = home.getComponent(HomeLogic);
            script.refreshInfo(config);
            cell.building = home;
            this.buildings.push(cell);
            if (callback) {
                callback.runWith(cell);
            }
        }));
        return this.maxID;
    }

    // 是否可以盖房
    isCanBuildHome(x, y) {
        let cur = new Laya.Rectangle(x, y, GameMeta.HomeWidth, GameMeta.HomeHeight);
        for (let index = 0; index < this.buildings.length; index++) {
            let item = this.buildings[index];
            if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                return false;
            }
        };
        return true;
    }
}