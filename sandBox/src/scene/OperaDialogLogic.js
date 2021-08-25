import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
export default class OperaDialogLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.refreshNum);
    }

    onStart() {
        this.addTouchEnjoy = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.OperaType].addTouchEnjoy;
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.OperaDialogScenePath);
        });
        this.descText = this.owner.getChildByName("descText");
        this.initTouch();

        Laya.timer.loop(1000, this, this.refreshNum);
    }

    refreshNum() {
        let num = this.buildingScript.getCurSaveEnjoy();
        this.descText.text = String(num);
    }

    initTouch() {
        this.touchs = {};
        for (let index = 0; index < 7; index++) {
            let control = this.owner.getChildByName("sound" + String(index + 1));
            this.touchs[String(index + 1)] = control;
            let numText = control.getChildByName("num");
            numText.text = String(index + 1);
            let state1 = control.getChildByName("state1");
            let state2 = control.getChildByName("state2");
            control.state1 = state1;
            control.state2 = state2;
            control.on(Laya.Event.MOUSE_DOWN, this, function () {
                this.onTouchDownControl(index + 1, control);
            });
            control.on(Laya.Event.MOUSE_UP, this, function () {
                this.onTouchUpControl(index + 1, control);
            });
            control.on(Laya.Event.MOUSE_OUT, this, function () {
                this.onTouchUpControl(index + 1, control);
            });
        }
    }

    onTouchDownControl(index, control) {
        control.state2.visible = false;
        let key = "source/sound/" + String(index) + ".mp3"
        Laya.SoundManager.playSound(key, 1);
        this.buildingScript.addEnjoyToOpera(this.addTouchEnjoy);
        this.refreshNum();
    }

    onTouchUpControl(index, control) {
        control.state2.visible = true;
    }
}