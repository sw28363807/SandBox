import GameContext from "../meta/GameContext";
import Treelogic from "../source/Treelogic";
import TreeMgr from "../source/TreeMgr";
import StoneLogic from "../source/StoneLogic";
import StoneMgr from "../source/StoneMgr";
import Waterlogic from "../source/Waterlogic";
import WaterMgr from "../source/WaterMgr";
import GameMeta from "../meta/GameMeta";

export default class MapScrollView extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.startPos = null;
        this.container = this.owner.getChildByName("container");
        GameContext.mapContainer = this.container;
        GameContext.mapWidth = this.container.width;
        GameContext.mapHeight = this.container.height;
    }

    onDisable() {
    }

    onStart() {
        for (let index = 0; index < this.container.numChildren; index++) {
            let child = this.container.getChildAt(index);
            let treeScript = child.getComponent(Treelogic);
            if (treeScript) {
                TreeMgr.getInstance().pushTree(child);
            }
            let stoneScript = child.getComponent(StoneLogic);
            if (stoneScript) {
                StoneMgr.getInstance().pushStone(child);
            }
            let waterScript = child.getComponent(Waterlogic);
            if (waterScript) {
                WaterMgr.getInstance().pushWater(child);
            }
        }
        this.processPos(0, 0);
    }

    onMouseDown(e) {
        this.startPos = {x: e.stageX, y: e.stageY};
    }

    onMouseMove(e) {
        if (this.startPos) {
            let dx = e.stageX - this.startPos.x;
            let dy = e.stageY - this.startPos.y;
            this.processPos(this.container.x + dx, this.container.y + dy);  
            this.startPos.x = e.stageX;
            this.startPos.y = e.stageY;
        }
    }

    onMouseUp(e) {
        this.startPos = null;
    }

    onMouseOut(e) {
        this.startPos = null;
    }

    processPos(toX, toY) {
        if (toX != null && toY != null) {
            if (toX > -GameMeta.MapSideOff) {
                toX = -GameMeta.MapSideOff;
            }
            if (toY > -GameMeta.MapSideOff) {
                toY = -GameMeta.MapSideOff;
            }
            if (toX < this.owner.width - GameContext.mapWidth + GameMeta.MapSideOff) {
                toX = this.owner.width - GameContext.mapWidth + GameMeta.MapSideOff;
            }
            if (toY < this.owner.height - GameContext.mapHeight + GameMeta.MapSideOff) {
                toY = this.owner.height - GameContext.mapHeight + GameMeta.MapSideOff;
            }
            this.container.x = toX;
            this.container.y = toY;
        }
    }

}