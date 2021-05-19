import AnimalMeta from "../animal/AnimalMeta";

export default class AnimalModel extends Laya.Script {

    constructor() { 
        super();
        this.animalId = 0;
        this.x = 0;
        this.y = 0;
        this.attackMaxNum = 2;
        this.curAttackNum = 0; 
        this.life = AnimalMeta.AnimalLife;
        this.state = AnimalMeta.AnimalState.NullState;
    }

    updateData(data) {
        if (data) {
            if (data.x) {
                this.x = data.x;
            }
            if (data.y) {
                this.y = data.y;
            }
            if (data.animalId) {
                this.animalId = data.animalId;
            }
        }
    }

    setAttackNum(num) {
        this.curAttackNum = num;
        if (this.curAttackNum > this.attackMaxNum) {
            this.curAttackNum = this.attackMaxNum;
        } else if (this.curAttackNum < 0) {
            this.curAttackNum = 0;
        }
    }

    getAttackNum() {
        return this.curAttackNum;
    }

    addAttackNum(num) {
        this.setAttackNum(this.getAttackNum() + num);
    }

    getAttackMaxNum() {
        return this.attackMaxNum;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
    
    getAnimalId() {
        return this.animalId;
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        return this.state;
    }
}