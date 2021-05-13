export default class GameModel extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        let ret = GameModel.instance = GameModel.instance || new GameModel();
        return ret
    }
}