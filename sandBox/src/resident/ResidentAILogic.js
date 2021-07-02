import RandomMgr from "../helper/RandomMgr";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentTipMeta from "../meta/ResidentTipMeta";

export default class ResidentAILogic extends Laya.Script {

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


    // 做出策略
    makeIdea() {
        if (this.getModel().getFSMState() != ResidentMeta.ResidentState.IdleState) {
            return;
        }
        if (!RandomMgr.randomYes(this.getModel().getPositive())) {
            return;
        }
        if (RandomMgr.randomYes(ResidentTipMeta.BoredTipsProbability)) {
            this.owner.residentLogicScript.showTip(ResidentTipMeta.randomOneBoredTip());
        }
        // 处理可以做的事情
        this.processResult();
        this.doResult();
    }

    // 处理策略
    processResult() {
        this.level1Results = [];
        this.level2Results = [];
        // =================================正式================start
        // // 喝水
        // this.processDrinkWater();
        // //吃饭
        // this.processEatFood();
        // // 社交
        // this.processSocial();
        // // 砍树
        // this.processCutDownTree();
        // // 收集石头
        // this.processCollectStone();
        // // 跑去打猎
        // this.processHunt();
        // // 找恋人
        // this.processLookForLover();
        // // 打架
        // this.processFight();
        // // 赶着去溜达
        // this.processRandomWalk();
        // 跑去建造
        this.owner.createBuildingScript.processCreateBuilding(this.level1Results, this.level2Results);
        // // 跑去运送
        this.owner.sendScript.processSend(this.level1Results, this.level2Results);
        // 跑去使用建筑
        // this.processUseBuildingAI();
        // 自动搜索建筑去建造AI
        // this.processResidentFindCreateBuildingBlockAI();
        // =================================正式================end
    }

    // 执行策略
    doResult() {
        while (this.level1Results.length != 0) {
            let index = RandomMgr.randomNumber(0, this.level1Results.length - 1);
            let cell = this.level1Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
            this.level1Results.splice(index, 1);
        }

        while (this.level2Results.length != 0) {
            let index = RandomMgr.randomNumber(0, this.level2Results.length - 1);
            let cell = this.level2Results[index];
            this.ideaResult = false;
            cell.func.runWith(cell.param);
            if (this.ideaResult) {
                return;
            }
            this.level2Results.splice(index, 1);
        }
        this.ideaResult = false;
    }

}