export default class CommandPanel extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        // new Laya.List().onDragStart
        this.listView = this.owner.getChildByName("_list");
        this.listView.array = [
            {
                path: "source/building/center.png",
            }
        ];
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
       this.dragStartPointY = null;
    }

    onRenderCell(cell, index) {
        if (cell) {
            let item = cell.getChildByName("item");
            let image = item.getChildByName("image");
            image.loadImage("source/building/center.png", Laya.Handler.create(this, function () {
                
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
        Laya.timer.once(500, this, this.onDragStart, [data, image]);
    }

    onXMouseMove(data, image) {

    }

    onXMouseOut(data, image) {

    }

    onXMouseUp(data, image) {

    }

    onDragStart(data) {
        this.draging = true;
    }
    

    onDisable() {

    }
}