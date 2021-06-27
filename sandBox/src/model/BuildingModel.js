import BuildingMeta from "../meta/BuildingMeta";

export default class BuildingModel extends Laya.Script {

    constructor() {
        super();

        this.buildingId = 0;    //建筑ID
        this.x = 0;             //建筑位置x
        this.y = 0;             //建筑位置y
        this.buildingType = BuildingMeta.BuildingType.NullTyupe;  //建筑类型
        this.buildingState = BuildingMeta.BuildingState.NullState;  //建筑状态
        this.sendEventResidentIds = new Set([]);
        this.exteraData = {};
    }

    setExteraData(key, value) {
        this.exteraData[key] = value;
    }

    getExteraData(key) {
        return this.exteraData[key];
    }

    addResidentId(id) {
        this.sendEventResidentIds.add(id);
    }

    getResidentIds() {
        return this.sendEventResidentIds;
    }

    clearResidentIds() {
        this.sendEventResidentIds.clear();
    }

    // 获得建筑类型
    getBuildingType() {
        return this.buildingType;
    }

    getBuildingId() {
        return this.buildingId
    }

    // 设置建筑状态
    setBuildingState(state) {
        this.buildingState = state;
    }

    //获取建筑状态
    getBuildingState() {
        return this.buildingState;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
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