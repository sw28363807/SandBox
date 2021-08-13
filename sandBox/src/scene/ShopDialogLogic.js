import BuildingMeta from "../meta/BuildingMeta";
import ResourceMeta from "../meta/ResourceMeta";

export default class ShopDialogLogic extends Laya.Script {

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
            Laya.Dialog.close(ResourceMeta.ShopDialogScenePath);
        });
        this.itemIndex = 0;
        this.refreshIcon();
    }

    refreshIcon() {
        let index = this.itemIndex;
        let metas = BuildingMeta.BuildingDatas[BuildingMeta.BuildingType.ShopType];
        let meta = metas.items[index];
        let nameText = this.owner.getChildByName("nameText");
        nameText.text = meta.name;
        let icon = this.owner.getChildByName("icon");
        icon.loadImage(meta.img);
        let descText = this.owner.getChildByName("descText");
        descText.text = meta.desc;
        let costText = this.owner.getChildByName("costText");
        costText.text = String(meta.costGold);
        if (this.deco) {
            this.deco.destroy(true);
            this.deco = null;
        }
        let top = this.owner.getChildByName("top");
        let bottom = this.owner.getChildByName("bottom");
        this.deco = new Laya.Sprite();
        this.deco.loadImage(meta.img);
        this.deco.scaleX = meta.scaleX;
        this.deco.scaleY = meta.scaleY;
        if (meta.reviewOrder == 1) {
            top.addChild(this.deco);
        } else {
            bottom.addChild(this.deco);
        }
        this.deco.x = meta.reviewX;
        this.deco.y = meta.reviewY;

        let remainNumText = this.owner.getChildByName("remainNumText");
        let num = this.buildingScript.getCurSaveDecoNum(meta.itemId);
        remainNumText.text = String(num);
        
    }
}