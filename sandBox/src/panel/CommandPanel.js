import BuildingMgr from "../building/BuildingMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameContext from "../meta/GameContext";
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
    }

    initItems() {
        this.dataArray = [];
        this.items = {};
        for (const key in BuildingMeta.CommandPanelDataSource) {
            let item = BuildingMeta.CommandPanelDataSource[key];
            this.dataArray.push(item);
        }
        this.prefabDef = null;
        this.clip = this.under.getChildByName("clip");
        this.content = this.clip.getChildByName("content");
        let distance = 128;
        let ySpace = 20;
        Laya.loader.create("prefab/CommonItem.prefab", Laya.Handler.create(this, function (prefabDef) {
            prefabDef = prefabDef;
            for (let index = 0; index < this.dataArray.length; index++) {
                let data = this.dataArray[index];
                let control = prefabDef.create();
                let spr = control.getChildByName("spr");
                spr.loadImage(data.preview);
                let nameLabel = control.getChildByName("textName");
                nameLabel.text = data.buildingName;
                spr.width = distance;
                spr.height = distance;
                this.content.addChild(control);
                control.y = index * distance + index * ySpace;
                control.showIndex = index;
                control.showData = data;
                this.items[String(index)] = control;
            }
        }));
        this.content.height += distance * this.dataArray.length + ySpace * this.dataArray.length;
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
                Laya.timer.once(1000, this, this.onDragStart, [item]);
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
            this.dragRender = new Laya.Box();
            this.dragRender.width = data.width;
            this.dragRender.height = data.height;
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
            if (!BuildingMgr.getInstance().intersectsBuilding(dpX, dpY, this.dragRender.width, this.dragRender.height)) {
                this.onBuild(data, dpX, dpY);
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
            if (enabled) {
                this.dragRender.bgColor =  BuildingMeta.BuildingCreateStateColor.enabled;
            } else {
                this.dragRender.bgColor =  BuildingMeta.BuildingCreateStateColor.disabled;
            }
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

    onDisable() {

    }
}