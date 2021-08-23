import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";

export default class OperaLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.enjoyPoolText = this.owner.getChildByName("enjoytext");
        this.enjoyPoolText.visible = false;
    }

    // 建筑初始化
    onInitBuilding() {
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.enjoyPoolText.visible = true;
        this.addEnjoyToOpera(0);
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.OperaDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
            scene.selectedBuildingScript = this;
        }));
    }

    getCurSaveEnjoy() {
        let curEnjoy = this.getModel().getExteraData("curEnjoy");
        if (curEnjoy == undefined || curEnjoy == null) {
            curEnjoy = 0;
        }
        return curEnjoy;
    }

    setEnjoyToOpera(num) {
        let model = this.getModel();
        model.setExteraData("curEnjoy", num);
        this.enjoyPoolText.text = String(num);
    }

    addEnjoyToOpera(num) {
        let curEnjoy = this.getCurSaveEnjoy()
        curEnjoy += num;
        if (curEnjoy < 0) {
            curEnjoy = 0;
        }
        // if (curSaveFood > this.maxSave) {
        //     curSaveFood = this.maxSave;
        // }
        this.setEnjoyToOpera(curEnjoy);
    }
}