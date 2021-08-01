import AnimalLogic from "../animal/AnimalLogic";
import AnimalMgr from "../animal/AnimalMgr";
import EventMgr from "../helper/EventMgr";
import RandomMgr from "../helper/RandomMgr";
import GameEvent from "../meta/GameEvent";
import ResidentMeta from "../meta/ResidentMeta";

export default class ResidentHuntAILogic extends Laya.Script {

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

    processHunt(level1Results, level2Results) {
        let cell = {
            func: Laya.Handler.create(this, function (param) {
                let animal = AnimalMgr.getInstance().getAnimalForAttack(this.owner.x, this.owner.y, 2000);
                if (animal) {
                    this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.JoinHunt, animal);
                    this.owner.AILogicScript.ideaResult = true;
                }
            })
        };
        if (RandomMgr.randomYes() && this.getModel().isAdult()) {
            level2Results.push(cell);
        }
    }

    // 赶去打猎
    startJoinHunt(param) {
        this.hurtAnimal = param;
        let script = this.hurtAnimal.getComponent(AnimalLogic);
        this.hurtAnimalId = script.getModel().getAnimalId();
        EventMgr.getInstance().registEvent(GameEvent.HUNT_FINISH,
            this.owner.residentLogicScript,
            this.owner.residentLogicScript.onDoWorkFinish);
        script.joinHunt(this.getModel().getResidentId());
        script.pauseWalk();
        let pos = RandomMgr.randomPointForX(this.hurtAnimal.x, this.hurtAnimal.y + this.hurtAnimal.height, this.hurtAnimal.width);
        this.owner.residentLogicScript.walkTo({
            x: pos.x - this.owner.width / 2,
            y: pos.y - this.owner.height / 2,
        }, Laya.Handler.create(this, function () {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.Hunting);
        }));
    }

    onHunting() {
        if (this.hurtAnimal) {
            let script = this.hurtAnimal.getComponent(AnimalLogic);
            script.setHurt();
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani7");
            this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Work);
        }
    }

    onHuntFinished() {
        if (this.hurtAnimal) {
            EventMgr.getInstance().removeEvent(GameEvent.HUNT_FINISH,
                this.owner.residentLogicScript,
                this.owner.residentLogicScript.onDoWorkFinish);
            AnimalMgr.getInstance().removeAnimalById(this.hurtAnimalId);
            this.hurtAnimal = null;
            this.hurtAnimalId = null;
        }
    }
}