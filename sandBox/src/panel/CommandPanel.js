export default class CommandPanel extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onEnable() {
        this.listView = this.owner.getChildByName("_list");
        // new Laya.List().vs
        this.listView.array = [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3];
        this.listView.refresh();
    }

    onDisable() {
    }
}