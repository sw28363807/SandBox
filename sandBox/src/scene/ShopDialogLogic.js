import ResourceMeta from "../meta/ResourceMeta";

export default class ShopDialogLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.ShopDialogScenePath);
        });
    }

    onDisable() {

    }
}