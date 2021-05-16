import BuildingMeta from "../meta/BuildingMeta";

export default class BuildingModel extends Laya.Script {

    constructor() { 
        super();

        this.buildingId = 0;    //建筑ID
        this.x = 0;             //建筑位置x
        this.y = 0;             //建筑位置y
        this.buildingType = BuildingMeta.BuildingType.NullTyupe;  //建筑类型
        this.buildingState = BuildingMeta.BuildingState.NullState;  //建筑状态
    }

    // 设置建筑状态
    setBuildingState(state) {
        this.buildingState = state;
    }

    //获取建筑状态
    getBuidlingState() {
        return this.buildingState;
    }

    updateData(data) {
        if (data) {
            if (data.x) {
                this.x = data.x;
            }
            if (data.y) {
                this.y = data.y;
            }
            if (data.buildingId) {
                this.buildingId = data.buildingId;
            }
            if (data.buildingType) {
                this.buildingType = data.buildingType;
            }
            if (data.buildingState) {
                this.buildingState = data.buildingState;
            }
        }
    }
}