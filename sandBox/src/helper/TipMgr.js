import ResourceMeta from "../meta/ResourceMeta";
import TipLogic from "./TipLogic";

export default class TipMgr extends Laya.Script {

    constructor() { 
        super();
    }
    
    onEnable() {
    }

    onDisable() {
    }

    static getInstance() {
        return TipMgr.instance = TipMgr.instance || new TipMgr();
    }

    // 显示tip
    showTip(str, type) {
        let prefabDef = Laya.loader.getRes(ResourceMeta.TipPrefabPath);
        let tip = prefabDef.create();
        Laya.stage.addChild(tip);
        let script = tip.getComponent(TipLogic);
        script.setString(str);
    }
}