export default class MapScrollView extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.container = this.owner.getChildByName("container");
        this.startPos = null;
        this.containerWidth = this.container.width;
        this.containerHeight = this.container.height;
    }

    onDisable() {
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
            if (toX < this.owner.width - this.containerWidth) {
                toX = this.owner.width - this.containerWidth;
            }
            if (toY < this.owner.height - this.containerHeight) {
                toY = this.owner.height - this.containerHeight;
            }
            this.container.x = toX;
            this.container.y = toY;
        }
    }

}