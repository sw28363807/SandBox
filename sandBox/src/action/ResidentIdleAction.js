export default class ResidentIdleAction {

    static createAction(owner) {
        let func = function() {
            Laya.Tween.to(owner, {scaleY:0.8}, 1000, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(owner, {scaleY:1}, 1000, null, Laya.Handler.create(this, function() {
                
                }), 0, true, true);
            }), 0, true, true);
        };
        func();
        Laya.timer.loop(2000, this, function() {
            func();
        });
    }
}