import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
export default class PowerPlantLogic extends BuildingBaseLogic {

    constructor() {
        super();
        this.meta = BuildingMeta.BuildingDatas[String(BuildingMeta.BuildingType.PowerPlantType)];
        this.maxElec = this.meta.maxElec;
        this.addElec = this.meta.addElec;
        this.timeStep = this.meta.timeStep;
        this.damageStep = this.meta.damageStep;
        this.damageProbability = this.meta.damageProbability;

        this.canDamage = true;
    }

    // 建筑初始化
    onInitBuilding() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onUpdateTimer);
        Laya.timer.clear(this, this.onDamage);
        super.onDisable();
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.initTimer();
    }

    // 点击建筑物
    onClickBuilding() {
        Laya.Dialog.open(ResourceMeta.PowerPlantDialogScenePath, null, null, Laya.Handler.create(this, function (scene) {
            scene.selectedBuilding = this.owner;
        }));
    }

    initTimer() {
        Laya.timer.loop(this.timeStep, this, this.onUpdateTimer);
        Laya.timer.loop(this.damageStep, this, this.onDamage);
    }

    onDamage() {
        if (this.getCanDamage() == true) {
            if (RandomMgr.randomYes(this.damageProbability)) {
                this.setCurState(0);
            }
        }
    }

    onUpdateTimer() {
        if (this.getCurState() == 1) {
            this.addCurSaveElec(this.addElec);   
        }
    }


    setCanDamage(canDamage) {
        this.canDamage = canDamage;
    }

    getCanDamage() {
        return this.canDamage;
    }

    // 获得当前的发电厂状态
    //0 断开状态 1 连通状态
    getCurState() {
        let model = this.getModel();
        let curState = model.getExteraData("curState");
        if (curState == undefined || curState == null) {
            curState = 0;
        }
        return Number(curState);
    }

    // 设置当前发电厂的状态
    //0 断开状态 1 连通状态
    setCurState(state) {
        let model = this.getModel();
        model.setExteraData("curState", state);
    }

    // 获得当前储存的电力
    getCurSaveElec() {
        let model = this.getModel();
        let curSaveElec = model.getExteraData("curSaveElec");
        if (curSaveElec == undefined || curSaveElec == null) {
            curSaveElec = 0;
        }
        return Number(curSaveElec);
    }

    // 设置当前储存的电力
    setCurSaveElec(num) {
        if (num > this.maxElec) {
            num = this.maxElec;
        }
        let model = this.getModel();
        model.setExteraData("curSaveElec", num);
    }

    // 添加当前储存的电力
    addCurSaveElec(num) {
        let elec = this.getCurSaveElec();
        this.setCurSaveElec(elec + num);
    }
}