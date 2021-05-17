import ResidentMgr from "../resident/ResidentMgr";

export default class TestSceneLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        this.ScrollView = this.owner.getChildByName("ScrollView");
        this.container = this.ScrollView.getChildByName("container");
        ResidentMgr.getInstance().createResidentByConfig({
            parent: this.container,
            x: 100, y: 200, sex: 2, age: 29
        }, Laya.Handler.create(this, function (obj) {
        }));

        ResidentMgr.getInstance().createResidentByConfig({
            parent: this.container,
            x: 200, y: 260, sex: 1, age: 28
        }, Laya.Handler.create(this, function (obj) {
        }));
    }

    onDisable() {
    }
}