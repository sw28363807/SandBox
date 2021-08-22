import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
export default class ChildSchoolDialogLogic extends Laya.Script {

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
            Laya.Dialog.close(ResourceMeta.ChildSchoolDialogScenePath);
        });

        this.teacherIndex = 0;
        this.leftBtn = this.owner.getChildByName("leftBtn");
        this.leftBtn.on(Laya.Event.CLICK, this, function () {
            this.teacherIndex--;
            this.refreshTeacher();
        });

        this.rightBtn = this.owner.getChildByName("rightBtn");
        this.rightBtn.on(Laya.Event.CLICK, this, function () {
            this.teacherIndex++;
            this.refreshTeacher();
        });

        this.refreshTeacher();
    }

    refreshTeacher() {
        let teacherMetas = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.SchoolType].teachers;

        if (this.teacherIndex < 0) {
            this.teacherIndex = 0;
        }

        if (this.teacherIndex >= teacherMetas.length) {
            this.teacherIndex = teacherMetas.length - 1;
        }

        this.leftBtn.visible = this.teacherIndex != 0;
        this.rightBtn.visible = this.teacherIndex < (teacherMetas.length - 1);

        let teacherMeta = teacherMetas[this.teacherIndex];
        let nameText = this.owner.getChildByName("nameText");
        nameText.text = teacherMeta.name;

        let descText = this.owner.getChildByName("descText");
        descText.text = teacherMeta.desc;

        let costText = this.owner.getChildByName("costText");
        costText.text = String(teacherMeta.costGold);

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