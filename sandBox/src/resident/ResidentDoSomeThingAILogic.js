import RandomMgr from "../helper/RandomMgr";
import FoodMeta from "../meta/FoodMeta";
import ResidentMeta from "../meta/ResidentMeta";
import FoodMgr from "../source/FoodMgr";
import TreeMgr from "../source/TreeMgr";
import WaterMgr from "../source/WaterMgr";
import GameModel from "../model/GameModel";
import StoneMgr from "../source/StoneMgr";

export default class ResidentDoSomeThingAILogic extends Laya.Script {

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

    canReachDoSomeThingCondition(key, AIData) {
        // 寻找食物
        if (key == ResidentMeta.ResidentState.FindFood) {
            this.doSomeThingAIPriority = 2;
            let food = this.getModel().getFood();
            if (food < ResidentMeta.ResidentFoodNeedValue) {
                this.doSomeThingAIPriority = 1;
                return true;
            } else if (food < 50) {
                return true;
            }
            return false;
        }
        // 寻找水源
        else if (key == ResidentMeta.ResidentState.FindWater) {
            this.doSomeThingAIPriority = 2;
            let water = this.getModel().getWater();
            if (water < ResidentMeta.ResidentWaterNeedValue) {
                this.doSomeThingAIPriority = 1;
                return true;
            } else if (water < 100) {
                return true;
            }
            return false;
        }
        // 砍树
        else if (key == ResidentMeta.ResidentState.FindTree) {
            this.doSomeThingAIPriority = 2;
            if (RandomMgr.randomYes() && this.getModel().isAdult()) {
                return true;
            }
            return false;
        }
        // 收集石头
        else if (key == ResidentMeta.ResidentState.FindStone) {
            this.doSomeThingAIPriority = 2;
            if (RandomMgr.randomYes() && this.getModel().isAdult()) {
                return true;
            }
            return false;
        }
    }

    getGotoTargetInfo(key, AIData) {
        // 寻找食物
        if (key == ResidentMeta.ResidentState.FindFood) {
            let nearstFood = FoodMgr.getInstance().getRandomFood({
                x: this.owner.x,
                y: this.owner.y,
                state: FoodMeta.FoodState.CanEat,
                area: 2000,
            });
            if (!nearstFood) {
                return null;
            }
            return {
                AIType: key,
                AIData: AIData,
                target: nearstFood,
                desX: nearstFood.x,
                desY: nearstFood.y,
            }
        }
        // 寻找水源
        else if (key == ResidentMeta.ResidentState.FindWater) {
            let nearstWater = WaterMgr.getInstance().randomWater(this.owner.x, this.owner.y, 2000);
            if (!nearstWater) {
                return null;
            }
            let dsp = RandomMgr.randomPointInRect(nearstWater.x, nearstWater.y, nearstWater.width, nearstWater.height);
            return {
                AIType: key,
                AIData: AIData,
                target: nearstWater,
                desX: dsp.x,
                desY: dsp.y,
            }
        }
        // 砍树
        else if (key == ResidentMeta.ResidentState.FindTree) {
            let nearstTree = TreeMgr.getInstance().getRandomTree(this.owner.x, this.owner.y, 2000);
            if (!nearstTree) {
                return null;
            }
            return {
                AIType: key,
                AIData: AIData,
                target: nearstTree,
                desX: nearstTree.x + nearstTree.width / 2 - this.owner.width / 2,
                desY: nearstTree.y + nearstTree.height - this.owner.height + 20,
            }
        }
        // 收集石头
        else if (key == ResidentMeta.ResidentState.FindStone) {
            let nearstStone = StoneMgr.getInstance().getNearstStone(this.owner.x, this.owner.y);
            if (!nearstStone) {
                return null;
            }
            return {
                AIType: key,
                AIData: AIData,
                target: nearstStone,
                desX: nearstStone.x + nearstStone.width / 2 - this.owner.width / 2,
                desY: nearstStone.y + nearstStone.height - this.owner.height + 20,
            }
        }
    }

    preGotoTarget(targetInfo) {
        // 寻找食物
        if (targetInfo.AIType == ResidentMeta.ResidentState.FindFood) {
            let script = targetInfo.target.foodScript;
            script.getModel().setFoodState(FoodMeta.FoodState.Occupy);
        }
        // 寻找水源
        else if (targetInfo.AIType == ResidentMeta.ResidentState.FindWater) {

        }
        // 寻找树木
        else if (targetInfo.AIType == ResidentMeta.ResidentState.FindTree) {

        }
        // 寻找石头
        else if (targetInfo.AIType == ResidentMeta.ResidentState.FindStone) {

        }
    }

    doSomeThing(fsmState, targetInfo) {
        // 吃东西
        if (fsmState == ResidentMeta.ResidentState.EatFood) {
            this.curTargetInfo = targetInfo;
            let script = this.curTargetInfo.target.foodScript;
            let model = script.getModel();
            model.setFoodState(FoodMeta.FoodState.Eating);
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
            this.owner.residentLogicScript.setStateAni("ani3");
            Laya.timer.once(model.getEatCDTime(),
                this.owner.residentLogicScript,
                this.owner.residentLogicScript.onDoWorkFinish,
                [this.owner.residentLogicScript.makeParam(null)]);
        }
        // 喝水
        else if (fsmState == ResidentMeta.ResidentState.DrinkWater) {
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani4");
            Laya.timer.once(FoodMeta.DrinkWaterTime,
                this.owner.residentLogicScript,
                this.owner.residentLogicScript.onDoWorkFinish,
                [this.owner.residentLogicScript.makeParam(null)]);
        }
        // 砍树
        else if (fsmState == ResidentMeta.ResidentState.CutDownTree) {
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani1");
            Laya.timer.once(ResidentMeta.CutDownTreeTime,
                this.owner.residentLogicScript,
                this.owner.residentLogicScript.onDoWorkFinish,
                [this.owner.residentLogicScript.makeParam(null)]);
        }
        // 寻找石头
        else if (fsmState == ResidentMeta.ResidentState.CollectStone) {
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani2");
            Laya.timer.once(ResidentMeta.CollectStoneTime,
                this.owner.residentLogicScript,
                this.owner.residentLogicScript.onDoWorkFinish,
                [this.owner.residentLogicScript.makeParam(null)]);
        }
    }

    onFinishDoSomeThing(fsmState) {
        if (fsmState == ResidentMeta.ResidentState.EatFood) {
            let script = this.curTargetInfo.target.foodScript;
            let foodModel = script.getModel();
            this.getModel().addFood(foodModel.getFood());
            FoodMgr.getInstance().removeFoodById(foodModel.getFoodId());
            this.curTargetInfo = null;
        }
        else if (fsmState == ResidentMeta.ResidentState.DrinkWater) {
            this.getModel().addWater(ResidentMeta.ResidentDrinkWaterAddValue);
        }
        else if (fsmState == ResidentMeta.ResidentState.CutDownTree) {
            GameModel.getInstance().addTreeNum(ResidentMeta.ResidentAddTreeBaseValue);
        }
        else if (fsmState == ResidentMeta.ResidentState.CollectStone) {
            GameModel.getInstance().addStoneNum(ResidentMeta.ResidentAddStoneBaseValue);
        }
    }

    // ---------------------------------------------------------------------------------
    canGotoTargetExt(fsmState) {
        for (const key in ResidentMeta.ResidentGOtoSomeWhereDoSomeThingAIMap) {
            let item = ResidentMeta.ResidentGOtoSomeWhereDoSomeThingAIMap[key];
            if (fsmState == key) {
                return true;
            }
        }
        return false;
    }

    gotoTargetForDoSomeThing(fsmState, targetInfo) {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Walk);
        this.owner.residentLogicScript.walkTo({ x: targetInfo.desX, y: targetInfo.desY },
            Laya.Handler.create(this, function () {
                this.owner.residentLogicScript.refreshFSMState(targetInfo.AIData.nextState, targetInfo);
            }));
    }

    canDoSomeThingExt(fsmState) {
        for (const key in ResidentMeta.ResidentGOtoSomeWhereDoSomeThingAIMap) {
            let item = ResidentMeta.ResidentGOtoSomeWhereDoSomeThingAIMap[key];
            if (fsmState == item.nextState && fsmState != undefined && fsmState != null) {
                return true;
            }
        }
        return false;
    }


    processDoSomeThing(level1Results, level2Results) {
        for (const key in ResidentMeta.ResidentGOtoSomeWhereDoSomeThingAIMap) {
            let AIData = ResidentMeta.ResidentGOtoSomeWhereDoSomeThingAIMap[key];
            this.doSomeThingAIPriority = 2;
            if (this.canReachDoSomeThingCondition(key, AIData)) {
                let doSomeThingCell = {
                    func: Laya.Handler.create(this, function () {
                        let targetInfo = this.getGotoTargetInfo(key, AIData);
                        if (targetInfo && targetInfo.target) {
                            this.owner.AILogicScript.ideaResult = true;
                            this.preGotoTarget(targetInfo);
                            this.owner.residentLogicScript.refreshFSMState(key, targetInfo);
                        } else {
                            this.owner.AILogicScript.ideaResult = false;
                            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                        }
                    }),
                };
                if (this.doSomeThingAIPriority == 1) {
                    level1Results.push(doSomeThingCell);
                } else {
                    level2Results.push(doSomeThingCell);
                }

            }
        }
    }
}