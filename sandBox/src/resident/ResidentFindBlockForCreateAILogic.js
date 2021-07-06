import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameContext from "../meta/GameContext";
import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentHelper from "./ResidentHelper";

export default class ResidentFindBlockForCreateAILogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.model = this.owner.residentLogicScript.getModel();
    }

    getModel() {
        return this.model;
    }

    processResidentFindCreateBuildingBlockAI(level1Results, level2Results) {
        for (const key in ResidentMeta.ResidentFindCreateBuildingBlockAIMap) {
            this.findBlockAIPriority = 2;
            let item = ResidentMeta.ResidentFindCreateBuildingBlockAIMap[key];
            let can = this.canFindCreateBuildingBlockCondition(key, item);
            if (can) {
                let cell = {
                    func: Laya.Handler.create(this, function () {
                        this.owner.residentLogicScript.refreshFSMState(key, item);
                        this.owner.AILogicScript.ideaResult = true;
                    })
                };
                if (this.findBlockAIPriority == 2) {
                    level2Results.push(cell);
                } else {
                    level1Results.push(cell);
                }
            }
        }
    }

    // 是否能够去搜索
    canFindCreateBuildingBlockCondition(findType, itemData) {
        // 建造房屋
        if (findType == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.findBlockAIPriority = 1;
            return RandomMgr.randomYes() && this.getModel().getMyHomeId() == 0 && this.getModel().getSex() == 1 &&
                this.getModel().getAge() >= ResidentMeta.ResidentAdultAge &&
                BuildingMgr.getInstance().canCreateBuildingForResource(BuildingMeta.BuildingType.HomeType);
        }
        // 建造火堆
        else if (findType == ResidentMeta.ResidentState.FindBlockForCreateFire) {
            if (this.getModel().getAge() < ResidentMeta.ResidentAdultAge) {
                return false;
            }
            if (!BuildingMgr.getInstance().canCreateBuildingForResource(BuildingMeta.BuildingType.FireType)) {
                return false;
            }
            if (this.getModel().getTemperature() >= ResidentMeta.ResidentStandardTemperature - 3) {
                return false;
            }
            let buildings = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.FireType,
                2000, [BuildingMeta.BuildingState.Noraml], null, true);
            if (!buildings) {
                return false;
            }
            return true;
        }
    }

    onFindBlockForCreateBuilding(building, itemData) {
        let fsmState = this.getModel().getFSMState();
        // 建造房屋
        if (fsmState == ResidentMeta.ResidentState.FindBlockForCreateHome) {
            this.model.setMyHomeId(building.buildingScript.getModel().getBuildingId());
        }
        // 建造火堆
        else if (fsmState == ResidentMeta.ResidentState.FindBlockForCreateFire) {
            // this.firNum = 1;
            // this.model.setMyHomeId(building.buildingScript.getModel().getBuildingId());
        }
    }

    canFindCreateBuildingBlock(fsmState) {
        return ResidentMeta.ResidentFindCreateBuildingBlockAIMap[fsmState];
    }


    // 开始寻找可以建房子的空地
    startFindCreateBuildingBlock(itemData) {
        if (this.findCreateBuildingTimes < ResidentMeta.ResidentFindPathTimes) {
            let dstP = RandomMgr.randomByArea2(this.owner.x,
                this.owner.y,
                100,
                GameContext.mapWidth, GameContext.mapHeight, GameMeta.MapSideOff, GameMeta.MapSideOff);
            this.owner.residentLogicScript.walkTo({ x: dstP.x, y: dstP.y }, Laya.Handler.create(this, function () {
                this.findCreateBuildingTimes++;
                // 查看此处可不可以建筑
                let data = BuildingMeta.BuildingDatas[itemData.buildingType];
                let toCreateX = this.owner.x - data.width / 2 + this.owner.width / 2;
                let toCreateY = this.owner.y - data.height + this.owner.height;
                if (!ResidentHelper.isOccupySpace(toCreateX, toCreateY,
                    data.width, data.height)) {
                    let building = BuildingMgr.getInstance().createBuildingByConfig({
                        parent: GameContext.mapContainer,
                        x: toCreateX,
                        y: toCreateY,
                        prefab: data.prefab,
                        buildingType: itemData.buildingType,
                    });
                    this.onFindBlockForCreateBuilding(building, itemData);
                    this.owner.residentLogicScript.refreshFSMState(itemData.nextState, building);
                } else {
                    this.startFindCreateBuildingBlock(itemData);
                }
            }));
        } else {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
            this.findCreateBuildingTimes = 0;
        }
    }
}