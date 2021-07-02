import BuildingMgr from "../building/BuildingMgr";
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
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Walk);
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
        Laya.timer.once(ResidentMeta.ResidentCollectSendTime, this, this.onCollectSendFinish, [info]);
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

    onGetAddValueInfo(info) {
        let sendInfo = info.sendInfo;
        let fsmState = this.getModel().getFSMState();
        // 食物增加值
        if (fsmState == ResidentMeta.ResidentState.CollectFood) {
            let foodModel = sendInfo.send.foodScript.getModel();
            let addFoodNum = foodModel.getFood();
            FoodMgr.getInstance().removeFoodById(foodModel.getFoodId());
            sendInfo.send = null;
            info.addFood = addFoodNum;
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
            if (this.getModel().getAge() < ResidentMeta.ResidentAdultAge) {
                return false;
            }
            return true;
        }
        // 水源判断
        else if (AIType == ResidentMeta.ResidentState.FindWaterForSend) {
            if (this.getModel().getAge() < ResidentMeta.ResidentAdultAge) {
                return false;
            }
            return true;
        }
    }

    getSendAndDest(AIType) {
        // 食物
        if (AIType == ResidentMeta.ResidentState.FindFoodForSend) {
            let nearstFood = FoodMgr.getInstance().getRandomFood({
                x: this.owner.x,
                y: this.owner.y,
                state: FoodMeta.FoodState.CanEat,
                area: 2000
            });
            let nearstBuilding = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.FoodPoolType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (nearstBuilding && !nearstBuilding.buildingScript.isReachFoodMax()) {
                return {
                    AIType: AIType,
                    send: nearstFood,
                    dest: nearstBuilding,
                };
            }
            return null;
        }
        // 水源
        else if (AIType == ResidentMeta.ResidentState.FindWaterForSend) {
            let nearstWater = WaterMgr.getInstance().randomWater(this.owner.x, this.owner.y, 2000);
            let nearstBuilding = BuildingMgr.getInstance().getRandomBuilding(this.owner.x,
                this.owner.y, BuildingMeta.BuildingType.WaterPoolType,
                2000, [BuildingMeta.BuildingState.Noraml]);
            if (nearstBuilding && !nearstBuilding.buildingScript.isReachWaterMax()) {
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
            sendInfo.send.foodScript.getModel().setFoodState(FoodMeta.FoodState.Occupy);
        }
    }
}