import ResourceMeta from "./ResourceMeta";

export default class BuildingMeta {
}

// 是否需要小人建造的set列表
// BuildingMeta.ContinueCreateBuildingSet = new Set([]);

BuildingMeta.BuildingCreateStateColor = {
    enabled: "#5ddb36",
    disabled: "#ffffff",
};

BuildingMeta.BuildingType = {
    NullTyupe: 0,   //无类型
    HomeType: 1,    //居民的家
    HospitalType: 2,    //医院
    SchoolType: 3,      //学校
    PowerPlantType: 4,  //发电厂
    ShopType: 5,       //商店
    FarmLandType: 6,   //农田
    PastureType: 7,    //牧场
    OperaType: 8,    //歌剧院
    PoliceStationType: 9,   //警察局
    LabType: 10,            //科学实验室
    OfficeType: 11,         //鞋子楼
    ChildSchoolType: 12,        //幼儿园
    RestaurantType: 13,         //餐厅
};

BuildingMeta.BuildingState = {
    NullState: 0,       //无状态
    PreCreating: 1,     //等待建造
    Creating: 2,        //正在建造
    Noraml: 3,          //正常状态
};

//参数
// 家
BuildingMeta.HomeCreatingStep = 100; //家建造时间间隔
BuildingMeta.HomeCreatingStepValue = 2000; //家建造时间间隔
BuildingMeta.HomeResidentMaxNum = 3;    //每个家庭最多多少人

// 盖房子需要的钱
BuildingMeta.CreateHomeNeedValues = {
    tree: 6,
    stone: 6,
};

// 建筑数据
// isResidentContinueCreate 是否需要小人继续建造
BuildingMeta.BuildingDatas = {
    // 家
    [String(BuildingMeta.BuildingType.HomeType)]: {
        prefab: ResourceMeta.HomePrefabPath,
        preview: "source/building/building1_1.png",
        realWidth: 200,
        realHeight: 200,
        buildingName: "家"
    },
    // 医院
    [String(BuildingMeta.BuildingType.HospitalType)]: {
        prefab: ResourceMeta.HospitalPrefabPath,
        preview: "source/building/hospital1_1.png",
        realWidth: 200,
        realHeight: 200,
        buildingName: "医院",
    },
    // 学校
    [String(BuildingMeta.BuildingType.SchoolType)]: {
        prefab: ResourceMeta.SchoolPrefabPath,
        preview: "source/building/school_1.png",
        realWidth: 300,
        realHeight: 300,
        buildingName: "学校",
    },
    // 幼儿园
    [String(BuildingMeta.BuildingType.ChildSchoolType)]: {
        prefab: ResourceMeta.ChildSchoolPrefabPath,
        preview: "source/building/child_school.png",
        realWidth: 128,
        realHeight: 128,
        buildingName: "幼儿园",
    },
    // 发电厂
    [String(BuildingMeta.BuildingType.PowerPlantType)]: {
        prefab: ResourceMeta.PowerPlantPrefabPath,
        preview: "source/building/power_plant.png",
        realWidth: 128,
        realHeight: 128,
        buildingName: "发电厂",
    },
    // 商店
    [String(BuildingMeta.BuildingType.ShopType)]: {
        prefab: ResourceMeta.ShopPrefabPath,
        preview: "source/building/shop_1.png",
        realWidth: 128,
        realHeight: 128,
        buildingName: "商店",
    },
    // 农田
    [String(BuildingMeta.BuildingType.FarmLandType)]: {
        prefab: ResourceMeta.FarmLandPrefabPath,
        preview: "source/building/farmland.png",
        realWidth: 128,
        realHeight: 128,
        buildingName: "农田",
    },
    // 牧场
    [String(BuildingMeta.BuildingType.PastureType)]: {
        prefab: ResourceMeta.PasturePrefabPath,
        preview: "source/building/pasture.png",
        realWidth: 128,
        realHeight: 128,
        buildingName: "牧场",
    },
    // 歌剧院
    [String(BuildingMeta.BuildingType.OperaType)]: {
        prefab: ResourceMeta.OperaPrefabPath,
        preview: "source/building/center2.png",
        realWidth: 256,
        realHeight: 256,
        buildingName: "歌剧院",
    },
    // 警察局
    [String(BuildingMeta.BuildingType.PoliceStationType)]: {
        prefab: ResourceMeta.PoliceStationPrefabPath,
        preview: "source/building/police.png",
        realWidth: 256,
        realHeight: 256,
        buildingName: "警察局",
    },
    // 实验室
    [String(BuildingMeta.BuildingType.LabType)]: {
        prefab: ResourceMeta.LabPrefabPath,
        preview: "source/building/scienceLab.png",
        realWidth: 256,
        realHeight: 256,
        buildingName: "科学实验室",
    },
    // 写字楼
    [String(BuildingMeta.BuildingType.OfficeType)]: {
        prefab: ResourceMeta.OfficePrefabPath,
        preview: "source/building/office.png",
        realWidth: 256,
        realHeight: 256,
        buildingName: "写字楼",
    },
    // 餐厅
    [String(BuildingMeta.BuildingType.RestaurantType)]: {
        prefab: ResourceMeta.RestaurantPrefabPath,
        preview: "source/building/restaurant.png",
        realWidth: 200,
        realHeight: 200,
        buildingName: "餐厅",
    },
};