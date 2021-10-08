import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";

export default class PowerPlantDialogLogic extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();

        this.yesBtn = this.owner.getChildByName("yesBtn");
        this.yesBtn.on(Laya.Event.CLICK, this, function () {

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

        this.switchState = 0; //0 断开状态 1 连通状态
        this.refreshSwitchState();
        this.initSliderTouch();
    }

    refreshSwitchState() {
        this.red.visible = (this.switchState == 0);
        this.green.visible = (this.switchState == 1);
        if (this.switchState == 0) {
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
            this.switchState = 1;
        } else {
            this.switchState = 0;
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