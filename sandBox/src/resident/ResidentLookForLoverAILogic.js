import BuildingMgr from "../building/BuildingMgr";
import RandomMgr from "../helper/RandomMgr";
import BuildingMeta from "../meta/BuildingMeta";
import GameContext from "../meta/GameContext";
import ResidentMeta from "../meta/ResidentMeta";
import GameModel from "../model/GameModel";

export default class ResidentLookForLoverAILogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
    }

    onDisable() {
    }

    onStart() {
        this.model = this.owner.residentLogicScript.getModel();
    }

    getModel() {
        return this.model;
    }

    processLookForLover(level1Results, level2Results) {
        if (RandomMgr.randomYes(0.2)) {
            if (this.getModel().canAskMarry()) {
                let home = BuildingMgr.getInstance().getBuildingById(this.getModel().getMyHomeId());
                if (home) {
                    let homeModel = home.buildingScript.getModel();
                    let curNum = GameModel.getInstance().getAllResidentNum();
                    let maxNum = GameModel.getInstance().getHomeNum() * ResidentMeta.ResidentNumPerHome;
                    if (homeModel.getBuildingState() == BuildingMeta.BuildingState.Noraml &&
                        curNum <= maxNum) {
                        let cell = {
                            func: Laya.Handler.create(this, function () {
                                let woman = this.owner.residentLogicScript.residentMgrInstance.getCanMarryWoman(this.getModel());
                                if (woman) {
                                    let womanScript = woman.residentLogicScript;
                                    let womanModel = womanScript.getModel();
                                    GameModel.getInstance().setMarried(this.getModel(), womanModel);
                                    this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.LoverMan);
                                    womanScript.refreshFSMState(ResidentMeta.ResidentState.LoverWoman);
                                    this.owner.AILogicScript.ideaResult = true;
                                }
                            })
                        };
                        level1Results.push(cell);
                    }
                }
            }
        }
    }

    // 和媳妇一起回家生孩子
    startGoHomeAndWoman() {
        let myHome = BuildingMgr.getInstance().getBuildingById(this.getModel().getMyHomeId());
        if (myHome) {
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani5");
            this.owner.residentLogicScript.walkTo({
                x: myHome.x + myHome.width / 2 - this.owner.width / 2,
                y: myHome.y + myHome.height - this.owner.height + ResidentMeta.ResidentGotoYOff,
                forceFirstY: true,
            }, Laya.Handler.create(this, function () {
                this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.LoverMakeLove);
            }));
        } else {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }


    startFindWoman() {
        let womanId = this.getModel().getLoverId();
        let woman = this.owner.residentLogicScript.residentMgrInstance.getResidentById(womanId);
        if (woman) {
            this.owner.residentLogicScript.setStateAniVisible(true);
            this.owner.residentLogicScript.setStateAni("ani5");
            this.owner.residentLogicScript.walkTo({
                x: woman.x + woman.width,
                y: woman.y,
            }, Laya.Handler.create(this, function () {
                this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.LoverGoHomeMakeLove);
                woman.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.LoverGoHomeMakeLove);
            }));
        } else {
            this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
        }
    }

    onWomanWaitMan() {
        this.owner.residentLogicScript.setAnim(ResidentMeta.ResidentAnim.Idle);
        this.owner.residentLogicScript.setStateAniVisible(true);
        this.owner.residentLogicScript.setStateAni("ani5");
    }

    // 开始生孩子
    startMakelove() {
        this.owner.residentLogicScript.setVisible(false);
        if (this.getModel().getSex() == 1) {
            let myHome = BuildingMgr.getInstance().getBuildingById(this.getModel().getMyHomeId());
            let homeScript = myHome.buildingScript;
            homeScript.startMakeLove(Laya.Handler.create(this, function () {
                let womanId = this.getModel().getLoverId();
                let woman = this.owner.residentLogicScript.residentMgrInstance.getResidentById(womanId);
                woman.y += ResidentMeta.ResidentGotoYOff;
                this.owner.y += ResidentMeta.ResidentGotoYOff;
                woman.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);
                this.owner.residentLogicScript.refreshFSMState(ResidentMeta.ResidentState.IdleState);

                this.owner.residentLogicScript.residentMgrInstance.createResidentByConfig({
                    parent: GameContext.mapContainer,
                    x: woman.x,
                    y: woman.y,
                    age: 1,
                    sex: GameModel.getInstance().randomSex(),
                    food: 70,
                    water: 70,
                });
            }));
        }
        this.getModel().recordMakeLoveSystemTime();
    }
}