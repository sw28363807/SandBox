import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResidentMeta from "../meta/ResidentMeta";
import GameModel from "../model/GameModel";

export default class ResidentUseBuildingAILogic extends Laya.Script {

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

    // 用户自定义
    // ============================================================================
    onUseBuildingCondition(aiData) {
        // 去治疗
        if (aiData == ResidentMeta.ResidentState.GotoTreat) {
            if (this.getModel().getSick() == 2) {
                this.useBuildingAIPriority = 1;
                return true;
            }
            return false;
        }
        // 去学校
        else if (aiData == ResidentMeta.ResidentState.GoToSchool) {
            if (this.getModel().getTeach() < 100) {
                return true;
            }
            return false;
        }
        // 去幼儿园
        else if (aiData == ResidentMeta.ResidentState.GotoChildSchoolForLearn) {
            if (!RandomMgr.randomYes()) {
                return false;
            }
            if (!this.getModel().isAdult()) {
                return true;
            }
            return false;
        }
        // 去食物库
        else if (aiData == ResidentMeta.ResidentState.GotoFoodPoolForEat) {
            let food = this.getModel().getFood();
            if (food < 90) {
                return true;
            } else if (food < 50) {
                this.useBuildingAIPriority = 1;
                return true;
            }
            return false;
        }
        // 去水库
        else if (aiData == ResidentMeta.ResidentState.GotoWaterPoolForDrink) {
            let water = this.getModel().getWater();
            if (this.getModel().getWater() < 90) {
                return true;
            } else if (water < 50) {
                this.useBuildingAIPriority = 1;
                return true;
            }
            return false;
        }
        // 去火堆周围
        else if (aiData == ResidentMeta.ResidentState.GotoFireForHeating) {
            let temperature = this.getModel().getTemperature();
            if (temperature < ResidentMeta.ResidentDangerTemperature + 2) {
                this.useBuildingAIPriority = 1;
                return true;
            } else if (temperature < ResidentMeta.ResidentStandardTemperature - 1) {
                return true;
            }
            return false;
        }
        // 去健身房
        else if (aiData == ResidentMeta.ResidentState.GotoSpeedBuildingForAddSpeed) {
            if (!this.getModel().isAdult()) {
                return false;
            }
            if (this.getModel().getSpeedScale() > 1) {
                return false;
            }
            return true;
        }
        // 去工作
        else if (aiData == ResidentMeta.ResidentState.GoToOfficeForWork) {
            if (this.getModel().isAdult()) {
                return true;
            }
            return false;
        }
        // 去歌剧院
        else if (aiData == ResidentMeta.ResidentState.GotoOperaForWatch) {
            if (this.getModel().getEnjoy() < 90) {
                return true;
            }
            return false;
        }
    }

    onFinishUseBuilding(state) {
        // 治疗完成
        if (state == ResidentMeta.ResidentState.Treating) {
            this.getModel().setSick(1);
            this.owner.residentLogicScript.setBuffAniVisible(false);
            this.owner.residentLogicScript.stopBuffAni();
        }
        // 学习完成
        else if (state == ResidentMeta.ResidentState.Learning) {
            let addTeachInfo = this.useBuilding.buildingScript.getAddTeachInfo();
            console.debug(addTeachInfo);
            if (RandomMgr.randomYes(addTeachInfo.addTeachPriority)) {
                console.debug("成功教育");
                this.getModel().addTeach(addTeachInfo.addTeach); 
            }
        }
        // 在幼儿园学习完成
        else if (state == ResidentMeta.ResidentState.ChildLearn) {
            let addAgePriority = this.useBuilding.buildingScript.getAddAgePriority();
            if (RandomMgr.randomYes(addAgePriority)) {
                this.getModel().addAgeExp(Math.round(ResidentMeta.ResidentAgePeriod/5), true);   
            }
        }
        // 在食物库吃饭完成
        else if (state == ResidentMeta.ResidentState.EatFoodInFoodPool) {
            let residentFood = this.model.getFood();
            let curSaveFood = this.useBuilding.buildingScript.getCurSaveFood();
            let needFood = Math.round(100 - residentFood);
            let deltay = 0;
            if (needFood >= curSaveFood) {
                deltay = curSaveFood
            } else {
                deltay = needFood;
            }
            if (deltay > 40) {
                deltay = 40;
            }
            this.useBuilding.buildingScript.addFoodToPool(-deltay);
            this.getModel().addFood(deltay);
        }
        // 在水库喝水完成
        else if (state == ResidentMeta.ResidentState.DrinkWaterInWaterPool) {
            let residentWater = this.getModel().getWater();
            let curSaveWater = this.useBuilding.buildingScript.getCurSaveWater();
            let needWater = Math.round(100 - residentWater);
            let deltay = 0;
            if (needWater >= curSaveWater) {
                deltay = curSaveWater
            } else {
                deltay = needWater;
            }
            if (deltay > 40) {
                deltay = 40;
            }
            this.useBuilding.buildingScript.addWaterToPool(-deltay);
            this.getModel().addWater(deltay);
        }
        // 火堆烤火完成
        else if (state == ResidentMeta.ResidentState.Heating) {
            this.getModel().setTemperature(ResidentMeta.ResidentStandardTemperature);
            let buildingScript = this.useBuilding.buildingScript;
            buildingScript.removeResidentIdToBuildingForUse(this.getModel().getResidentId());
            if (buildingScript.getHeatingTimes() >= buildingScript.getHeatingMaxTimes()) {
                let num = buildingScript.getResidentIdToBuildingForUseNum();
                if (num == 0) {
                    BuildingMgr.getInstance().removeBuildingById(buildingScript.getModel().getBuildingId());
                }
            }
        }
        // 健身房锻炼完成
        else if (state == ResidentMeta.ResidentState.AddSpeed) {
            let addSpeedScale = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.SpeedBuildingType].addSpeedScale;
            this.getModel().setSpeedScale(addSpeedScale);
        }
        // 工作完成
        else if (state == ResidentMeta.ResidentState.Working) {
            let addGoldMetaNum = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.OfficeType].addGold;
            let buildingScript = this.useBuilding.buildingScript;
            let addGold = Math.min(addGoldMetaNum, buildingScript.getCurSaveGold());
            buildingScript.addGoldToOffice(-addGold);
            GameModel.getInstance().addGoldNum(addGold);
        }
        // 看歌剧完成
        else if (state == ResidentMeta.ResidentState.WatchOpera) {
            let addEnjoy = this.useBuilding.buildingScript.getCurSaveEnjoy();
            this.getModel().addEnjoy(addEnjoy);
            this.useBuilding.buildingScript.setEnjoyToOpera(0);
        }
    }

    // 获取建筑
    onGetBuilding(aiData, data) {
        // 去治疗
        if (aiData == ResidentMeta.ResidentState.GotoTreat) {
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], null, true);
            return building
        }
        // 去学校
        else if (aiData == ResidentMeta.ResidentState.GoToSchool) {
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], null, true);
            return building
        }
        // 去幼儿园
        else if (aiData == ResidentMeta.ResidentState.GotoChildSchoolForLearn) {
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], null, true);
            return building
        }
        // 去食物库
        else if (aiData == ResidentMeta.ResidentState.GotoFoodPoolForEat) {
            let filterFunc = function (building) {
                let curSaveFood = building.buildingScript.getCurSaveFood();
                if (curSaveFood > 0) {
                    return true;
                }
                return false;
            };
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], filterFunc, true);
            return building;
        }
        // 去水库
        else if (aiData == ResidentMeta.ResidentState.GotoWaterPoolForDrink) {
            let filterFunc = function (building) {
                let curSaveWater = building.buildingScript.getCurSaveWater();
                if (curSaveWater > 0) {
                    return true;
                }
                return false;
            };
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], filterFunc, true);
            return building;
        }
        // 去火堆
        else if (aiData == ResidentMeta.ResidentState.GotoFireForHeating) {
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], function (building) {
                    return building.buildingScript.getHeatingTimes() < building.buildingScript.getHeatingMaxTimes();
                }, true);
            return building;
        }
        // 去健身房
        else if (aiData == ResidentMeta.ResidentState.GotoSpeedBuildingForAddSpeed) {
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], null, true);
            return building;
        }
        // 去office
        else if (aiData == ResidentMeta.ResidentState.GoToOfficeForWork) {
            let filterFunc = function (building) {
                if (building.buildingScript.getCurSaveGold() == 0) {
                    return false;
                } else if (building.buildingScript.isReachGoldMax()) {
                    return false;
                }
                return true;
            }
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], filterFunc, true);
            return building;
        }
        // 去歌剧院
        else if (aiData == ResidentMeta.ResidentState.GotoOperaForWatch) {
            let building = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, data.buildingType,
                2000, [BuildingMeta.BuildingState.Noraml], null, true);
            return building;
        }
        return null;
    }


    onGotoUseBuildingPre() {
        let model = this.useBuilding.buildingScript.getModel();
        let buildingType = model.getBuildingType();
        if (buildingType == BuildingMeta.BuildingType.FireType) {
            this.useBuilding.buildingScript.addHeatingTimes(1);
            this.useBuilding.buildingScript.joinResidentIdToBuildingForUse(this.getModel().getResidentId());
        }

    }


    // ====================================================================================

    //处理使用建筑
    processUseBuildingAI(level1Results, level2Results) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let item = ResidentMeta.ResidentUseBuildingMap[key];
            this.useBuildingAIPriority = 2;
            if (this.onUseBuildingCondition(key)) {
                let cell = {
                    func: Laya.Handler.create(this, function () {
                        let building = this.onGetBuilding(key, item);
                        if (building) {
                            this.owner.residentLogicScript.refreshFSMState(key, building);
                            this.owner.AILogicScript.ideaResult = true;
                        }
                    })
                };
                if (this.useBuildingAIPriority == 2) {
                    level2Results.push(cell);
                } else {
                    level1Results.push(cell);
                }
            }
        }
    }

    onUseBuildingPre(useData) {
        if (useData.buildingType == BuildingMeta.BuildingType.FireType) {
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Enjoy);
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani11");
        }
    }

    canGotoUseBuilding(fsmState) {
        let value = ResidentMeta.ResidentUseBuildingMap[String(fsmState)];
        return value;
    }

    startGotoBuildingForUse(config) {
        let data = ResidentMeta.ResidentUseBuildingMap[this.getModel().getFSMState()];
        this.useBuilding = config.building;
        let nextState = config.nextState;
        let destX = this.useBuilding.x + this.useBuilding.width / 2 - this.owner.width / 2;
        let destY = this.useBuilding.y + this.useBuilding.height - this.owner.height + ResidentMeta.ResidentGotoYOff;
        if (data.useType == 2) {
            destY = this.useBuilding.y + this.useBuilding.height / 2 - this.owner.height + ResidentMeta.ResidentGotoYOff;
            let p = RandomMgr.randomByArea3(destX, destY, 70, 100);
            destX = p.x;
            destY = p.y;
        }
        this.onGotoUseBuildingPre();
        this.owner.residentLogicScript.walkTo({
            x: destX,
            y: destY,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(nextState, this.useBuilding);
        }));
    }

    canStartUseBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let value = ResidentMeta.ResidentUseBuildingMap[key];
            if (value.nextState == fsmState && fsmState != undefined && fsmState != null) {
                return value;
            }
        }
        return null;
    }

    canFinishUseBuilding(fsmState) {
        for (const key in ResidentMeta.ResidentUseBuildingMap) {
            let value = ResidentMeta.ResidentUseBuildingMap[key];
            if (value.nextState == fsmState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    // 使用建筑
    startUseBuilding(useData) {
        if (this.useBuilding) {
            this.owner.residentLogicScript.stopAni();
            if (useData.useType != 2) {
                this.owner.visible = false;
            }
            let buildingModel = this.useBuilding.buildingScript.getModel();
            let buildingType = buildingModel.getBuildingType();
            let buildingMeta = BuildingMeta.BuildingDatas[String(buildingType)];
            this.onUseBuildingPre(useData);
            Laya.timer.once(buildingMeta.useBuildingTime,
                this.owner.residentLogicScript,
                this.owner.residentLogicScript.onDoWorkFinish,
                [this.owner.residentLogicScript.makeParam(null)]);
        }
    }

    clearUseBuilding() {
        Laya.timer.clear(this.owner.residentLogicScript, this.owner.residentLogicScript.onDoWorkFinish);
        this.useBuilding = null;
    }

}