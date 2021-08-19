import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";

export default class FactoryDialogLogic extends Laya.Script {

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
            Laya.Dialog.close(ResourceMeta.FactoryDialogScenePath);
        });
        this.chilun1 = this.owner.getChildByName("chilun1");
        this.chilun2 = this.owner.getChildByName("chilun2");
        this.manAni = this.owner.getChildByName("man");
        this.womanAni = this.owner.getChildByName("woman");
        this.rotation1 = 0;
        this.rotation2 = 0;
        this.refreshFactor();
    }

    refreshFactor() {
        let workersArray = this.buildingScript.getCurWorkersIdArray();
        let workersArrayLength = workersArray.length;
        let meta = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.FactoryType];
        let numText = this.owner.getChildByName("numText");
        numText.text = String(workersArrayLength) + "/" + String(meta.maxResident);
        let descText = this.owner.getChildByName("descText");
        if (workersArrayLength == 0) {
            descText.text = "当前没有工人在工作";
        } else {
            descText.text = "工人们正在努力工作";
        }
        let lastWorking = this.isWorking;
        this.isWorking = (workersArrayLength != 0);
        if (lastWorking != this.isWorking) {
            if (this.isWorking) {
                this.manAni.play(0, true, "enjoy");
                this.womanAni.play(0, true, "enjoy");
            } else {
                this.manAni.play(0, true, "idle");
                this.womanAni.play(0, true, "idle");
            }
        }
    }

    onUpdate() {
        if (this.isWorking == true) {
            if (this.rotation1 >= 360) {
                this.rotation1 = 0;
            }
            if (this.rotation2 < -360) {
                this.rotation2 = 0;
            }
            this.chilun1.rotation = this.rotation1;
            this.chilun2.rotation = this.rotation2;
            this.rotation1 += 2;
            this.rotation2 -= 4;
        } else {
            this.rotation1 = 0;
            this.rotation2 = 0;
        }
    }

}