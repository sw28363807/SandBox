import TipMgr from "../helper/TipMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";
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

        this.yesBtn = this.owner.getChildByName("yesBtn");
        this.yesBtn.on(Laya.Event.CLICK, this, function () {
            let teacherMetas = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.ChildSchoolType].teachers;
            let teacherMeta = teacherMetas[this.teacherIndex];
            let hasGold = GameModel.getInstance().getGoldNum();
            if (hasGold >= teacherMeta.costGold) {
                if (this.teacherIndex == this.selectTeacherIndex) {
                    TipMgr.getInstance().showTip("老师正在上班中~");
                    return;
                }
                this.selectTeacherIndex = this.teacherIndex;
                GameModel.getInstance().addGoldNum(-teacherMeta.costGold);
                this.buildingScript.setChildTeacherIndex(this.selectTeacherIndex);
                this.refreshTeacher();
            } else {
                TipMgr.getInstance().showTip("钱不够啦~");
            }
        });


        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.ChildSchoolDialogScenePath);
        });

        this.teacherIndex = this.buildingScript.getChildTeacherIndex();
        this.selectTeacherIndex = this.buildingScript.getChildTeacherIndex();

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
        let teacherMetas = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.ChildSchoolType].teachers;

        if (this.teacherIndex < 0) {
            this.teacherIndex = 0;
        }

        if (this.teacherIndex >= teacherMetas.length) {
            this.teacherIndex = teacherMetas.length - 1;
        }
        
        if (this.teacherIndex == this.selectTeacherIndex) {
            this.yesBtn.label = "上班中";
        } else {
            this.yesBtn.label = "雇佣";
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