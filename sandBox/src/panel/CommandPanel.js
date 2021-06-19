import BuildingMgr from "../building/BuildingMgr";
import ResourceMgr from "../game/ResourceMgr";
import TipMgr from "../helper/TipMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameContext from "../meta/GameContext";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";
import ResidentHelper from "../resident/ResidentHelper";

export default class CommandPanel extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.switchState = 0;   //0 关闭 1 打开
        this.initBg();
        this.initTOuchLayer();
        this.setTouchLayerEnabled(false);
        this.initItems();
        this.initScrollTouch();
        Laya.timer.loop(300, this, this.refreshCondition);
        this.refreshCondition();
    }

    onDisable() {
        Laya.timer.clear(this, this.refreshCondition);
    }

    refreshCondition() {
        for (const key in this.items) {
            let item = this.items[key];
            let showData = item.showData;
            let treeNum = GameModel.getInstance().getTreeNum();
            let stoneNum = GameModel.getInstance().getStoneNum();
            let maskVisible = false;
            item.treeNeed.color = "#1497ef";
            item.stoneNeed.color = "#1497ef";
            if (treeNum < showData.costTree) {
                maskVisible = true;
                item.treeNeed.color = "#ef1437";
            }
            if (stoneNum < showData.CostStone) {
                maskVisible = true;
                item.stoneNeed.color = "#ef1437";
            }
            item.lock.visible = maskVisible;
        }
    }

    initItems() {
        this.dataArray = [];
        this.items = {};
        for (const key in BuildingMeta.BuildingDatas) {
            let item = BuildingMeta.BuildingDatas[key];
            if (item.type != BuildingMeta.BuildingType.HomeType) {
                this.dataArray.push(item);
            }
        }
        this.clip = this.under.getChildByName("clip");
        this.content = this.clip.getChildByName("content");
        let ySpace = 5;
        this.dragRender = Laya.loader.getRes(ResourceMeta.DragRenderPrefabPath).create();
        let itemPrefabDef = Laya.loader.getRes(ResourceMeta.CommonItemPrefabPath);
        let distance = 0;
        for (let index = 0; index < this.dataArray.length; index++) {
            let data = this.dataArray[index];
            let control = itemPrefabDef.create();
            if (index == 0) {
                distance = control.height;
            }
            let spr = control.getChildByName("spr");
            spr.loadImage(data.preview);
            let nameLabel = control.getChildByName("textName");
            nameLabel.text = "[" + data.buildingName + "]";
            let treeNeed = control.getChildByName("treeNeed");
            treeNeed.text = "木材:" + String(data.costTree);
            let stoneNeed = control.getChildByName("stoneNeed");
            stoneNeed.text = "石材:" + String(data.CostStone);
            let desc = control.getChildByName("desc");
            desc.text = data.desc;
            let lock = control.getChildByName("lock");
            control.lock = lock;
            control.treeNeed = treeNeed;
            control.stoneNeed = stoneNeed;
            this.content.addChild(control);
            control.y = index * distance + (index + 1) * ySpace;
            control.showIndex = index;
            control.showData = data;
            this.items[String(index)] = control;
        }

        this.content.height = distance * this.dataArray.length + ySpace * this.dataArray.length;
    }

    getItem(stageX, stageY) {
        for (const key in this.items) {
            let item = this.items[key];
            if (item.hitTestPoint(stageX, stageY)) {
                return item;
            }
        }
        return null;
    }

    initScrollTouch() {
        this.touchScroll = this.clip.getChildByName("touchScroll");
        this.touchDownPoint = null;
        this.touchScroll.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            this.dragItem = null;
            this.touchDownStartPoint = new Laya.Point(e.stageX, e.stageY);
            this.touchDownPoint = new Laya.Point(e.stageX, e.stageY);
            let item = this.getItem(e.stageX, e.stageY);
            if (item) {
                Laya.timer.once(200, this, this.onDragStart, [item]);
            }
        });

        this.touchScroll.on(Laya.Event.MOUSE_MOVE, this, function (e) {
            if (this.touchDownPoint && (this.dragItem == undefined || this.dragItem == null)) {
                if (Math.abs(this.touchDownStartPoint.y - e.stageY) >= 5) {
                    Laya.timer.clear(this, this.onDragStart);
                }
                let offY = e.stageY - this.touchDownPoint.y;
                this.content.y = this.content.y + offY;
                let distance = this.clip.height - this.content.height;
                if (this.content.y < distance) {
                    this.content.y = distance;
                } else if (this.content.y > 0) {
                    this.content.y = 0;
                }
                this.touchDownPoint.setTo(e.stageX, e.stageY);
            }
        });

        this.touchScroll.on(Laya.Event.MOUSE_OUT, this, function (e) {
            this.touchDownPoint = null;
            Laya.timer.clear(this, this.onDragStart);
            this.touchDownStartPoint = null;
        });

        this.touchScroll.on(Laya.Event.MOUSE_UP, this, function (e) {
            this.touchDownPoint = null;
            this.touchDownStartPoint = null;
            Laya.timer.clear(this, this.onDragStart);
        });
    }

    onDragStart(item) {
        Laya.timer.clear(this, this.onDragStart);
        this.dragItem = item;
        this.setTouchLayerEnabled(true);
        if (this.dragItem) {
            let data = this.dragItem.showData;
            if (this.dragRender) {
                this.dragRender.destroy(true);
                this.dragRender = null;
            }
            
            let prefabDef = Laya.loader.getRes(ResourceMeta.DragRenderPrefabPath);
            this.dragRender = prefabDef.create();
            this.dragRender.width = data.width;
            this.dragRender.height = data.height;
            this.dragRender.dragMask = this.dragRender.getChildByName("dragMask");
            this.dragRender.dragMask.width = data.width;
            this.dragRender.dragMask.height = data.height;

            this.dragRender.dragMask2 = this.dragRender.getChildByName("dragMask2");
            this.dragRender.dragMask2.width = data.width;
            this.dragRender.dragMask2.height = data.height;

            this.setBuildingCreateEnabled(true);
            this.touchLayer.addChild(this.dragRender);

            let spr = new Laya.Sprite();
            spr.loadImage(data.preview);
            this.dragRender.addChild(spr);
            spr.pos(data.adjustX, data.adjustY);

            let point = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
            this.touchLayer.globalToLocal(point);
            let dpX = point.x - this.dragRender.width / 2;
            let dpY = point.y - this.dragRender.height / 2;
            this.dragRender.pos(dpX, dpY);
            this.under.visible = false;
        }
    }

    initTOuchLayer() {
        this.touchLayer = this.owner.getChildByName("touch");
        this.touchLayerOriWidth = this.touchLayer.width;
    }

    onTouchLayerMouseMove(e) {
        if (this.dragRender) {
            let point = new Laya.Point(e.stageX, e.stageY);
            this.touchLayer.globalToLocal(point);
            let dpX = point.x - this.dragRender.width / 2;
            let dpY = point.y - this.dragRender.height / 2;
            this.dragRender.pos(dpX, dpY);
            if (GameContext.mapContainer) {
                point = new Laya.Point(e.stageX, e.stageY);
                GameContext.mapContainer.globalToLocal(point);
                dpX = point.x - this.dragRender.width / 2;
                dpY = point.y - this.dragRender.height / 2;
                if (ResidentHelper.isOccupySpace(dpX, dpY, this.dragRender.width, this.dragRender.height)) {
                    this.setBuildingCreateEnabled(false);
                } else {
                    this.setBuildingCreateEnabled(true);
                }
            }
        }
    }

    onTouchLayerMouseUp(e) {
        if (GameContext.mapContainer) {
            let point = new Laya.Point(e.stageX, e.stageY);
            GameContext.mapContainer.globalToLocal(point);
            let dpX = point.x - this.dragRender.width / 2;
            let dpY = point.y - this.dragRender.height / 2;
            let data = this.dragItem.showData;
            if (!ResidentHelper.isOccupySpace(dpX, dpY, this.dragRender.width, this.dragRender.height)) {
                this.onBuild(data, dpX, dpY);
            } else {
                TipMgr.getInstance().showTip("不可放置~");
            }
        }

        if (this.dragItem) {
            this.dragItem = null;
        }
        if (this.dragRender) {
            this.dragRender.destroy(true);
        }
        this.setTouchLayerEnabled(false);
        this.under.visible = true;
    }

    onTouchLayerMouseOut(e) {
        if (this.dragItem) {
            this.dragItem = null;
        }
        if (this.dragRender) {
            this.dragRender.destroy(true);
        }
        this.setTouchLayerEnabled(false);
        this.under.visible = true;
    }

    setTouchLayerEnabled(enabled) {
        if (enabled) {
            this.touchLayer.width = this.touchLayerOriWidth;
            this.touchLayer.on(Laya.Event.MOUSE_MOVE, this, this.onTouchLayerMouseMove);
            this.touchLayer.on(Laya.Event.MOUSE_UP, this, this.onTouchLayerMouseUp);
            this.touchLayer.on(Laya.Event.MOUSE_OUT, this, this.onTouchLayerMouseOut);
        } else {
            this.touchLayer.width = 0;
            this.touchLayer.off(Laya.Event.MOUSE_MOVE, this, this.onTouchLayerMouseMove);
            this.touchLayer.off(Laya.Event.MOUSE_UP, this, this.onTouchLayerMouseUp);
            this.touchLayer.off(Laya.Event.MOUSE_OUT, this, this.onTouchLayerMouseOut);
        }

    }

    setBuildingCreateEnabled(enabled) {
        if (this.dragRender) {
            this.dragRender.dragMask.visible = enabled;
            this.dragRender.dragMask2.visible = !enabled;
        }
    }

    setUnderState(state) {
        if (this.switchState == state) {
            return;
        }
        this.switchState = state;
        if (this.switchState == 0) {
            Laya.Tween.to(this.under, { x: -this.under.width }, 200, Laya.Ease.backOut);
            this.switchBtn.scaleX = 1;
        } else {
            Laya.Tween.to(this.under, { x: 0 }, 200, Laya.Ease.backIn);
            this.switchBtn.scaleX = -1;
        }
    }

    initBg() {
        this.under = this.owner.getChildByName("under");
        this.under.x = -this.under.width;
        this.oriOwerWidth = this.owner.width;
        this.owner.width = 0;
        this.switchBtn = this.under.getChildByName("btn");
        this.switchBtn.on(Laya.Event.CLICK, this, function () {
            if (this.switchState == 1) {
                this.setUnderState(0);
                this.owner.width = 0;
            } else {
                this.setUnderState(1);
                this.owner.width = this.oriOwerWidth;
            }

        });
    }

    onBuild(data, dpX, dpY) {
        GameModel.getInstance().addTreeNum(-BuildingMeta.BuildingDatas[String(data.type)].costTree);
        GameModel.getInstance().addStoneNum(-BuildingMeta.BuildingDatas[String(data.type)].CostStone);
        let building = BuildingMgr.getInstance().createBuildingByConfig({
            parent: GameContext.mapContainer,
            x: Math.round(dpX),
            y: Math.round(dpY),
            width: data.width,
            height: data.height,
            prefab: data.prefab,
            buildingType: data.type,
        });
    }
}