import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
export default class LabDialogLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
    }

    onStart() {        
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.LabDialogScenePath);
        });
    }
}