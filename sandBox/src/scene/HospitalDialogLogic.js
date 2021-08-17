import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";

export default class HospitalDialogLogic extends Laya.Script {

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
            Laya.Dialog.close(ResourceMeta.HospitalDialogScenePath);
        });

        this.doctorIndex = 0;
        this.leftBtn = this.owner.getChildByName("leftBtn");
        this.leftBtn.on(Laya.Event.CLICK, this, function () {
            this.doctorIndex--;
            this.refreshDoctor();
        });

        this.rightBtn = this.owner.getChildByName("rightBtn");
        this.rightBtn.on(Laya.Event.CLICK, this, function () {
            this.doctorIndex++;
            this.refreshDoctor();
        });

        this.refreshDoctor();
    }

    refreshDoctor() {
        let doctorMetas = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.HospitalType].doctors;
        if (this.doctorIndex < 0) {
            this.doctorIndex = 0;
        }
        if (this.doctorIndex >= doctorMetas.length) {
            this.doctorIndex = doctorMetas.length - 1;
        }
        this.leftBtn.visible = this.doctorIndex != 0;
        this.rightBtn.visible = this.doctorIndex < (doctorMetas.length - 1);
        let doctorMeta = doctorMetas[this.doctorIndex];

        let doctorPos = this.owner.getChildByName("doctorPos");
        if (this.doctorAni) {
            this.doctorAni.destroy(true);
            this.doctorAni = null;
        }
        this.doctorAni = new Laya.Animation();
        if (doctorMeta.sex == 1) {
            this.doctorAni.loadAnimation(ResourceMeta.ManAniPath);
        } else {
            this.doctorAni.loadAnimation(ResourceMeta.WomanAniPath);
        }
        this.doctorAni.scaleX = 2;
        this.doctorAni.scaleY = 2;
        this.doctorAni.play(0, true, "idle");
        doctorPos.addChild(this.doctorAni);
        
        let nameText = this.owner.getChildByName("nameText");
        nameText.text = doctorMeta.name;

        let descText = this.owner.getChildByName("descText");
        descText.text = doctorMeta.desc;

        let costText = this.owner.getChildByName("costText");
        costText.text = String(doctorMeta.costGold);
    }
}