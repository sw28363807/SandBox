export default class TipLogic extends Laya.Script {

    constructor() {
        super();
    }

    onEnable() {
        let image = this.owner.getChildByName("image");
        this.textLabel = image.getChildByName("label");
        image.x = -image.width / 2;
    }

    onDisable() {
    }

    setString(str) {
        this.textLabel.text = str;
        this.owner.zOrder = 65535;
        this.owner.x = Laya.stage.width / 2;
        this.owner.y = Laya.stage.height / 2;
        Laya.Tween.to(this.owner, { y: this.owner.y - 70 }, 300, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
            Laya.timer.once(1000, this, function () {
                Laya.Tween.to(this.owner, { alpha: 0 }, 500, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
                    this.owner.destroy(true);
                }));
            });
        }));
    }
}