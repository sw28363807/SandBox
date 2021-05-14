import GameMeta from "../meta/GameMeta";
import ResidentMeta from "../meta/ResidentMeta";
import ResidentModel from "./ResidentModel";

export default class GameModel extends Laya.Script {

    constructor() { 
        super();
        this.maxResidentID = 0;         //人物最大ID
        this.residentModels = {};       //角色数据
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        if (GameModel.instance) {
            return GameModel.instance
        }
        GameModel.instance =  new GameModel();
        GameModel.instance.initSelf();
        return GameModel.instance;
    }

    // 添加角色Model
    newResidentModel(param) {
        this.maxResidentID++;
        let model = new ResidentModel();
        model.uopdateData({
            x: param.x,
            y: param.y,
            sex: param.sex,
            residentId: this.maxResidentID,
        });
        this.residentModels[String(this.maxResidentID)] = model;
        return model;
    }

    // 人物数值timer
    onUpdateResidentValue() {
        // 数值计算定时器
        for (let key in this.residentModels) {
            let item = this.residentModels[key];
            item.onStep();
        }
    }

    //初始化自己 
    initSelf() {
        Laya.timer.loop(ResidentMeta.ResidentValueStep, this, this.onUpdateResidentValue);
    }
}