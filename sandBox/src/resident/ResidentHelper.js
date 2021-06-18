import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResidentMeta from "../meta/ResidentMeta";
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
        let buildingTypeSets = new Set([]);
        for (const key in ResidentMeta.ResidentCreateBuildingAIMap) {
            buildingTypeSets.add(Number(key));
        }
        let array = [];
        array.push();
        for (const key in buildings) {
            let building = buildings[key];
            let curDistance = new Laya.Point(building.x, building.y).distance(x, y);
            let model = building.buildingScript.getModel();
            let buildingType = model.getBuildingType();
            if (curDistance <= 1000 &&
                statusSets.has(model.getBuildingState()) &&
                buildingTypeSets.has(buildingType)) {
                array.push({
                    building: building,
                    state: ResidentMeta.ResidentCreateBuildingAIMap[String(buildingType)]
                });
            }
        }
        if (array.length == 0) {
            return null;
        }
        let index = RandomMgr.randomNumer(0, array.length - 1);
        let cell = array[index];
        return cell;
    }
}