export default class ResidentIdleAction {

    static createAction(owner) {
        let time = 1000;
        let scaleBig = 1;
        let scaleSmall = 0.8;
        let func = function() {
            Laya.Tween.to(owner, {scaleY:scaleSmall}, time, null, Laya.Handler.create(this, function() {
                Laya.Tween.to(owner, {scaleY:scaleBig}, time, null, Laya.Handler.create(this, function() {
                
                }), 0, true, true);
            }), 0, true, true);
        };
        func();
        owner.timer.loop(2*time, this, function() {
            func();
        });
    }
}