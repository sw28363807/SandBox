export default class ResidentMeta {
}

//0-空状态 1-待机 2-搜索寻找盖房的地方 3-建造房子 4-寻找木材
ResidentMeta.ResidentState = {
    NullState: 0,       //无状态
    IdleState: 1,       //待机状态
    FindBlockForCreateHome: 2,  //搜索能盖房的地方
    CreateHome: 3,      //建造房屋
    FindTree: 4,         //搜索树木
    CutDownTree: 5,      //砍伐树木
    FindStone: 6,       //寻找石材
    CollectStone: 7,    //收集石头
    FindFood: 8,        //搜索食物
    EatFood: 9,         //吃饭饭
    FindWater: 10,      //寻找水源
    DrinkWater: 11,    //喝水,
    LoverMan: 12,        //恋人1(主动)
    LoverWoman: 13,        //恋人2(被动),
    LoverGoHomeMakeLove: 14, //恋人回家生孩子行进中
    LoverMakeLove: 15,       //生孩子
    JoinTalking: 16,          //加入聊天
    TalkingAbout: 17,         //聊天
};

// 动画枚举
ResidentMeta.ResidentAnim = {
    Null: 0,    // 无动画
    Idle: 1,    //待机动画
    Walk: 2,    //行走动画
    Enjoy: 3,   //喜悦动画
};

// 层级
ResidentMeta.ResidentZOrder = 100;  //居民层级

// 砍树消耗单位时间
ResidentMeta.CutDownTreeTimeStep = 1000;

// 收集石头的时间
ResidentMeta.CollectStoneTimeStep = 1000;

//吃东西消耗的时间步长
ResidentMeta.EatFoodTimeStep = 1000;

// 人物移动速度
ResidentMeta.ResidentMoveSpeed = 150;

// 聊天的时间步长
ResidentMeta.SocialTimeStep = 1000;

// 属性掉落基础值
ResidentMeta.ResidentValueStep = 2000;  //人物数值消耗Step
ResidentMeta.ResidentMakeIdeaStep = 1000;  //人物做决策Step
ResidentMeta.ResidentReduceWaterBaseValue = -3; //水源减少值
ResidentMeta.ResidentReduceFoodBaseValue = -4;  //食物减少值
ResidentMeta.ResidentReduceSocialBaseValue = -10; //社交减少值
ResidentMeta.ResidentSocialNeedValue = 50;  //需要社交的警戒线，低于这个值就是需要社交了
ResidentMeta.ResidentSocialArea = 300;      //寻找可以社交的人的范围
ResidentMeta.ResidentAddTreeBaseValue = 1;  //人物砍树增加的数值
ResidentMeta.ResidentAddStoneBaseValue = 1;  //人物收集石头增加的数值
ResidentMeta.ResidentFindPathTimes = 5;      //人物寻路的次数
ResidentMeta.ResidentAdultAge = 15;         //成年的年纪

