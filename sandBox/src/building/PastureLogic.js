import ResourceMeta from "../meta/ResourceMeta";
import BuildingBaseLogic from "./BuildingBaseLogic";
import MoveLogic from "../helper/MoveLogic";
import RandomMgr from "../helper/RandomMgr";

export default class PastureLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    // 建筑初始化
    onInitBuilding() {
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
        this.owner.zOrder = 2;
        for (let index = 0; index < 2; index++) {
            this.addAnimal(1);
        }
        for (let index = 0; index < 2; index++) {
            this.addAnimal(2);
        }
    }

    addAnimal(index) {
        let prefabDef = null
        if (index == 1) {
            prefabDef = Laya.loader.getRes(ResourceMeta.Livestock1PrefabPath);
        } else if (index == 2) {
            prefabDef = Laya.loader.getRes(ResourceMeta.Livestock2PrefabPath);
        }
        let animal = prefabDef.create();
        this.owner.addChild(animal);
        animal.moveScript = animal.getComponent(MoveLogic);
        animal.ani = animal.getChildByName("ani");

        let owner = animal;
        let leftFunc = function () {
            owner.ani.play(0, true, "walk_left");
        };
        let rightFunc = function () {
            owner.ani.play(0, true, "walk_right");
        };
        let upFunc = function () {
            owner.ani.play(0, true, "walk_up");
        };
        let downFunc = function () {
            owner.ani.play(0, true, "walk_down");
        };
        animal.moveScript.setCallbackFunc({
            leftFunc: leftFunc,
            rightFunc: rightFunc,
            upFunc: upFunc,
            downFunc: downFunc,
        });
        let centerX = this.owner.width/2;
        let centerY = this.owner.height/2;
        animal.x = centerX;
        animal.y = centerY;
        this.startWalk(animal);
    }

    startWalk(animal) {
        let dst = RandomMgr.randomPointInRect(0, 0, this.owner.width - animal.width, this.owner.height - animal.height);
        animal.moveScript.gotoDest({
            x: dst.x,
            y: dst.y,
            speed: 2,
        }, Laya.Handler.create(this, function () {
            this.startWalk(animal);
        }));
    }
}