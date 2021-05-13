export default class ResidentMeta {
}

//0-空状态 1-待机 2-搜索寻找盖房的地方 3-建造房子 4-寻找木材
ResidentMeta.ResidentState = {
    NullState: 0,       //无状态
    IdleState: 1,       //待机状态
    FindBlockForCreateHome: 2,  //搜索能盖房的地方
    CreateHome: 3,      //建造房屋
    FindTree: 4,         //搜索树木
    CutDownTree: 5      //砍伐树木     
};

// 动画枚举
ResidentMeta.ResidentAnim = {
    Null: 0,    // 无动画
    Idle: 1,    //待机动画
    Walk: 2,    //行走动画
    CreateBuilding: 3,  //建造动画
};

// 层级
ResidentMeta.ResidentZOrder = 100;  //居民层级

// 砍树消耗单位时间(秒)
ResidentMeta.CutDownTreeTimeStep = 1000;

// 人物移动速度
ResidentMeta.ResidentMoveSpeed = 150;