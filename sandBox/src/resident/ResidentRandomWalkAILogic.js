import RandomMgr from "../helper/RandomMgr";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentHelper from "./ResidentHelper";

export default class ResidentRandomWalkAILogic extends Laya.Script {

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

    processRandomWalk(level1Results, level2Results) {
        let cell = {
            func: Laya.Handler.create(this, function () {
                let p = RandomMgr.randomByArea(this.owner.x, this.owner.y, 200);
                if (!ResidentHelper.isOccupySpace(this.owner.x,
                    this.owner.y,
                    this.owner.width,
                    this.owner.height)) {
                    this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.RandomWalk, p);
                    this.owner.AILogicScript.ideaResult = true;
                }
            }),
        };
        level2Results.push(cell);
    }

    // 随机跑一个位置
    startGotoRandomPoint(p) {
        this.owner.residentLogicScript.walkTo({
            x: p.x,
            y: p.y,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }));
    }
}