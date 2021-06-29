import BuildingMeta from "./BuildingMeta";

export default class ResidentMeta {
    static obtainResidentState() {
        for (const key in ResidentMeta.ResidentState) {
            ResidentMeta.ResidentState[key] = key;
        }
    }
}

//0-空状态 1-待机 2-搜索寻找盖房的地方 3-建造房子 4-寻找木材
ResidentMeta.ResidentState = {
    NullState: "",       //无状态
    IdleState: "",       //待机状态
    FindBlockForCreateHome: "",  //搜索能盖房的地方
    GotoContinueCreateHome: "",  //继续建造家
    CreateHome: "",      //建造房屋
    FindBlockForCreateFire: "",  //搜索能建造火堆的地方
    GotoContinueCreateFire: "",  //继续建造火堆
    CreateFire: "",      //建造火堆
    FindTree: "",         //搜索树木
    CutDownTree: "",      //砍伐树木
    FindStone: "",       //寻找石材
    CollectStone: "",    //收集石头
    FindFood: "",        //搜索食物
    EatFood: "",         //吃饭饭
    FindWater: "",      //寻找水源
    DrinkWater: "",    //喝水,
    LoverMan: "",        //恋人1(主动)
    LoverWoman: "",        //恋人2(被动),
    LoverGoHomeMakeLove: "", //恋人回家生孩子行进中
    LoverMakeLove: "",       //生孩子
    JoinTalking: "",          //加入聊天
    TalkingAbout: "",         //聊天
    JoinHunt: "",             //赶去打猎
    Hunting: "",              //打猎
    Die: "",                  //死亡
    GotoContinueCreateHospital: "", //跑去建造医院
    CreateHospital: "",     //建造医院
    GotoTreat: "",          //跑去治疗
    Treating: "",           //正在治疗
    GotoContinueCreateSchool: "", //跑去建造学校
    CreateSchool: "",     //建造学校
    GoToSchool: "",         //去上学的路上
    Learning: "",           //正在学习
    GotoContinueCreatePowerPlant: "", //跑去建造发电厂
    CreatePowerPlant: "",     //建造发电厂
    GotoContinueCreateShop: "", //跑去建造商店
    CreateShop: "",     //建造商店
    GotoContinueCreateFarmLand: "", //跑去建造农田
    CreateFarmLand: "",     //建造农田
    GotoContinueCreatePasture: "", //跑去建造牧场
    CreatePasture: "",     //建造牧场
    GotoContinueCreateOpera: "", //跑去建造歌剧院
    CreateOpera: "",     //建造歌剧院
    JoinFight: "",         //加入打群架
    Fighting: "",             //打架
    GotoContinueCreatePoliceStation: "", //跑去建造警察局
    CreatePoliceStation: "",     //建造警察局
    GotoContinueCreateLab: "", //跑去建造科学实验室
    CreateLab: "",     //建造科学实验室
    GotoContinueCreateOffice: "", //跑去建造写字楼
    CreateOffice: "",     //建造写字楼
    RandomWalk: "",     //随机走一个位置
    GotoContinueCreateChildSchool: "", //跑去建造幼儿园
    CreateChildSchool: "",     //建造幼儿园
    GotoChildSchoolForLearn: "",     //赶去幼儿园学习
    ChildLearn: "",                 //去幼儿园学习
    GotoContinueCreatePetShop: "", //跑去建造宠物店
    CreatePetShop: "",     //建造宠物店
    GotoContinueCreateFoodPool: "", //跑去建造食物仓库
    CreateFoodPool: "",     //建造食物仓库
    GotoContinueCreateWaterPool: "", //跑去建造水仓库
    CreateWaterPool: "",     //建造食物水仓库
    FindFoodForSend: "",     //寻找可以运送的食物
    CollectFood: "",        //收集食物
    SendFoodToFoodPool: "",  //运送食物去食物库
    FindWaterForSend: "",     //寻找可以运送的水源
    CollectWater: "",        //收集水源
    SendWaterToWaterPool: "",  //运送食物去水源库
    GotoFoodPoolForEat: "",     //赶去食物仓库
    EatFoodInFoodPool: "",      //去食物仓库吃饭
    GotoWaterPoolForDrink: "",     //赶去水库
    DrinkWaterInWaterPool: "",      //去水仓库喝水
    GotoPetShopForTakeOutPet: "",     //赶去宠物店去领取宠物
    TakeOutPet: "",                  //领取宠物
    GotoFireForHeating: "",     //赶去火堆取暖
    Heating: "",                  //取暖
};
ResidentMeta.obtainResidentState();

// 小人去搜索可以建造的地方
// 建造搜索----------------------------------------------------start
ResidentMeta.ResidentFindCreateBuildingBlockAIMap = {
    [ResidentMeta.ResidentState.FindBlockForCreateHome]: {
        buildingType: BuildingMeta.BuildingType.HomeType,
        nextState: ResidentMeta.ResidentState.GotoContinueCreateHome,
    },
    [ResidentMeta.ResidentState.FindBlockForCreateFire]: {
        buildingType: BuildingMeta.BuildingType.FireType,
        nextState: ResidentMeta.ResidentState.GotoContinueCreateFire,
    },

};
// 建造搜索----------------------------------------------------end


// 小人可以自动建造的列表(建造行为)
// 建造----------------------------------------------------start
ResidentMeta.ResidentContinueCreateMap = {
    [ResidentMeta.ResidentState.GotoContinueCreateHome]: ResidentMeta.ResidentState.CreateHome,
    [ResidentMeta.ResidentState.GotoContinueCreateFire]: ResidentMeta.ResidentState.CreateFire,
    [ResidentMeta.ResidentState.GotoContinueCreateHospital]: ResidentMeta.ResidentState.CreateHospital,
    [ResidentMeta.ResidentState.GotoContinueCreateSchool]: ResidentMeta.ResidentState.CreateSchool,
    [ResidentMeta.ResidentState.GotoContinueCreatePowerPlant]: ResidentMeta.ResidentState.CreatePowerPlant,
    [ResidentMeta.ResidentState.GotoContinueCreateShop]: ResidentMeta.ResidentState.CreateShop,
    [ResidentMeta.ResidentState.GotoContinueCreateFarmLand]: ResidentMeta.ResidentState.CreateFarmLand,
    [ResidentMeta.ResidentState.GotoContinueCreatePasture]: ResidentMeta.ResidentState.CreatePasture,
    [ResidentMeta.ResidentState.GotoContinueCreateOpera]: ResidentMeta.ResidentState.CreateOpera,
    [ResidentMeta.ResidentState.GotoContinueCreatePoliceStation]: ResidentMeta.ResidentState.CreatePoliceStation,
    [ResidentMeta.ResidentState.GotoContinueCreateLab]: ResidentMeta.ResidentState.CreateLab,
    [ResidentMeta.ResidentState.GotoContinueCreateOffice]: ResidentMeta.ResidentState.CreateOffice,
    [ResidentMeta.ResidentState.GotoContinueCreateChildSchool]: ResidentMeta.ResidentState.CreateChildSchool,
    [ResidentMeta.ResidentState.GotoContinueCreatePetShop]: ResidentMeta.ResidentState.CreatePetShop,
    [ResidentMeta.ResidentState.GotoContinueCreateFoodPool]: ResidentMeta.ResidentState.CreateFoodPool,
    [ResidentMeta.ResidentState.GotoContinueCreateWaterPool]: ResidentMeta.ResidentState.CreateWaterPool,
};

// 小人去建造的AI列表
ResidentMeta.ResidentCreateBuildingAIMap = {
    [BuildingMeta.BuildingType.HospitalType]: ResidentMeta.ResidentState.GotoContinueCreateHospital,
    [BuildingMeta.BuildingType.SchoolType]: ResidentMeta.ResidentState.GotoContinueCreateSchool,
    [BuildingMeta.BuildingType.PowerPlantType]: ResidentMeta.ResidentState.GotoContinueCreatePowerPlant,
    [BuildingMeta.BuildingType.ShopType]: ResidentMeta.ResidentState.GotoContinueCreateShop,
    [BuildingMeta.BuildingType.FarmLandType]: ResidentMeta.ResidentState.GotoContinueCreateFarmLand,
    [BuildingMeta.BuildingType.PastureType]: ResidentMeta.ResidentState.GotoContinueCreatePasture,
    [BuildingMeta.BuildingType.OperaType]: ResidentMeta.ResidentState.GotoContinueCreateOpera,
    [BuildingMeta.BuildingType.PoliceStationType]: ResidentMeta.ResidentState.GotoContinueCreatePoliceStation,
    [BuildingMeta.BuildingType.LabType]: ResidentMeta.ResidentState.GotoContinueCreateLab,
    [BuildingMeta.BuildingType.OfficeType]: ResidentMeta.ResidentState.GotoContinueCreateOffice,
    [BuildingMeta.BuildingType.ChildSchoolType]: ResidentMeta.ResidentState.GotoContinueCreateChildSchool,
    [BuildingMeta.BuildingType.PetShopType]: ResidentMeta.ResidentState.GotoContinueCreatePetShop,
    [BuildingMeta.BuildingType.FoodPoolType]: ResidentMeta.ResidentState.GotoContinueCreateFoodPool,
    [BuildingMeta.BuildingType.WaterPoolType]: ResidentMeta.ResidentState.GotoContinueCreateWaterPool,
};
// 建造----------------------------------------------------end


// 小人的建筑的使用行为
// 使用----------------------------------------------------start
ResidentMeta.ResidentUseBuildingMap = {
    [ResidentMeta.ResidentState.GotoTreat]: {
        nextState: ResidentMeta.ResidentState.Treating,
        buildingType: BuildingMeta.BuildingType.HospitalType,
        useType: 1,     //1 隐藏使用 2 周围使用 默认为1
    },
    [ResidentMeta.ResidentState.GoToSchool]: {
        nextState: ResidentMeta.ResidentState.Learning,
        buildingType: BuildingMeta.BuildingType.SchoolType,
        useType: 1,     //1 隐藏使用 2 周围使用 默认为1
    },
    [ResidentMeta.ResidentState.GoToSGotoChildSchoolForLearnchool]: {
        nextState: ResidentMeta.ResidentState.ChildLearn,
        buildingType: BuildingMeta.BuildingType.ChildSchoolType,
        useType: 1,     //1 隐藏使用 2 周围使用 默认为1
    },
    [ResidentMeta.ResidentState.GotoFoodPoolForEat]: {
        nextState: ResidentMeta.ResidentState.EatFoodInFoodPool,
        buildingType: BuildingMeta.BuildingType.FoodPoolType,
        useType: 1,     //1 隐藏使用 2 周围使用 默认为1
    },
    [ResidentMeta.ResidentState.GotoWaterPoolForDrink]: {
        nextState: ResidentMeta.ResidentState.DrinkWaterInWaterPool,
        buildingType: BuildingMeta.BuildingType.WaterPoolType,
        useType: 1,     //1 隐藏使用 2 周围使用 默认为1
    },
    [ResidentMeta.ResidentState.GotoPetShopForTakeOutPet]: {
        nextState: ResidentMeta.ResidentState.TakeOutPet,
        buildingType: BuildingMeta.BuildingType.PetShopType,
        useType: 1,     //1 隐藏使用 2 周围使用 默认为1
    },
    [ResidentMeta.ResidentState.GotoFireForHeating]: {
        nextState: ResidentMeta.ResidentState.Heating,
        buildingType: BuildingMeta.BuildingType.FireType,
        useType: 2,     //1 隐藏使用 2 周围使用 默认为1
    },
}
// 使用----------------------------------------------------end

// 小人去运送的AI列表
// 运送----------------------------------------------------start
ResidentMeta.ResidentSendAIMap = {
    [ResidentMeta.ResidentState.FindFoodForSend]: {
        collectState: ResidentMeta.ResidentState.CollectFood,
        lastState: ResidentMeta.ResidentState.SendFoodToFoodPool,
        buildingType: BuildingMeta.BuildingType.FoodPoolType,
    },
    [ResidentMeta.ResidentState.FindWaterForSend]: {
        collectState: ResidentMeta.ResidentState.CollectWater,
        lastState: ResidentMeta.ResidentState.SendWaterToWaterPool,
        buildingType: BuildingMeta.BuildingType.WaterPoolType,
    }
}
// 运送----------------------------------------------------end



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
ResidentMeta.ResidentMoveSpeed = 4;

// 聊天的时间步长
ResidentMeta.SocialTimeStep = 1000;

// 打架的时间步长
ResidentMeta.SocialFightStep = 1000;

// 死亡需要的时间
ResidentMeta.DieTime = 2000;

// 生孩子需要的间隔
ResidentMeta.MakeLoveMaxDeltay = 10 * 1000;

// 每个房子的人数
ResidentMeta.ResidentNumPerHome = 3;

// 属性掉落基础值
ResidentMeta.ResidentValueStep = 1000;  //人物数值消耗Step
ResidentMeta.ResidentMakeIdeaStep = 1000;  //人物做决策Step
ResidentMeta.ResidentReduceWaterBaseValue = -0.3; //水源减少值
ResidentMeta.ResidentReduceFoodBaseValue = -0.25;  //食物减少值
ResidentMeta.ResidentReduceSocialBaseValue = -0.4; //社交减少值
ResidentMeta.ResidentAddSocialBaseValue = 60; //一次社交增加值
ResidentMeta.ResidentReduceLifeBaseValue = -0.5; //生命减少值
ResidentMeta.ResidentReduceEnjoyBaseValue = -0.25; //娱乐减少值
ResidentMeta.ResidentSickProbability = 0.999; //生病的概率
ResidentMeta.ResidentTreatTime = 10000; //治疗的时间
ResidentMeta.ResidentLearnTime = 5000; //学习的时间
ResidentMeta.ResidentLearnTimeForChildLearn = 10000; //幼儿园学习的时间
ResidentMeta.ResidentSocialLowToFight = 20;  //需要社交的警戒线，低于这个值就是要打架了
ResidentMeta.ResidentSocialNeedValue = 50;  //需要社交的警戒线，低于这个值就是需要社交了
ResidentMeta.ResidentWaterNeedValue = 20;  //需要喝水的警戒线，低于这个值就是需要喝水了
ResidentMeta.ResidentFoodNeedValue = 20;  //需要吃饭的警戒线，低于这个值就是需要吃饭了
ResidentMeta.ResidentEnjoyNeedValue = 30;  //需要娱乐的警戒线，低于这个值就是需要娱乐了
ResidentMeta.ResidentSocialArea = 2000;      //寻找可以社交的人的范围
ResidentMeta.ResidentFightArea = 500;      //寻找可以打架的人的范围
ResidentMeta.ResidentFightNum = 10;         //打架的人数要求，少于这个值不能触发打架
ResidentMeta.ResidentAddTreeBaseValue = 1;  //人物砍树增加的数值
ResidentMeta.ResidentAddStoneBaseValue = 1;  //人物收集石头增加的数值
ResidentMeta.ResidentFindPathTimes = 5;      //人物寻路的次数
ResidentMeta.ResidentAdultAge = 5;         //成年的年纪
ResidentMeta.ResidentMarryAge = ResidentMeta.ResidentAdultAge + 2;         //结婚的法定年纪
ResidentMeta.ResidentAgePeriod = 500 * 100;         //年龄的增长周期
ResidentMeta.ResidentGotoYOff = 10;         //走向某个建筑物的y轴off
ResidentMeta.ResidentChildSchoolSearchArea = 1000;         //寻找幼儿园的搜索范围
ResidentMeta.ResidentCollectSendTime = 2000;         //打包寄送物品的时间
ResidentMeta.ResidentDrinkWaterAddValue = 50;         //喝水增加值
ResidentMeta.ResidentSaveWaterAddValue = 100;         //储藏水的增加值
ResidentMeta.ResidentStandardTemperature = 36;         //体温标准值
ResidentMeta.ResidentDangerTemperature = 34;         //体温危险值
ResidentMeta.ResidentReduceTemperatureValue = 1;      //体温减少值
ResidentMeta.ResidentReduceTemperatureTickStep = 50;      //体温减少步长