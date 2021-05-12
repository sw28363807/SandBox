import GameMeta from "../meta/GameMeta";

export default class Treelogic extends Laya.Script {

    constructor() { 
        super();
        this.treeID = 0;
    }
    
    onEnable() {
        this.treeImage = this.owner.getChildByName("image");
    }

    onDisable() {
    }

    onStart() {
        this.treeImage.loadImage(GameMeta.TreeImageImagePath[0], Laya.Handler.create(this, function() {
        }));
    }

    setTreeID(id) {
        this.treeID = id;
    }


}