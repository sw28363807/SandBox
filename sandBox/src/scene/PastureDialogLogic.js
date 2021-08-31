import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";

export default class PastureDialogLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
        Laya.timer.clear(this, this.onTriggerBug);
        Laya.timer.clear(this, this.refreshRemainTimeText);
    }

    onStart() {
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.PastureDialogScenePath);
        });
        this.initMiniGame();
    }

    initMiniGame() {
        this.score = 0;
        this.remainTime = 25;
        this.dongs = {};
        this.dongSprs = {};
        this.scoreText = this.owner.getChildByName("scoreText");
        this.remainTimeText = this.owner.getChildByName("remainTimeText");
        for (let index = 0; index < 3; index++) {
            let key = String(index + 1);
            this.dongs[key] = this.owner.getChildByName("dong" + key);
        }
        Laya.timer.loop(1000, this, this.refreshRemainTimeText);
        Laya.timer.loop(100, this, this.onTriggerBug);
        this.refreshScoreText();
        this.refreshRemainTimeText();
    }


    refreshRemainTimeText() {
        this.remainTime -= 1;
        if (this.remainTime < 0) {
            this.remainTime = 0;
        }
        if (this.remainTime == 0) {
            this.remainTimeText.text = "已结束";
        } else {
            this.remainTimeText.text = "剩余:"+String(this.remainTime);
        }
    }

    onTriggerBug() {
        if (RandomMgr.randomYes(0.8)) {
            let index = RandomMgr.randomNumber(1, 3);
            let spr = this.dongSprs[String(index)];
            if (spr == null || spr == undefined) {
                let sprIndex = RandomMgr.randomNumber(1, 3);
                let bug = new Laya.Sprite();
                bug.loadImage("source/ui/bug" + String(sprIndex) + ".png");
                this.dongSprs[String(index)] = bug;
                let parentNode = this.dongs[String(index)];
                parentNode.addChild(bug);
                bug.y = parentNode.height;
                bug.state = 0;
                bug.destHeight = parentNode.height;
                bug.on(Laya.Event.MOUSE_DOWN, this, function () {
                    bug.destroy(true);
                    delete this.dongSprs[String(index)];
                    this.score++;
                    this.refreshScoreText();
                });
            }
        }
    }


    refreshScoreText() {
        this.scoreText.text = "积分: " + String(this.score);
    }

    onUpdate() {
        let toDeletes = [];
        for (const key in this.dongSprs) {
            let bug = this.dongSprs[key];
            if (bug) {
                if (bug.state == 2) {
                    if (bug.y < bug.destHeight) {
                        bug.y += 40;
                    }
                    if (bug.y >= bug.destHeight) {
                        bug.destroy(true);
                        toDeletes.push(key);
                    }
                } else if (bug.state == 1) {
                    if (bug.tickTime == undefined ||
                        bug.tickTime == null) {
                        bug.tickTime = 0;
                    }
                    if (bug.tickTime >= 10) {
                        bug.state = 2;
                        continue;
                    }
                    bug.tickTime += 1;
                } else if (bug.state == 0) {
                    bug.y -= 30;
                    if (bug.y < 0) {
                        bug.y = 0;
                        bug.state = 1;
                        bug.tickTime = 0;
                    }
                }
            }
        }
        for (const key in toDeletes) {
            let deleteKey = toDeletes[key];
            delete this.dongSprs[deleteKey];
        }
    }

}