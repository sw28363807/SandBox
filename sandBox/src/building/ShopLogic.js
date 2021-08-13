import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class ShopLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.ShopDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }

    // 获得当前装饰物
    getCurSaveDecoNum(itemId) {
        let curDecos = this.getModel().getExteraData("curDecos");
        if (curDecos == undefined || curDecos == null) {
            curDecos = {};
        }
        let num = curDecos[String(itemId)];
        if (num == undefined || num == null) {
            num = 0;
        }
        return num;
    }

    // 设置当前装饰物
    setCurDecoNum(itemId, num) {
        let model = this.getModel();
        let curDecos = model.getExteraData("curDecos");
        if (curDecos == undefined || curDecos == null) {
            curDecos = {};
        }
        curDecos[String(itemId)] = num;
        model.setExteraData("curDecos", curDecos);
    }

    // 增加装饰库存
    addDecoForSave(itemId, num) {
        let curSaveDecoNum = this.getCurSaveDecoNum(itemId);
        curSaveDecoNum += num;
        if (curSaveDecoNum < 0) {
            curSaveDecoNum = 0;
        }
        this.setCurDecoNum(itemId, curSaveDecoNum);
    }
}