import ResourceMeta from "../meta/ResourceMeta";

export default class ResourceMgr extends Laya.Script {

    constructor() {
        super();
        this.loadIndex = 0;
        this.prefabs = {};
    }

    static getInstance() {
        return ResourceMgr.instance = ResourceMgr.instance || new ResourceMgr();
    }

    loadAllRes(handler) {
        this.loadIndex = 0;
        this._loadRes(handler);
    }

    _loadRes(finishHandler) {
        if (this.loadIndex >= ResourceMeta.ResourceMap.length) {
            if (finishHandler) {
                finishHandler.run();
                return;
            }
        }
        let cell = ResourceMeta.ResourceMap[this.loadIndex];
        Laya.loader.create(cell.url, Laya.Handler.create(this, function (data) {
            if (cell.type == Laya.Loader.PREFAB) {
                this.prefabs[cell.url] = data;
            }
            this.loadIndex++;
            this._loadRes(finishHandler);
        }));
    }

    getPrefabInfo(prefabUrl) {
        return this.prefabs[prefabUrl];
    }

}