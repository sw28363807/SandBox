import GameMeta from "../meta/GameMeta";
import ResidentDetailsPanel from "./ResidentDetailsPanel";

export default class ResidentDetailsPanelMgr extends Laya.Script {

    constructor() { 
        super();
        this.curPanel = null;
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        let ret = ResidentDetailsPanelMgr.instance = ResidentDetailsPanelMgr.instance || new ResidentDetailsPanelMgr();
        return ret
    }

    // 显示界面
    showPanel(config) {
        this.removePanel();
        Laya.loader.create(GameMeta.ResdientDetailsPanelPath, Laya.Handler.create(this, function (prefabDef) {
            this.curPanel = prefabDef.create();
            this.curPanel.x = 50;
            this.curPanel.y = -120;
            config.parent.addChild(this.curPanel);
            let script = this.curPanel.getComponent(ResidentDetailsPanel);
            script.refreshInfo(config);
            this.curPanel.alpha = 0;
            Laya.Tween.to(this.curPanel, {alpha: 1}, 200);
            Laya.timer.once(3000, this, this.fadeOutFunc);
        }));
    }

    fadeOutFunc() {
        Laya.Tween.to(this.curPanel, {alpha: 0}, 200, null, Laya.Handler.create(this, function () {
            this.removePanel();
        }));
    }

    removePanel() {
        if (this.curPanel) {
            Laya.timer.clear(this, this.fadeOutFunc);
            this.curPanel.removeSelf();
            this.curPanel.destroy();
            this.curPanel = null;
        }
    }
}