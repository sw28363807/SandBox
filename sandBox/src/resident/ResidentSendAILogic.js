import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import FoodMeta from "../meta/FoodMeta";
import ResidentMeta from "../meta/ResidentMeta";
import FoodMgr from "../source/FoodMgr";
import WaterMgr from "../source/WaterMgr";

export default class ResidentSendAILogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onCollectSendFinish);
        Laya.timer.clear(this, this.onPutDownSend);
    }

    onStart() {
        this.model = this.owner.residentLogicScript.getModel();
    }

    getModel() {
        return this.model;
    }


    // 处理运送
    processSend(level1Results, level2Results) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            if (this.canReachSendCondition(key)) {
                let sendCell = {
                    func: Laya.Handler.create(this, function () {
                        let sendInfo = this.getSendAndDest(key);
                        if (sendInfo && sendInfo.send && sendInfo.dest) {
                            this.preSend(key, sendInfo);
                            this.owner.residentLogicScript.refreshFSMState(key, sendInfo);
                            this.owner.AILogicScript.ideaResult = true;
                        }
                    }),
                };
                level2Results.push(sendCell);
            }
        }
    }

    canSendExt(fsmState) {
        return ResidentMeta.ResidentSendAIMap[fsmState];
    }

    gotoFindSend(info) {
        let sendAIMeta = info.sendAIMeta;
        let sendInfo = info.sendInfo;
        let collectState = sendAIMeta.collectState;
        this.owner.residentLogicScript.walkTo({
            x: sendInfo.send.x + sendInfo.send.width / 2 - this.owner.width / 2,
            y: sendInfo.send.y + sendInfo.send.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(collectState, info);
        }));
    }

    canCollect(fsmState) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            let item = ResidentMeta.ResidentSendAIMap[key];
            if (fsmState == item.collectState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canSendToDest(fsmState) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            let item = ResidentMeta.ResidentSendAIMap[key];
            if (fsmState == item.lastState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    canSendFinish(fsmState) {
        for (const key in ResidentMeta.ResidentSendAIMap) {
            let item = ResidentMeta.ResidentSendAIMap[key];
            if (fsmState == item.lastState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }

    colletSend(info) {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
        this.owner.residentLogicScript.setStateAniVisible(true);
        this.owner.residentLogicScript.setStateAni("ani9");
        Laya.timer.once(ResidentMeta.ResidentCollectSendTime * this.getModel().getFarmScale(), this, this.onCollectSendFinish, [info]);
    }

    onCollectSendFinish(info) {
        let sendAIMeta = info.sendAIMeta;
        this.onGetAddValueInfo(info);
        this.owner.residentLogicScript.refreshFSMState(sendAIMeta.lastState, info);
    }

    gotoSendToDest(info) {
        this.owner.residentLogicScript.setStateAniVisible(true);
        this.owner.residentLogicScript.setStateAni("ani10");
        let sendInfo = info.sendInfo;
        this.owner.residentLogicScript.walkTo({
            x: sendInfo.dest.x + sendInfo.dest.width / 2 - this.owner.width / 2,
            y: sendInfo.dest.y + sendInfo.dest.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
        }, Laya.Handler.create(this, function () {
            this.onPutDownSend(info);
        }));
    }

    onPutDownSend(info) {
        this.owner.visible = false;
        Laya.timer.once(1000, this, function () {
            this.owner.visible = true;
            this.owner.residentLogicScript.onDoWorkFinish(this.owner.residentLogicScript.makeParam(info));
        });
    }

    // 用户自定义开始=======================================
    onGetAddValueInfo(info) {
        let sendInfo = info.sendInfo;
        let fsmState = this.getModel().getFSMState();
        // 食物增加值
        if (fsmState == ResidentMeta.ResidentState.CollectFood) {
            if (sendInfo.sendType == 2) {
                let foodModel = sendInfo.send.foodScript.getModel();
                let addFoodNum = foodModel.getFood();
                FoodMgr.getInstance().removeFoodById(foodModel.getFoodId());
                sendInfo.send = null;
                info.addFood = addFoodNum;
            } else if (sendInfo.sendType == 1) {
                let meta = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.FarmLandType];
                let farmScript = sendInfo.send.buildingScript;
                let foodPoolValue = farmScript.getCurSaveFood();
                let value = Math.min(foodPoolValue, meta.addFood);
                farmScript.addFoodToPool(-value);
                sendInfo.send = null;
                info.addFood = value;
            } else if (sendInfo.sendType == 3) {
                let meta = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.PastureType];
                let pastureScript = sendInfo.send.buildingScript;
                let foodPoolValue = pastureScript.getCurSaveFood();
                let value = Math.min(foodPoolValue, meta.addFood);
                pastureScript.addFoodToPool(-value);
                sendInfo.send = null;
                info.addFood = value;
            }
        }
        // 水源增加值
        else if (fsmState == ResidentMeta.ResidentState.CollectWater) {
            info.addWater = ResidentMeta.ResidentSaveWaterAddValue;
        }
    }

    onFinishSend(param) {
        let extraParam = param.extraParam;
        let dest = extraParam.sendInfo.dest;
        let fsmState = this.getModel().getFSMState();
        // 运送食物完成
        if (fsmState == ResidentMeta.ResidentState.SendFoodToFoodPool) {
            dest.buildingScript.addFoodToPool(extraParam.addFood);
        }
        // 运送水源完成
        else if (fsmState == ResidentMeta.ResidentState.SendWaterToWaterPool) {
            dest.buildingScript.addWaterToPool(extraParam.addWater);
        }
    }

    canReachSendCondition(AIType) {
        // 食物判断
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            if (!this.getModel().isAdult()) {
                return false;
            }
            return true;
        }
        // 水源判断
        else if (AIType == ResidentMeta.ResidentState.FindWaterForSend) {
            if (!this.getModel().isAdult()) {
                return false;
            }
            return true;
        }
    }

    getSendAndDest(AIType) {
        // 食物
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            let sendType = 0;
            let sendObject = null;
            // 寻找农田
            let filterFunc = function (building) {
                return building.buildingScript.getCurSaveFood() > 20;
            };
            let nearstFarmland = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.FarmLandType,
                2000, [BuildingMeta.BuildingState.Noraml], filterFunc, true);

            let nearstPasture = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.PastureType,
                2000, [BuildingMeta.BuildingState.Noraml], filterFunc, true);

            // 寻找食物
            let nearstFood = FoodMgr.getInstance().getRandomFood({
                x: this.owner.x,
                y: this.owner.y,
                state: FoodMeta.FoodState.CanEat,
                area: 2000
            });

            if (nearstFarmland || nearstPasture) {
                if (nearstFarmland && !nearstPasture) {
                    sendType = 1;
                    sendObject = nearstFarmland;
                } else if (nearstPasture && !nearstFarmland) {
                    sendType = 3;
                    sendObject = nearstPasture;
                } else {
                    if (RandomMgr.randomYes()) {
                        sendType = 1;
                        sendObject = nearstFarmland;
                    } else {
                        sendType = 3;
                        sendObject = nearstPasture;
                    }
                }
            } else if (nearstFood) {
                sendType = 2;
                sendObject = nearstFood;
            }

            let foodPoolFilterFunc = function (building) {
                return !building.buildingScript.isReachFoodMax();
            };
            let nearstBuilding = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.FoodPoolType,
                2000, [BuildingMeta.BuildingState.Noraml], foodPoolFilterFunc, true);
            if (nearstBuilding) {
                return {
                    AIType: AIType,
                    send: sendObject,
                    dest: nearstBuilding,
                    sendType: sendType
                };
            }
            return null;
        }
        // 水源
        else if (AIType == ResidentMeta.ResidentState.FindWaterForSend) {
            let nearstWater = WaterMgr.getInstance().randomWater(this.owner.x, this.owner.y, 2000);
            let waterFilterFunc = function (building) {
                return !building.buildingScript.isReachWaterMax()
            }
            let nearstBuilding = BuildingMgr.getInstance().getAlltBuildingForCondition(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.WaterPoolType,
                2000, [BuildingMeta.BuildingState.Noraml], waterFilterFunc, true);
            if (nearstBuilding) {
                return {
                    AIType: AIType,
                    send: nearstWater,
                    dest: nearstBuilding,
                };
            }
            return null;
        }
    }

    preSend(AIType, sendInfo) {
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            if (sendInfo.sendType == 2) {
                sendInfo.send.foodScript.getModel().setFoodState(FoodMeta.FoodState.Occupy);
            }
        }
    }
}