export default class BuildingMeta {
}

BuildingMeta.BuildingType = {
    NullTyupe: 0,   //无类型
    HomeType: 1,    //居民的家
};

BuildingMeta.BuildingState = {
    NullState: 0,       //无状态
    Creating: 1,        //正在建造
    Noraml: 2,          //正常状态
};


// 尺寸
BuildingMeta.HomeWidth = 256;   //建筑宽度
BuildingMeta.HomeHeight = 256;   //建筑高度