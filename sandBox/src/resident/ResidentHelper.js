import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResidentMeta from "../meta/ResidentMeta";
import ResourceMeta from "../meta/ResourceMeta";
import FoodTriggerMgr from "../source/FoodTriggerMgr";
import StoneMgr from "../source/StoneMgr";
import TreeMgr from "../source/TreeMgr";
import WaterMgr from "../source/WaterMgr";

export default class ResidentHelper {
    // 建房子时是否被占用
    static isOccupySpace(toX, toY, width, height) {
        if (TreeMgr.getInstance().intersectsTree(
            toX,
            toY,
            width,
            height)) {
            return true;
        }
        if (StoneMgr.getInstance().intersectsStone(
            toX,
            toY,
            width,
            height)) {
            return true;
        }
        if (BuildingMgr.getInstance().intersectsBuilding(
            toX,
            toY,
            width,
            height)) {
            return true;
        }
        if (WaterMgr.getInstance().intersectsWater(
            toX,
            toY,
            width,
            height)) {
            return true;
        }
        if (FoodTriggerMgr.getInstance().intersectsFoodTrigger(
            toX,
            toY,
            width,
            height)) {
            return true;
        }
        return false;
    }


    // 搜索建筑物
    static getAIGoToCreateBuildingInfo(x, y) {
        let buildings = BuildingMgr.getInstance().getBuildings();
        let statusSets = new Set([BuildingMeta.BuildingState.PreCreating, BuildingMeta.BuildingState.Creating]);
        let filter = function (buildingType) {
            for (const key in ResidentMeta.ResidentContinueCreateMap) {
                let item = ResidentMeta.ResidentContinueCreateMap[key];
                if (item.isContinueCreate && buildingType == item.buildingType) {
                    return key;
                }
            }
            return null;
        }
        let array = [];
        for (const key in buildings) {
            let building = buildings[key];
            let curDistance = new Laya.Point(building.x, building.y).distance(x, y);
            let model = building.buildingScript.getModel();
            let buildingType = model.getBuildingType();
            let result = filter(buildingType);
            if (curDistance <= 1000 &&
                statusSets.has(model.getBuildingState()) && result) {
                array.push({
                    building: building,
                    state: result,
                    meta: BuildingMeta.BuildingDatas[buildingType],
                });
            }
        }
        if (array.length == 0) {
            return null;
        }
        let index = RandomMgr.randomNumber(0, array.length - 1);
        let cell = array[index];
        return cell;
    }
}