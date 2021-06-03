import Utils from "../helper/Utils";
import GameMeta from "../meta/GameMeta";
import GameModel from "../model/GameModel";
import AnimalLogic from "./AnimalLogic";
import AnimalMeta from "./AnimalMeta";

export default class AnimalMgr extends Laya.Script {

    constructor() {
        super();
        this.animals = {};
    }

    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onUpdateFunc);
    }

    static getInstance() {
        if (AnimalMgr.instance) {
            return AnimalMgr.instance
        }
        AnimalMgr.instance = new AnimalMgr();
        AnimalMgr.instance.initSelf();
        return AnimalMgr.instance;
    }

    initSelf() {
        Laya.timer.loop(1000, this, this.onUpdateFunc);
    }

    onUpdateFunc() {
        for (let key in this.animals) {
            let animal = this.animals[key];
            Utils.setMapZOrder(animal);
        }
    }

    // 移除一个动物
    removeAnimalById(animalId) {
        let animal = this.animals[String(animalId)];
        if (animal) {
            animal.destroy(true);
            delete this.animals[String(animalId)];
            GameModel.getInstance().removeAnimalModel(animalId); 
        }
    }

    // 创建动物
    createAnimalByConfig(config, callback) {
        Laya.loader.create(GameMeta.AnimalPrefabPath, Laya.Handler.create(this, function (prefabDef) {
            let animal = prefabDef.create();
            config.parent.addChild(animal);
            let script = animal.getComponent(AnimalLogic);
            script.setTrigger(config.trigger);
            let model = GameModel.getInstance().newAnimalModel(config);
            script.refreshByModel(model);
            this.animals[String(model.getAnimalId())] = animal;
            if (callback) {
                callback.runWith(animal);
            }
        }));
    }

    // 获得一个动物可以杀死的
    getAnimalForAttack(x, y, area) {
        for (const key in this.animals) {
            let item = this.animals[key];
            let script = item.getComponent(AnimalLogic);
            let model = script.getModel();
            let distance = new Laya.Point(item.x, item.y).distance(x, y);
            if (distance <= area &&
                model.getAttackNum() < model.getAttackMaxNum() &&
                model.getState() != AnimalMeta.AnimalState.Die) {
                return item;
            }
        }
        return null;
    }
}