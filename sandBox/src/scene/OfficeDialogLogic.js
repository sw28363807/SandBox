import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import QuestionMeta from "../meta/QuestionMeta";
import ResourceMeta from "../meta/ResourceMeta";
export default class OfficeDialogLogic extends Laya.Script {

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
        this.closeBtn = this.owner.getChildByName("closeBtn");
        this.closeBtn.on(Laya.Event.CLICK, this, function () {
            Laya.Dialog.close(ResourceMeta.OfficeDialogScenePath);
        });
        this.initQuestion();
    }

    initQuestion() {
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
            this.answers[index].text = prefile +  data.option[index];
        }

        let answer = data.answer;
        let answerText = "正确答案: A";
        if (answer == 1) {
            answerText = "正确答案: B";
        } else if (answer == 2) {
            answerText = "正确答案: C";
        }
        this.rightText.text = answerText;
    }

    onClickAnswer(index) {

    }

}