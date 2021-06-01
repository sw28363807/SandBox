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
        this.lookAt(GameContext.mapWidth/2, GameContext.mapHeight/2);
    }

    onMouseDown(e) {
        this.startPos = { x: e.stageX, y: e.stageY };
    }

    onMouseMove(e) {
        if (this.startPos) {
            let dx = e.stageX - this.startPos.x;
            let dy = e.stageY - this.startPos.y;
            this.processMapPos(this.container.x + dx, this.container.y + dy);
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

    processMapPos(toX, toY) {
        let p = this.getMapPos(toX, toY);
        this.container.x = p.x;
        this.container.y = p.y;
    }

    getMapPos(toX, toY) {
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
        return { x: toX, y: toY };
    }

    // 设置地图位置
    lookAt(mapX, mapY, anim) {
        if (anim == undefined || anim == null) {
            anim = false;
        }

        if (this.tweenObject) {
            Laya.Tween.clear(this.tweenObject);
            this.tweenObject = null;
        }

        let point = new Laya.Point(mapX, mapY);
        this.container.localToGlobal(point);
        let globalEyeX = Laya.stage.width / 2;
        let globalEyeY = Laya.stage.height / 2;
        let offX = globalEyeX - point.x;
        let offY = globalEyeY - point.y;
        let toX = this.container.x + offX;
        let toY = this.container.y + offY;
        if (anim) {
            let p = this.getMapPos(toX, toY);
            this.tweenObject = Laya.Tween.to(this.container, { x: p.x, y: p.y }, 1000,
                Laya.Ease.sineOut, Laya.Handler.create(this, function () {
                    if (this.tweenObject) {
                        Laya.Tween.clear(this.tweenObject);
                        this.tweenObject = null;
                    }
                }));
        } else {
            this.processMapPos(toX, toY);
        }

    }

}