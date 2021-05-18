export default class CommandPanel extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        this.listView = this.owner.getChildByName("_list");
        this.listView.array = [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3];
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
    }

    onDisable() {

    }
}