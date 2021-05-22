import BuildingMgr from "../building/BuildingMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameContext from "../meta/GameContext";

export default class CommandPanel extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        // new Laya.List().mouseEnabled
        this.touchLayer = this.owner.getChildByName("touch");
        this.touchLayer.mouseEnabled = false;
        this.touchLayerWidth = this.touchLayer.width;
        this.touchLayer.width = 0;
        this.owner.width = 0;

        this.touchLayer.on(Laya.Event.MOUSE_MOVE, this, this.onTouchLayerMove);
        this.touchLayer.on(Laya.Event.MOUSE_OUT, this, this.onTouchLayerOut);
        this.touchLayer.on(Laya.Event.MOUSE_UP, this, this.onTouchLayerUp);

        this.listView = this.owner.getChildByName("_list");
        this.dataArray = [];
        for (const key in BuildingMeta.CommandPanelDataSource) {
            let item = BuildingMeta.CommandPanelDataSource[key];
            this.dataArray.push(item);
        }
        this.listView.array = this.dataArray;
        this.listView.refresh();

        this.upBtn = this.owner.getChildByName("upBtn");
        this.downBtn = this.owner.getChildByName("downBtn");
        this.downBtn.visible = false;
        this.listView.scaleY = 0;
        this.downBtn.on(Laya.Event.CLICK, this, function () {
            this.downBtn.visible = false;
            this.upBtn.visible = true;
            Laya.Tween.to(this.listView, {scaleY: 0}, 200, Laya.Ease.backIn);
            
        });

        this.upBtn.on(Laya.Event.CLICK, this, function () {
            this.downBtn.visible = true;
            this.upBtn.visible = false;
            Laya.Tween.to(this.listView, {scaleY: 1}, 200, Laya.Ease.backOut);
        });

       this.listView.renderHandler = Laya.Handler.create(this, this.onRenderCell);
       this.draging = false;
       this.dragTimeStart = false;
       this.dragStartPointY = null;
       this.dragData = null;
       this.dragRender = null;
    }

    onRenderCell(cell, index) {
        if (cell) {
            let item = cell.getChildByName("item");
            let image = item.getChildByName("image");
            let data = this.dataArray[index];
            image.loadImage(data.preview, Laya.Handler.create(this, function () {
                
            }));
            // new Laya.Sprite().on
            image.on(Laya.Event.MOUSE_DOWN, this, this.onXMouseStart, [this.listView.array[index], image]);
            image.on(Laya.Event.MOUSE_MOVE, this, this.onXMouseMove, [this.listView.array[index], image]);
            image.on(Laya.Event.MOUSE_OUT, this, this.onXMouseOut, [this.listView.array[index], image]);
            image.on(Laya.Event.MOUSE_UP, this, this.onXMouseUp, [this.listView.array[index], image]);
        }
    }

     
    onXMouseStart(data, image) {
        let point = new Laya.Point(0, 0);
        image.localToGlobal(point);
        this.dragStartPointY = point.y;
        this.dragTimeStart = true;
        this.dragData = null;
        if (this.dragRender) {
            this.dragRender.destroy(true);
            this.dragRender = null;
        }
        Laya.timer.once(1000, this, this.onDragStart, [data, image]);
    }

    onXMouseMove(data, image) {
        if (this.dragTimeStart) {
            let point = new Laya.Point(0, 0);
            image.localToGlobal(point);
            if (Math.abs(this.dragStartPointY - point.y) > 5) {
                this.dragTimeStart = false;
                this.draging = false;
                Laya.timer.clear(this, this.onDragStart);
            } 
        }
    }

    onXMouseOut(data, image) {
        if (this.dragTimeStart) {
            this.dragTimeStart = false;
            this.draging = false;
        }
        Laya.timer.clear(this, this.onDragStart);
    }

    onXMouseUp(data, image) {
        if (this.dragTimeStart) {
            this.dragTimeStart = false;
            this.draging = false;
        }
        Laya.timer.clear(this, this.onDragStart);
    }

    onDragStart(data) {
        if (this.dragTimeStart) {
            this.dragTimeStart = false;
            this.draging = true;
            this.touchLayer.mouseEnabled = true;
            this.dragData = data;

            if (this.dragRender) {
                this.dragRender.destroy(true);
                this.dragRender = null;
            }
            this.dragRender = new Laya.Box();
            this.dragRender.width = data.width;
            this.dragRender.height = data.height;
            this.dragRender.bgColor = "#5ddb36";
            this.touchLayer.addChild(this.dragRender);

            let spr = new Laya.Sprite();
            spr.loadImage(data.preview);
            this.dragRender.addChild(spr);
            spr.pos(data.adjustX, data.adjustY);
            this.touchLayer.width = this.touchLayerWidth;
            this.owner.width = this.touchLayerWidth;
        } else {
            this.dragTimeStart = false;
            this.draging = false;  
        }
        Laya.timer.clear(this, this.onDragStart);
    }

    onTouchLayerMove(e) {
        if (this.draging && this.dragRender) {
            let point = new Laya.Point(e.stageX, e.stageY);
            this.touchLayer.globalToLocal(point);
            let dpX = point.x - this.dragRender.width/2;
            let dpY = point.y - this.dragRender.height/2;
            this.dragRender.pos(dpX, dpY);
            if (GameContext.mapContainer) {
                point = new Laya.Point(e.stageX, e.stageY);
                GameContext.mapContainer.globalToLocal(point);
                dpX = point.x - this.dragRender.width/2;
                dpY = point.y - this.dragRender.height/2;
                if (BuildingMgr.getInstance().intersectsBuilding(dpX, dpY, this.dragRender.width, this.dragRender.height)) {
                    this.dragRender.bgColor = "#ffffff";
                } else {
                    this.dragRender.bgColor = "#5ddb36";
                }
            }
        }
    }

    onTouchLayerOut() {
        this.touchLayer.mouseEnabled = false;
        if (this.dragRender) {
            this.dragRender.destroy(true);
            this.dragRender = null;
        }
        this.touchLayer.width = 0;
        this.owner.width = 0;
    }

    onTouchLayerUp(e) {
        if (GameContext.mapContainer) {
            let point = new Laya.Point(e.stageX, e.stageY);
            GameContext.mapContainer.globalToLocal(point);
            let dpX = point.x - this.dragRender.width/2;
            let dpY = point.y - this.dragRender.height/2;
            if (!BuildingMgr.getInstance().intersectsBuilding(dpX, dpY, this.dragRender.width, this.dragRender.height)) {
                let buildingCell = BuildingMgr.getInstance().createHospitalByConfig({
                    parent: GameContext.mapContainer,
                    x: dpX,
                    y: dpY
                });
            }
        }

        this.touchLayer.mouseEnabled = false;
        if (this.dragRender) {
            this.dragRender.destroy(true);
            this.dragRender = null;
        }
        this.touchLayer.width = 0;
        this.owner.width = 0;
    }

    onDisable() {

    }
}