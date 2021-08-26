import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";

export default class BankDialogLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onUpdateGoldText);
    }

    onStart() {
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.BankDialogScenePath);
        });
        this.initCost();
    }

    initCost() {
        this.changeTreeNum = 0;
        this.changeStoneNum = 0;
        this.changeElecNum = 0;
        this.goldNum = 0;
        this.goldText = this.owner.getChildByName("goldText");
        this.treeText = this.owner.getChildByName("numText1");
        this.stoneText = this.owner.getChildByName("numText2");
        this.elecText = this.owner.getChildByName("numText3");

        // this.treeNum = GameModel.getInstance().getTreeNum();
        // this.stoneNum = GameModel.getInstance().getStoneNum();
        // this.elecNum = GameModel.getInstance().getElecNum();
        // this.goldNum = GameModel.getInstance().getGoldNum();
        Laya.timer.loop(30, this, this.onUpdateGoldText);
        this.onUpdateGoldText();

        // 木材
        let addBtn1 = this.owner.getChildByName("addBtn1");
        addBtn1.on(Laya.Event.CLICK, this, function () {
            this.changeTreeNum++;
        });
        let reduceBtn1 = this.owner.getChildByName("reduceBtn1");
        reduceBtn1.on(Laya.Event.CLICK, this, function () {
            this.changeTreeNum--;
        });

        // 石头
        let addBtn2 = this.owner.getChildByName("addBtn2");
        addBtn2.on(Laya.Event.CLICK, this, function () {
            this.changeStoneNum++;
        });
        let reduceBtn2 = this.owner.getChildByName("reduceBtn2");
        reduceBtn2.on(Laya.Event.CLICK, this, function () {
            this.changeStoneNum--;
        });

        // 电力
        let addBtn3 = this.owner.getChildByName("addBtn3");
        addBtn3.on(Laya.Event.CLICK, this, function () {
            this.changeElecNum++;
        });
        let reduceBtn3 = this.owner.getChildByName("reduceBtn3");
        reduceBtn3.on(Laya.Event.CLICK, this, function () {
            this.changeElecNum--;
        });
    }

    onUpdateGoldText() {
        this.goldText.text = String(GameModel.getInstance().getGoldNum());
        this.treeText.text = String(this.changeTreeNum);
        this.stoneText.text = String(this.changeStoneNum);
        this.elecText.text = String(this.changeElecNum);
    }
}