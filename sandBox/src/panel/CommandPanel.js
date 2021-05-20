export default class CommandPanel extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
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
    }

    onRenderCell(cell, index) {
        if (cell) {
            let item = cell.getChildByName("item");
            let image = item.getChildByName("image");
            image.loadImage("source/building/center.png", Laya.Handler.create(this, function () {
                
            }));
        }
    }

    onDisable() {

    }
}