import GameContext from "../meta/GameContext";
import Treelogic from "../source/Treelogic";
import TreeMgr from "../source/TreeMgr";

export default class MapScrollView extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.startPos = null;
        this.container = this.owner.getChildByName("container");
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
        }
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
            if (toX > 0) {
                toX = 0;
            }
            if (toY > 0) {
                toY = 0;
            }
            if (toX < this.owner.width - GameContext.mapWidth) {
                toX = this.owner.width - GameContext.mapWidth;
            }
            if (toY < this.owner.height - GameContext.mapHeight) {
                toY = this.owner.height - GameContext.mapHeight;
            }
            this.container.x = toX;
            this.container.y = toY;
        }
    }

}