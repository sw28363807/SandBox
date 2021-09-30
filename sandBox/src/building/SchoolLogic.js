import BuildingBaseLogic from "./BuildingBaseLogic";
import ResourceMeta from "../meta/ResourceMeta";
import BuildingMeta from "../meta/BuildingMeta";
export default class SchoolLogic extends BuildingBaseLogic {

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
    getTeacherIndex() {
        let model = this.getModel();
        let curTeacherIndex = model.getExteraData("curTeacherIndex");
        if (curTeacherIndex == undefined || curTeacherIndex == null) {
            curTeacherIndex = 0;
        }
        return Number(curTeacherIndex);
    }

    // 获得老师增长知识的概率
    getAddTeachInfo() {
        let index = this.getTeacherIndex();
        if (index == -1) {
            return 0;
        }
        let meta = BuildingMeta.BuildingDatas[String(BuildingMeta.BuildingType.SchoolType)].teachers[index];
        return {
            addTeach: meta.addTeach,
            addTeachPriority: meta.addTeachPriority,
        };
    }

    // 设置老师的索引
    setTeacherIndex(index) {
        let model = this.getModel();
        model.setExteraData("curTeacherIndex", index);
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.SchoolDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }
}