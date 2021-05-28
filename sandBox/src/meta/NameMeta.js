export default class NameMeta {
    // 随机一个名字
    static randomOneName() {
        let nameFactor = Math.random();
        let idx1 = Math.floor(nameFactor * NameMeta.FirstName.length);
        let dex2 = Math.floor(nameFactor * NameMeta.LastName.length);
        return NameMeta.FirstName[idx1] + NameMeta.LastName[dex2];
    }
}

// 姓氏集合
NameMeta.FirstName = [
    "孙",
    "沈",
    "李",
    "王",
    "赵",
    "司马",
    "诸葛",
    "周",
];

// 名字集合
NameMeta.LastName = [
    "文",
    "建蕊",
    "二狗",
    "狗胜",
    "桂芬",
    "翠萍",
    "秀姑",
    "大壮",
    "Joel",
    "Season",
    "Jack",
    "大壮",
    "钢弹"

];

