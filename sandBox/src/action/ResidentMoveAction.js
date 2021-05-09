export default class ResidentMoveAction {
    static createAction(owner) {
        Laya.Tween.clearAll(owner);
        let time = 200;
        let rotation = 10
        let func = function() {
            Laya.Tween.to(owner, {rotation:rotation}, time, null, Laya.Handler.create(owner, function() {
                Laya.Tween.to(owner, {rotation:-rotation}, time, null, Laya.Handler.create(owner, function() {
                
                }), 0, true, true);
            }), 0, true, true);
        };
        func();
        owner.timer.loop(2*time, owner, function() {
            func();
        });
    }
}