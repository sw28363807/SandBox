import BuildingMgr from "../building/BuildingMgr";
import BuildingMeta from "../meta/BuildingMeta";
import StoneMgr from "../source/StoneMgr";
import TreeMgr from "../source/TreeMgr";
import WaterMgr from "../source/WaterMgr";

export default class ResidentHelper {
    // 建房子时是否被占用
    static isOccupySpaceToCreateHome(toCreateHomeX, toCreateHomeY) {
        if (TreeMgr.getInstance().intersectsTree(
            toCreateHomeX,
            toCreateHomeY,
            BuildingMeta.HomeWidth,
            BuildingMeta.HomeHeight)) {
            return false;
        }
        if (StoneMgr.getInstance().intersectsStone(
            toCreateHomeX,
            toCreateHomeY,
            BuildingMeta.HomeWidth,
            BuildingMeta.HomeHeight)) {
            return false;
        }
        if (BuildingMgr.getInstance().intersectsBuilding(
            toCreateHomeX,
            toCreateHomeY,
            BuildingMeta.HomeWidth,
            BuildingMeta.HomeHeight)) {
            return false;
        }
        if (WaterMgr.getInstance().intersectsWater(
            toCreateHomeX,
            toCreateHomeY,
            BuildingMeta.HomeWidth,
            BuildingMeta.HomeHeight)) {
            return false;
        }
        return true;
    }
}