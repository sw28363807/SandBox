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
    JoinHunt: 18,             //赶去打猎
    Hunting: 19,              //打猎
    Die: 20,                  //死亡
    GotoContinueCreateHospital: 21, //跑去建造医院
    CreateHospital: 22,     //建造医院
    GotoTreat: 23,          //跑去治疗
    Treating: 24,           //正在治疗
    GotoContinueCreateSchool: 25, //跑去建造学校
    CreateSchool: 26,     //建造学校
    GoToSchool: 27,         //去上学的路上
    Learning: 28,           //正在学习
    GotoContinueCreatePowerPlant: 29, //跑去建造发电厂
    CreatePowerPlant: 30,     //建造发电厂
    GotoContinueCreateShop: 31, //跑去建造商店
    CreateShop: 32,     //建造商店
    GotoContinueCreateFarmLand: 33, //跑去建造农田
    CreateFarmLand: 34,     //建造农田
    GotoContinueCreatePasture: 35, //跑去建造牧场
    CreatePasture: 36,     //建造牧场
    GotoContinueCreateOpera: 37, //跑去建造歌剧院
    CreateOpera: 38,     //建造歌剧院
    JoinFight: 39,         //加入打群架
    Fighting: 40,             //打架
    GotoContinueCreatePoliceStation: 41, //跑去建造警察局
    CreatePoliceStation: 42,     //建造警察局
    GotoContinueCreateLab: 43, //跑去建造科学实验室
    CreateLab: 44,     //建造科学实验室
    GotoContinueCreateOffice: 45, //跑去建造写字楼
    CreateOffice: 46,     //建造写字楼
    RandomWalk: 47,     //随机走一个位置
};

// 动画枚举
ResidentMeta.ResidentAnim = {
    Null: 0,    // 无动画
    Idle: 1,    //待机动画
    Walk: 2,    //行走动画
    Enjoy: 3,   //喜悦动画
    Work: 4,   //愤怒动画
    Die: 5,     //死亡动画
    Anger: 6,   //生气动画
};

// 砍树消耗单位时间
ResidentMeta.CutDownTreeTime = 10000;

// 收集石头的时间
ResidentMeta.CollectStoneTime = 10000;

// 人物移动速度
ResidentMeta.ResidentMoveSpeed = 90;

// 聊天的时间步长
ResidentMeta.SocialTimeStep = 1000;

// 打架的时间步长
ResidentMeta.SocialFightStep = 1000;

// 死亡需要的时间
ResidentMeta.DieTime = 2000;

// 属性掉落基础值
ResidentMeta.ResidentValueStep = 1000;  //人物数值消耗Step
ResidentMeta.ResidentMakeIdeaStep = 1000;  //人物做决策Step
ResidentMeta.ResidentReduceWaterBaseValue = -0.3; //水源减少值
ResidentMeta.ResidentReduceFoodBaseValue = -0.25;  //食物减少值
ResidentMeta.ResidentReduceSocialBaseValue = -0.4; //社交减少值
ResidentMeta.ResidentAddSocialBaseValue = 60; //一次社交增加值
ResidentMeta.ResidentReduceLifeBaseValue = -0.5; //生命减少值
ResidentMeta.ResidentReduceEnjoyBaseValue = -0.25; //娱乐减少值
ResidentMeta.ResidentSickProbability = 0.995; //生病的概率
ResidentMeta.ResidentTreatTime = 5000; //治疗的时间
ResidentMeta.ResidentLearnTime = 5000; //学习的时间
ResidentMeta.ResidentSocialLowToFight = 100;  //需要社交的警戒线，低于这个值就是要打架了
ResidentMeta.ResidentSocialNeedValue = 30;  //需要社交的警戒线，低于这个值就是需要社交了
ResidentMeta.ResidentWaterNeedValue = 20;  //需要喝水的警戒线，低于这个值就是需要喝水了
ResidentMeta.ResidentFoodNeedValue = 20;  //需要吃饭的警戒线，低于这个值就是需要吃饭了
ResidentMeta.ResidentEnjoyNeedValue = 30;  //需要娱乐的警戒线，低于这个值就是需要娱乐了
ResidentMeta.ResidentSocialArea = 2000;      //寻找可以社交的人的范围
ResidentMeta.ResidentFightArea = 1000;      //寻找可以打架的人的范围
ResidentMeta.ResidentAddTreeBaseValue = 1;  //人物砍树增加的数值
ResidentMeta.ResidentAddStoneBaseValue = 1;  //人物收集石头增加的数值
ResidentMeta.ResidentFindPathTimes = 5;      //人物寻路的次数
ResidentMeta.ResidentAdultAge = 15;         //成年的年纪
ResidentMeta.ResidentMarryAge = 0;         //结婚的法定年纪

