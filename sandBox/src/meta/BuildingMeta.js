import ResourceMeta from "./ResourceMeta";

export default class BuildingMeta {
    static obtainBuildingType() {
        for (const key in BuildingMeta.BuildingType) {
            BuildingMeta.BuildingType[key] = key;
        }
    }

    static obtainBuildingState() {
        for (const key in BuildingMeta.BuildingState) {
            BuildingMeta.BuildingState[key] = key;
        }
    }
}

BuildingMeta.BuildingType = {
    NullTyupe: "",   //无类型
    HomeType: "",    //居民的家
    HospitalType: "",    //医院
    SchoolType: "",      //学校
    PowerPlantType: "",  //发电厂
    ShopType: "",       //商店
    FarmLandType: "",   //农田
    PastureType: "",    //牧场
    OperaType: "",    //歌剧院
    PoliceStationType: "",   //警察局
    LabType: "",            //科学实验室
    OfficeType: "",         //鞋子楼
    ChildSchoolType: "",        //幼儿园
    RestaurantType: "",         //餐厅
    PetShopType: "",         //宠物店
    FoodPoolType: "",         //食物仓库
    WaterPoolType: "",         //水仓库
    FireType: "",              //火堆
};

BuildingMeta.obtainBuildingType();

BuildingMeta.BuildingState = {
    NullState: "",       //无状态
    PreCreating: "",     //等待建造
    Creating: "",        //正在建造
    Noraml: "",          //正常状态
    Occupy: "",          //占用状态
};

BuildingMeta.obtainBuildingState();


//参数
// 家
BuildingMeta.BuildingCreatingStep = 100; //建筑建造时间间隔
BuildingMeta.HomeResidentMaxNum = 3;    //每个家庭最多多少人

// 建筑数据
// isResidentContinueCreate 是否需要小人继续建造
BuildingMeta.BuildingDatas = {
    // 家
    [String(BuildingMeta.BuildingType.HomeType)]: {
        prefab: ResourceMeta.HomePrefabPath,
        preview: "",
        realWidth: 200,
        realHeight: 200,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "家",
        costTree: 0,
        costStone: 0,
        desc: "居住的地方",
    },
    // 医院
    [String(BuildingMeta.BuildingType.HospitalType)]: {
        prefab: ResourceMeta.HospitalPrefabPath,
        preview: "source/building/hospital1_1.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "医院",
        costTree: 0,
        costStone: 0,
        desc: "可以治疗疾病",
    },
    // 学校
    [String(BuildingMeta.BuildingType.SchoolType)]: {
        prefab: ResourceMeta.SchoolPrefabPath,
        preview: "source/building/school_1.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "学校",
        costTree: 6,
        costStone: 6,
        addTeach: 20,
        desc: "可以增长教育",
    },
    // 幼儿园
    [String(BuildingMeta.BuildingType.ChildSchoolType)]: {
        prefab: ResourceMeta.ChildSchoolPrefabPath,
        preview: "source/building/child_school.png",
        realWidth: 200,
        realHeight: 200,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "幼儿园",
        costTree: 0,
        costStone: 0,
        desc: "可以让孩子快速成长",
    },
    // 发电厂
    [String(BuildingMeta.BuildingType.PowerPlantType)]: {
        prefab: ResourceMeta.PowerPlantPrefabPath,
        preview: "source/building/power_plant.png",
        realWidth: 500,
        realHeight: 500,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "发电厂",
        costTree: 6,
        costStone: 6,
        desc: "可以为其他建筑发电",
    },
    // 商店
    [String(BuildingMeta.BuildingType.ShopType)]: {
        prefab: ResourceMeta.ShopPrefabPath,
        preview: "source/building/shop_1.png",
        realWidth: 200,
        realHeight: 200,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "商店",
        costTree: 6,
        costStone: 6,
        desc: "可以购买神秘物品",
    },
    // 农田
    [String(BuildingMeta.BuildingType.FarmLandType)]: {
        prefab: ResourceMeta.FarmLandPrefabPath,
        preview: "source/building/farmland.png",
        realWidth: 250,
        realHeight: 250,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "农田",
        costTree: 6,
        costStone: 6,
        desc: "可以种植增加食物",
    },
    // 牧场
    [String(BuildingMeta.BuildingType.PastureType)]: {
        prefab: ResourceMeta.PasturePrefabPath,
        preview: "source/building/pasture.png",
        realWidth: 128,
        realHeight: 128,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "牧场",
        costTree: 6,
        costStone: 6,
        desc: "可以饲养动物增加食物来源",
    },
    // 歌剧院
    [String(BuildingMeta.BuildingType.OperaType)]: {
        prefab: ResourceMeta.OperaPrefabPath,
        preview: "source/building/center2.png",
        realWidth: 500,
        realHeight: 500,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "歌剧院",
        costTree: 6,
        costStone: 6,
        desc: "可以让居民快乐的地方",
    },
    // 警察局
    [String(BuildingMeta.BuildingType.PoliceStationType)]: {
        prefab: ResourceMeta.PoliceStationPrefabPath,
        preview: "source/building/police.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "警察局",
        costTree: 6,
        costStone: 6,
        desc: "可以平息冲突",
    },
    // 实验室
    [String(BuildingMeta.BuildingType.LabType)]: {
        prefab: ResourceMeta.LabPrefabPath,
        preview: "source/building/scienceLab.png",
        realWidth: 500,
        realHeight: 500,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "科学实验室",
        costTree: 6,
        costStone: 6,
        desc: "快速增长科技研究",
    },
    // 写字楼
    [String(BuildingMeta.BuildingType.OfficeType)]: {
        prefab: ResourceMeta.OfficePrefabPath,
        preview: "source/building/office.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "写字楼",
        costTree: 6,
        costStone: 6,
        desc: "居民收入来源",
    },
    // 餐厅
    [String(BuildingMeta.BuildingType.RestaurantType)]: {
        prefab: ResourceMeta.RestaurantPrefabPath,
        preview: "source/building/restaurant.png",
        realWidth: 200,
        realHeight: 200,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "餐厅",
        costTree: 6,
        costStone: 6,
        desc: "可以囤积食物，增加食物增长值",
    },
    // 宠物店
    [String(BuildingMeta.BuildingType.PetShopType)]: {
        prefab: ResourceMeta.PetShopPrefabPath,
        preview: "source/building/pet_shop.png",
        realWidth: 200,
        realHeight: 200,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "宠物店",
        costTree: 0,
        costStone: 0,
        desc: "饲养宠物可以不减快乐值哦",
    },
    // 食物仓库
    [String(BuildingMeta.BuildingType.FoodPoolType)]: {
        prefab: ResourceMeta.FoodPoolPrefabPath,
        preview: "source/building/FoodPool.png",
        realWidth: 100,
        realHeight: 100,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "食物仓库",
        costTree: 0,
        costStone: 0,
        maxSave: 300,
        desc: "可以保存食物以便今后使用",
    },
    // 水仓库
    [String(BuildingMeta.BuildingType.WaterPoolType)]: {
        prefab: ResourceMeta.WaterPoolPrefabPath,
        preview: "source/building/WaterPool.png",
        realWidth: 100,
        realHeight: 100,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "水仓库",
        costTree: 0,
        costStone: 0,
        maxSave: 1000,
        desc: "可以保存水源以便今后使用",
    },
    // 火堆
    [String(BuildingMeta.BuildingType.FireType)]: {
        prefab: ResourceMeta.FirePrefabPath,
        preview: "",
        realWidth: 200,
        realHeight: 200,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 2,
        buildingName: "",
        costTree: 0,
        costStone: 0,
        desc: "",
    },
};