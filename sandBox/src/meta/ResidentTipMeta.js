export default class ResidentTipMeta {
    
    // 随机一个无聊Tip
    static randomOneBoredTip() {
        let factor = Math.random();
        let idx = Math.floor(factor * ResidentTipMeta.BoredTips.length);
        return ResidentTipMeta.BoredTips[idx];
    }
}

ResidentTipMeta.BoredTipsProbability = 0.90;

// 小人无聊时说的话
ResidentTipMeta.BoredTips = [
    "不想努力了",
    "好开心",
    "我想吃软饭",
    "我想喝啤酒",
    "太无聊了",
    "快去谈恋爱",
    "光棍一个",
];