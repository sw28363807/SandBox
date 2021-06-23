/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import TestSceneLogic from "./scene/TestSceneLogic"
import SeasonLogic from "./game/SeasonLogic"
import Treelogic from "./source/Treelogic"
import FoodTrigger from "./source/FoodTrigger"
import StoneLogic from "./source/StoneLogic"
import Waterlogic from "./source/Waterlogic"
import AnimalTrigger from "./animal/AnimalTrigger"
import MapScrollView from "./helper/MapScrollView"
import ResourcePanel from "./panel/ResourcePanel"
import CommandPanel from "./panel/CommandPanel"
import AnimalLogic from "./animal/AnimalLogic"
import ChildSchoolLogic from "./building/ChildSchoolLogic"
import FarmLandLogic from "./building/FarmLandLogic"
import FoodLogic from "./source/FoodLogic"
import FoodPoolLogic from "./building/FoodPoolLogic"
import HomeLogic from "./building/HomeLogic"
import HospitalLogic from "./building/HospitalLogic"
import LabLogic from "./building/LabLogic"
import OfficeLogic from "./building/OfficeLogic"
import OperaLogic from "./building/OperaLogic"
import PastureLogic from "./building/PastureLogic"
import PetLogic from "./animal/PetLogic"
import PetShopLogic from "./building/PetShopLogic"
import PoliceStationLogic from "./building/PoliceStationLogic"
import PowerPlantLogic from "./building/PowerPlantLogic"
import ResidentLogic from "./resident/ResidentLogic"
import ResidentDetailsPanel from "./panel/ResidentDetailsPanel"
import RestaurantLogic from "./building/RestaurantLogic"
import SchoolLogic from "./building/SchoolLogic"
import ShopLogic from "./building/ShopLogic"
import TipLogic from "./helper/TipLogic"
import WaterPoolLogic from "./building/WaterPoolLogic"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("scene/TestSceneLogic.js",TestSceneLogic);
		reg("game/SeasonLogic.js",SeasonLogic);
		reg("source/Treelogic.js",Treelogic);
		reg("source/FoodTrigger.js",FoodTrigger);
		reg("source/StoneLogic.js",StoneLogic);
		reg("source/Waterlogic.js",Waterlogic);
		reg("animal/AnimalTrigger.js",AnimalTrigger);
		reg("helper/MapScrollView.js",MapScrollView);
		reg("panel/ResourcePanel.js",ResourcePanel);
		reg("panel/CommandPanel.js",CommandPanel);
		reg("animal/AnimalLogic.js",AnimalLogic);
		reg("building/ChildSchoolLogic.js",ChildSchoolLogic);
		reg("building/FarmLandLogic.js",FarmLandLogic);
		reg("source/FoodLogic.js",FoodLogic);
		reg("building/FoodPoolLogic.js",FoodPoolLogic);
		reg("building/HomeLogic.js",HomeLogic);
		reg("building/HospitalLogic.js",HospitalLogic);
		reg("building/LabLogic.js",LabLogic);
		reg("building/OfficeLogic.js",OfficeLogic);
		reg("building/OperaLogic.js",OperaLogic);
		reg("building/PastureLogic.js",PastureLogic);
		reg("animal/PetLogic.js",PetLogic);
		reg("building/PetShopLogic.js",PetShopLogic);
		reg("building/PoliceStationLogic.js",PoliceStationLogic);
		reg("building/PowerPlantLogic.js",PowerPlantLogic);
		reg("resident/ResidentLogic.js",ResidentLogic);
		reg("panel/ResidentDetailsPanel.js",ResidentDetailsPanel);
		reg("building/RestaurantLogic.js",RestaurantLogic);
		reg("building/SchoolLogic.js",SchoolLogic);
		reg("building/ShopLogic.js",ShopLogic);
		reg("helper/TipLogic.js",TipLogic);
		reg("building/WaterPoolLogic.js",WaterPoolLogic);
    }
}
GameConfig.width = 1336;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "scene/TestScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
