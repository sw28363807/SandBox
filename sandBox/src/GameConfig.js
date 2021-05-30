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
import FarmLandLogic from "./building/FarmLandLogic"
import FoodLogic from "./source/FoodLogic"
import HomeLogic from "./building/HomeLogic"
import HospitalLogic from "./building/HospitalLogic"
import OperaLogic from "./building/OperaLogic"
import PastureLogic from "./building/PastureLogic"
import PowerPlantLogic from "./building/PowerPlantLogic"
import ResidentLogic from "./resident/ResidentLogic"
import ResidentDetailsPanel from "./panel/ResidentDetailsPanel"
import SchoolLogic from "./building/SchoolLogic"
import ShopLogic from "./building/ShopLogic"

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
		reg("building/FarmLandLogic.js",FarmLandLogic);
		reg("source/FoodLogic.js",FoodLogic);
		reg("building/HomeLogic.js",HomeLogic);
		reg("building/HospitalLogic.js",HospitalLogic);
		reg("building/OperaLogic.js",OperaLogic);
		reg("building/PastureLogic.js",PastureLogic);
		reg("building/PowerPlantLogic.js",PowerPlantLogic);
		reg("resident/ResidentLogic.js",ResidentLogic);
		reg("panel/ResidentDetailsPanel.js",ResidentDetailsPanel);
		reg("building/SchoolLogic.js",SchoolLogic);
		reg("building/ShopLogic.js",ShopLogic);
    }
}
GameConfig.width = 1336;
GameConfig.height = 750;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "horizontal";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "scene/TestScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;

GameConfig.init();
