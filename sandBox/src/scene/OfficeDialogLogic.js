import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import QuestionMeta from "../meta/QuestionMeta";
import ResourceMeta from "../meta/ResourceMeta";
import TipMgr from "../helper/TipMgr";
import GameModel from "../model/GameModel";
export default class OfficeDialogLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
        GameModel.getInstance().addGoldNum(Number(this.buildingScript.getCurSaveGold()));
    }

    onStart() {
        this.buildingScript = this.owner.selectedBuilding.buildingScript;
        this.buildingModel = this.buildingScript.getModel();
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.OfficeDialogScenePath);
        });
        this.changeBtn = this.owner.getChildByName("changeBtn");
        this.changeBtn.on(Laya.Event.CLICK, this, function () {
            this.roundStart = true;
            this.refreshQuestion();
        });
        this.scoreText = this.owner.getChildByName("scoreText");
        this.initQuestion();
    }

    initQuestion() {
        this.roundStart = true;
        this.answers = [];
        for (let index = 0; index < 3; index++) {
            let a = this.owner.getChildByName("a" + String(index));
            this.answers.push(a);
            a.on(Laya.Event.CLICK, this, function () {
                this.onClickAnswer(index);
            });
        }
        this.questionText = this.owner.getChildByName("question");
        this.rightText = this.owner.getChildByName("right");
        this.refreshQuestion();
        this.refreshScoreText();
    }

    refreshQuestion() {
        let randomIndex = RandomMgr.randomNumber(0, QuestionMeta.question.length - 1);
        let data = QuestionMeta.question[randomIndex];
        if (data == null || data == undefined) {
            return;
        }
        this.questionText.text = "问题: " + data.question;
        for (let index = 0; index < 3; index++) {
            let prefile = "A. ";
            if (index == 1) {
                prefile = "B. ";
            } else if (index == 2) {
                prefile = "C. ";
            }
            this.answers[index].text = prefile + data.option[index];
        }
        for (const key in this.answers) {
            let control = this.answers[key];
            control.color = "#ea8323";
            control.typeset();
        }
        this.answerIndex = data.answer;
        let answerText = "正确答案: A";
        if (this.answerIndex == 1) {
            answerText = "正确答案: B";
        } else if (this.answerIndex == 2) {
            answerText = "正确答案: C";
        }
        this.rightText.text = answerText;
        this.rightText.visible = false;
    }

    onClickAnswer(index) {
        if (this.roundStart == false) {
            TipMgr.getInstance().showTip("请换一道题~");
            return;
        }
        if (this.roundStart == true) {
            this.roundStart = false;
        }
        if (this.answerIndex == index) {
            this.answers[index].color = "#30bc15";
            this.buildingScript.addGoldToOffice(1);
        } else {
            this.answers[index].color = "#ea234a";
            this.buildingScript.addGoldToOffice(-1);
        }
        this.rightText.visible = true;
        this.answers[index].typeset();
        this.refreshScoreText();
    }

    refreshScoreText() {
        this.scoreText.text = "当前积分: " + String(this.buildingScript.getCurSaveGold());
    }

}