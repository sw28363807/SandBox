import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";

export default class OfficeLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.officeGoldText = this.owner.getChildByName("officeGoldText");
        this.officeGoldText.visible = false;
        this.maxSave = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.OfficeType].maxSave;
    }

    getCurSaveGold() {
        let curSaveGold = this.getModel().getExteraData("curGold");
        if (curSaveGold == undefined || curSaveGold == null) {
            curSaveGold = 0;
        }
        return curSaveGold;
    }

    setCurSaveGold(num) {
        if (num < 0) {
            num = 0;
        }
        if (num > this.maxSave) {
            num = this.maxSave;
        }
        this.getModel().setExteraData("curGold", num);
        this.officeGoldText.text = String(num) + "/" + String(this.maxSave);
    }

    addGoldToOffice(num) {
        let curSaveGold = this.getCurSaveGold();
        curSaveGold += num;
        this.setCurSaveGold(curSaveGold);
    }

    isReachGoldMax() {
        return this.getCurSaveGold() >= this.maxSave;
    }

    // 建筑初始化
    onInitBuilding() {
        this.addGoldToOffice(0);
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.officeGoldText.visible = true;
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.OfficeDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }


}