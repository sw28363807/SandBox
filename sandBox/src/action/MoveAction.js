export default class MoveAction {
    // 创建移动动作
    static createAction(owner, dstX, dstY, handler) {
        let speed = 50;
        let distance = new Laya.Point(dstX, dstY).distance(owner.x, owner.y);
        let time = distance/speed;
        return Laya.Tween.to(owner, {x: dstX, y: dstY}, time*1000, null, handler);
    }
}