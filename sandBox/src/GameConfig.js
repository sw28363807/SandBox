/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import TestSceneLogic from "./scene/TestSceneLogic"
import SeasonLogic from "./game/SeasonLogic"
import Treelogic from "./source/Treelogic"
import StoneLogic from "./source/StoneLogic"
import FoodTrigger from "./source/FoodTrigger"
import Waterlogic from "./source/Waterlogic"
import MapScrollView from "./helper/MapScrollView"
import ResourcePanel from "./panel/ResourcePanel"
import CommandPanel from "./panel/CommandPanel"
import AnimalLogic from "./animal/AnimalLogic"
import AnimalTrigger from "./animal/AnimalTrigger"
import Banklogic from "./building/Banklogic"
import BloodBuildingLogic from "./building/BloodBuildingLogic"
import ChildSchoolLogic from "./building/ChildSchoolLogic"
import FactoryLogic from "./building/FactoryLogic"
import FarmLandLogic from "./building/FarmLandLogic"
import FireLogic from "./building/FireLogic"
import FoodLogic from "./source/FoodLogic"
import FoodPoolLogic from "./building/FoodPoolLogic"
import HomeLogic from "./building/HomeLogic"
import HospitalLogic from "./building/HospitalLogic"
import LabLogic from "./building/LabLogic"
import MoveLogic from "./helper/MoveLogic"
import OfficeLogic from "./building/OfficeLogic"
import OilLogic from "./building/OilLogic"
import OperaLogic from "./building/OperaLogic"
import PastureLogic from "./building/PastureLogic"
import PetLogic from "./animal/PetLogic"
import PetShopLogic from "./building/PetShopLogic"
import PoliceStationLogic from "./building/PoliceStationLogic"
import PowerPlantLogic from "./building/PowerPlantLogic"
import ResidentLogic from "./resident/ResidentLogic"
import ResidentAILogic from "./resident/ResidentAILogic"
import ResidentCreateBuildingAILogic from "./resident/ResidentCreateBuildingAILogic"
import ResidentSendAILogic from "./resident/ResidentSendAILogic"
import ResidentDoSomeThingAILogic from "./resident/ResidentDoSomeThingAILogic"
import ResidentRandomWalkAILogic from "./resident/ResidentRandomWalkAILogic"
import ResidentFindBlockForCreateAILogic from "./resident/ResidentFindBlockForCreateAILogic"
import ResidentSocialAILogic from "./resident/ResidentSocialAILogic"
import ResidentUseBuildingAILogic from "./resident/ResidentUseBuildingAILogic"
import ResidentHuntAILogic from "./resident/ResidentHuntAILogic"
import ResidentFightAILogic from "./resident/ResidentFightAILogic"
import ResidentLookForLoverAILogic from "./resident/ResidentLookForLoverAILogic"
import ResidentDetailsPanel from "./panel/ResidentDetailsPanel"
import RestaurantLogic from "./building/RestaurantLogic"
import SchoolLogic from "./building/SchoolLogic"
import ShopLogic from "./building/ShopLogic"
import SpeedBuildingLogic from "./building/SpeedBuildingLogic"
import TipLogic from "./helper/TipLogic"
import ToolBuildingLogic from "./building/ToolBuildingLogic"
import VillageComLogic from "./building/VillageComLogic"
import WaterPoolLogic from "./building/WaterPoolLogic"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("scene/TestSceneLogic.js",TestSceneLogic);
		reg("game/SeasonLogic.js",SeasonLogic);
		reg("source/Treelogic.js",Treelogic);
		reg("source/StoneLogic.js",StoneLogic);
		reg("source/FoodTrigger.js",FoodTrigger);
		reg("source/Waterlogic.js",Waterlogic);
		reg("helper/MapScrollView.js",MapScrollView);
		reg("panel/ResourcePanel.js",ResourcePanel);
		reg("panel/CommandPanel.js",CommandPanel);
		reg("animal/AnimalLogic.js",AnimalLogic);
		reg("animal/AnimalTrigger.js",AnimalTrigger);
		reg("building/Banklogic.js",Banklogic);
		reg("building/BloodBuildingLogic.js",BloodBuildingLogic);
		reg("building/ChildSchoolLogic.js",ChildSchoolLogic);
		reg("building/FactoryLogic.js",FactoryLogic);
		reg("building/FarmLandLogic.js",FarmLandLogic);
		reg("building/FireLogic.js",FireLogic);
		reg("source/FoodLogic.js",FoodLogic);
		reg("building/FoodPoolLogic.js",FoodPoolLogic);
		reg("building/HomeLogic.js",HomeLogic);
		reg("building/HospitalLogic.js",HospitalLogic);
		reg("building/LabLogic.js",LabLogic);
		reg("helper/MoveLogic.js",MoveLogic);
		reg("building/OfficeLogic.js",OfficeLogic);
		reg("building/OilLogic.js",OilLogic);
		reg("building/OperaLogic.js",OperaLogic);
		reg("building/PastureLogic.js",PastureLogic);
		reg("animal/PetLogic.js",PetLogic);
		reg("building/PetShopLogic.js",PetShopLogic);
		reg("building/PoliceStationLogic.js",PoliceStationLogic);
		reg("building/PowerPlantLogic.js",PowerPlantLogic);
		reg("resident/ResidentLogic.js",ResidentLogic);
		reg("resident/ResidentAILogic.js",ResidentAILogic);
		reg("resident/ResidentCreateBuildingAILogic.js",ResidentCreateBuildingAILogic);
		reg("resident/ResidentSendAILogic.js",ResidentSendAILogic);
		reg("resident/ResidentDoSomeThingAILogic.js",ResidentDoSomeThingAILogic);
		reg("resident/ResidentRandomWalkAILogic.js",ResidentRandomWalkAILogic);
		reg("resident/ResidentFindBlockForCreateAILogic.js",ResidentFindBlockForCreateAILogic);
		reg("resident/ResidentSocialAILogic.js",ResidentSocialAILogic);
		reg("resident/ResidentUseBuildingAILogic.js",ResidentUseBuildingAILogic);
		reg("resident/ResidentHuntAILogic.js",ResidentHuntAILogic);
		reg("resident/ResidentFightAILogic.js",ResidentFightAILogic);
		reg("resident/ResidentLookForLoverAILogic.js",ResidentLookForLoverAILogic);
		reg("panel/ResidentDetailsPanel.js",ResidentDetailsPanel);
		reg("building/RestaurantLogic.js",RestaurantLogic);
		reg("building/SchoolLogic.js",SchoolLogic);
		reg("building/ShopLogic.js",ShopLogic);
		reg("building/SpeedBuildingLogic.js",SpeedBuildingLogic);
		reg("helper/TipLogic.js",TipLogic);
		reg("building/ToolBuildingLogic.js",ToolBuildingLogic);
		reg("building/VillageComLogic.js",VillageComLogic);
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
