import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";

export default class ChildSchoolLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {

    }

    // 建筑建造完成
    onCreateBuildingFinish() {
    }

    // 获得老师的索引
    getChildTeacherIndex() {
        let model = this.getModel();
        let curTeacherIndex = model.getExteraData("curTeacherIndex");
        if (curTeacherIndex == undefined || curTeacherIndex == null) {
            curTeacherIndex = 0;
        }
        return Number(curTeacherIndex);
    }

    // 设置老师的索引
    setChildTeacherIndex(index) {
        let model = this.getModel();
        model.setExteraData("curTeacherIndex", index);
    }

    // 获得幼儿园老师促进成长的概率
    getAddAgePriority() {
        let index = this.getChildTeacherIndex();
        if (index == -1) {
            return 0;
        }
        let meta = BuildingMeta.BuildingDatas[String(BuildingMeta.BuildingType.ChildSchoolType)].teachers[index];
        return meta.addAgePriority;
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.ChildSchoolDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }
}