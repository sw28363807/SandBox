import GameContext from "../meta/GameContext";
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
            x: this.container.width/2 - 300, y: this.container.height/2, sex: 2, age: 29
        });

        // ResidentMgr.getInstance().createResidentByConfig({
        //     parent: this.container,
        //     x: this.container.width/2 - 200, y: this.container.height/2, sex: 1, age: 28
        // });

        // ResidentMgr.getInstance().createResidentByConfig({
        //     parent: this.container,
        //     x: this.container.width/2 - 200, y: this.container.height/2, sex: 1, age: 1
        // });
    }

    onDisable() {
    }
}