export default class ResidentIdleAction {
    // 创建待机动画
    static createAction(owner) {
        Laya.Tween.clearAll(owner);
        let time = 1000;
        let scaleBig = 1;
        let scaleSmall = 0.8;
        let func = function() {
            Laya.Tween.to(owner, {scaleY:scaleSmall}, time, null, Laya.Handler.create(owner, function() {
                Laya.Tween.to(owner, {scaleY:scaleBig}, time, null, Laya.Handler.create(owner, function() {
                
                }), 0, true, true);
            }), 0, true, true);
        };
        func();
        owner.timer.loop(2*time, this, function() {
            func();
        });
    }
}