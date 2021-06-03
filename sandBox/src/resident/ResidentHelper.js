import BuildingMgr from "../building/BuildingMgr";
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
            return false;
        }
        if (StoneMgr.getInstance().intersectsStone(
            toX,
            toY,
            width,
            height)) {
            return false;
        }
        if (BuildingMgr.getInstance().intersectsBuilding(
            toX,
            toY,
            width,
            height)) {
            return false;
        }
        if (WaterMgr.getInstance().intersectsWater(
            toX,
            toY,
            width,
            height)) {
            return false;
        }
        if (FoodTriggerMgr.getInstance().intersectsFoodTrigger(
            toX,
            toY,
            width,
            height)) {
            return false;
        }
        return true;
    }
}