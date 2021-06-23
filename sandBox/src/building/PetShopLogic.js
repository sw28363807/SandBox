import BuildingBaseLogic from "./BuildingBaseLogic";
export default class PetShopLogic extends BuildingBaseLogic {

    constructor() {
        super();
    }

    onEnable() {
        super.onEnable();
        this.petList = [1, 2, 3];
    }

    obtainPetList() {
        let petListString = this.getModel().getExteraData("petList");
        if (petListString == undefined || petListString == null) {
            petListString = "";
        }
        if (petListString != "") {
            let strArray = petListString.split(",");
            for (const key in strArray) {
                this.petList.push(Number(strArray[key]));
            }
        }
    }

    getFirstPetInPetList() {
        if (this.petList.length != 0) {
            let first = this.petList[0];
            // this.petList.splice(0, 1);
            // this.getModel().setExteraData("petList", this.petList.toString());
            return first;
        }
        return null;
    }

    popFirstPet() {
        let first = this.getFirstPetInPetList();
        if (first) {
            this.petList.splice(0, 1);
            this.getModel().setExteraData("petList", this.petList.toString());
            return first
        }
        return null;
    }

    // 建筑初始化
    onInitBuilding() {
        this.obtainPetList();
    }

    // 建筑建造完成
    onCreateBuildingFinish() {
    }
}