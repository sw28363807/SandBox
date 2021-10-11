import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";
import GameModel from "../model/GameModel";

export default class PowerPlantDialogLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
        this.buildingScript.setCanDamage(true);
        Laya.timer.clear(this, this.refreshDescText2);
    }

    onStart() {
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();

        this.buildingScript.setCanDamage(false);
        this.descText2 = this.owner.getChildByName("descText2");

        this.yesBtn = this.owner.getChildByName("yesBtn");
        this.yesBtn.on(Laya.Event.CLICK, this, function () {
            let curSaveElec = this.buildingScript.getCurSaveElec();
            GameModel.getInstance().addElecNum(curSaveElec);
            this.buildingScript.setCurSaveElec(0);
            this.refreshDescText2();
        });

        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.PowerPlantDialogScenePath);
        });

        this.root = this.owner.getChildByName("root");
        this.slider = this.root.getChildByName("slider");
        this.green = this.slider.getChildByName("green");
        this.red = this.slider.getChildByName("red");
        this.descText = this.owner.getChildByName("descText");
        
        this.refreshSwitchState();
        this.initSliderTouch();
        let switchState = this.buildingScript.getCurState();
        if (switchState == 1) {
            this.slider.x = 0;
        }

        Laya.timer.loop(500, this, this.refreshDescText2);
        this.refreshDescText2();
    }

    refreshDescText2() {
        this.descText2.text = "当前电力资源:" + String(this.buildingScript.getCurSaveElec());
    }

    refreshSwitchState() {
        let switchState = this.buildingScript.getCurState();
        this.red.visible = (switchState == 0);
        this.green.visible = (switchState == 1);
        if (switchState == 0) {
            this.descText.text = "断电啦，请将导线接近电源以接通电源~";
        } else {
            this.descText.text = "电源已接通，发电厂可以正常运转啦~";
        }
    }

    refreshSwitchStatePos() {
        if (Math.abs(this.slider.x) <= 70) {
            if (this.directX < 0) {
                this.slider.x = 0;
            }
            this.buildingScript.setCurState(1);
        } else {
            this.buildingScript.setCurState(0);
        }
    }

    initSliderTouch() {
        this.root.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            // console.debug(e);
            this.touchDownPointX = Laya.stage.mouseX;
            this.refreshSwitchStatePos();
            this.refreshSwitchState();
        });

        this.root.on(Laya.Event.MOUSE_MOVE, this, function (e) {
            if (this.touchDownPointX) {
                let offX = Laya.stage.mouseX - this.touchDownPointX;
                this.slider.x += offX;
                this.directX = offX;
                this.touchDownPointX = Laya.stage.mouseX;
                this.refreshSwitchStatePos();
                this.refreshSwitchState();
            }
        });

        this.root.on(Laya.Event.MOUSE_OUT, this, function (e) {
            this.touchDownPointX = null;
        });

        this.root.on(Laya.Event.MOUSE_UP, this, function (e) {
            this.touchDownPointX = null;
        });
    }
    
}