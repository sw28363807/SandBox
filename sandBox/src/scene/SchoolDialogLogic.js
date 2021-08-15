import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
export default class SchoolDialogLogic extends Laya.Script {

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
            Laya.Dialog.close(ResourceMeta.SchoolDialogScenePath);
        });
        this.teacherIndex = 1;
        this.refreshTeacher();
    }

    refreshTeacher() {
        let teacherMetas = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.SchoolType].teachers;
        let teacherMeta = teacherMetas[this.teacherIndex];
        let nameText = this.owner.getChildByName("nameText");
        nameText.text = teacherMeta.name;

        let descText = this.owner.getChildByName("descText");
        descText.text = teacherMeta.desc;

        let teacherPos = this.owner.getChildByName("teacherPos");
        if (this.teacherAni) {
            this.teacherAni.destroy(true);
            this.teacherAni = null;
        }
        this.teacherAni = new Laya.Animation();
        if (teacherMeta.sex == 1) {
            this.teacherAni.loadAnimation(ResourceMeta.ManAniPath);
        } else {
            this.teacherAni.loadAnimation(ResourceMeta.WomanAniPath);
        }
        this.teacherAni.scaleX = 2;
        this.teacherAni.scaleY = 2;
        this.teacherAni.play(0, true, "idle");
        teacherPos.addChild(this.teacherAni);
    }
}