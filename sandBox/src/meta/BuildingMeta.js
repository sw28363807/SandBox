import ResourceMeta from "./ResourceMeta";

export default class BuildingMeta {
}

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
};

BuildingMeta.BuildingState = {
    NullState: 0,       //无状态
    PreCreating: 1,     //等待建造
    Creating: 2,        //正在建造
    Noraml: 3,          //正常状态
};

//参数
// 家
BuildingMeta.HomeWidth = 256;   //家宽度
BuildingMeta.HomeHeight = 256;   //家高度
BuildingMeta.HomeCreatingStep = 100; //家建造时间间隔
BuildingMeta.HomeCreatingStepValue = 500; //家建造时间间隔

// 医院
BuildingMeta.HospitalWidth = 256;   //医院宽度
BuildingMeta.HospitalHeight = 256;   //医院高度
// 学校
BuildingMeta.SchoolWidth = 256;   //学校宽度
BuildingMeta.SchoolHeight = 256;   //学校高度

// 幼儿园
BuildingMeta.ChildSchoolWidth = 256;   //幼儿园宽度
BuildingMeta.ChildSchoolHeight = 256;   //幼儿园高度

// 发电厂
BuildingMeta.PowerPlantWidth = 256;   //发电厂宽度
BuildingMeta.PowerPlantHeight = 256;   //发电厂高度
// 商店
BuildingMeta.ShopWidth = 256;   //商店宽度
BuildingMeta.ShopHeight = 256;   //商店高度

// 农田
BuildingMeta.FarmLandWidth = 256;   //农田宽度
BuildingMeta.FarmLandHeight = 256;   //农田高度

// 牧场
BuildingMeta.PastureWidth = 256;   //牧场宽度
BuildingMeta.PastureHeight = 256;   //牧场高度

// 歌剧院
BuildingMeta.OperaWidth = 256;   //歌剧院宽度
BuildingMeta.OperaHeight = 256;   //歌剧院高度

// 写字楼
BuildingMeta.OfficeWidth = 256;   //写字楼宽度
BuildingMeta.OfficeHeight = 256;   //写字楼高度

// 警察局
BuildingMeta.PoliceStationWidth = 256;   //警察局宽度
BuildingMeta.PoliceStationHeight = 256;   //警察局高度

// 实验室
BuildingMeta.LabWidth = 256;   //实验室宽度
BuildingMeta.LabHeight = 256;   //实验室高度

// 盖房子需要的钱
BuildingMeta.CreateHomeNeedValues = {
    tree: 0,
    stone: 0,
};

// 操作界面的数据源
BuildingMeta.CommandPanelDataSource = {
    // 医院
    [String(BuildingMeta.BuildingType.HospitalType)]: {
        prefab: ResourceMeta.HospitalPrefabPath,
        type: BuildingMeta.BuildingType.HospitalType,
        preview: "source/building/hospital1_1.png",
        width: BuildingMeta.HospitalWidth,
        height: BuildingMeta.HospitalHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "医院",
    },
    // 学校
    [String(BuildingMeta.BuildingType.SchoolType)]: {
        prefab: ResourceMeta.SchoolPrefabPath,
        type: BuildingMeta.BuildingType.SchoolType,
        preview: "source/building/school_1.png",
        width: BuildingMeta.SchoolWidth,
        height: BuildingMeta.SchoolHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "学校",
    },
    // 幼儿园
    [String(BuildingMeta.BuildingType.ChildSchoolType)]: {
        prefab: ResourceMeta.ChildSchoolPrefabPath,
        type: BuildingMeta.BuildingType.ChildSchoolType,
        preview: "source/building/child_school.png",
        width: BuildingMeta.ChildSchoolWidth,
        height: BuildingMeta.ChildSchoolHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "幼儿园",
    },
    // 发电厂
    [String(BuildingMeta.BuildingType.PowerPlantType)]: {
        prefab: ResourceMeta.PowerPlantPrefabPath,
        type: BuildingMeta.BuildingType.PowerPlantType,
        preview: "source/building/power_plant.png",
        width: BuildingMeta.PowerPlantWidth,
        height: BuildingMeta.PowerPlantHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "发电厂",
    },
    // 商店
    [String(BuildingMeta.BuildingType.ShopType)]: {
        prefab: ResourceMeta.ShopPrefabPath,
        type: BuildingMeta.BuildingType.ShopType,
        preview: "source/building/shop_1.png",
        width: BuildingMeta.ShopWidth,
        height: BuildingMeta.ShopHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "商店",
    },
    // 农田
    [String(BuildingMeta.BuildingType.FarmLandType)]: {
        prefab: ResourceMeta.FarmLandPrefabPath,
        type: BuildingMeta.BuildingType.FarmLandType,
        preview: "source/building/farmland.png",
        width: BuildingMeta.FarmLandWidth,
        height: BuildingMeta.FarmLandHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "农田",
    },
    // 牧场
    [String(BuildingMeta.BuildingType.PastureType)]: {
        prefab: ResourceMeta.PasturePrefabPath,
        type: BuildingMeta.BuildingType.PastureType,
        preview: "source/building/pasture.png",
        width: BuildingMeta.PastureWidth,
        height: BuildingMeta.PastureHeight,
        realWidth: 128,
        realHeight: 128,
        adjustX: 64,
        adjustY: 128,
        buildingName: "牧场",
    },
    // 歌剧院
    [String(BuildingMeta.BuildingType.OperaType)]: {
        prefab: ResourceMeta.OperaPrefabPath,
        type: BuildingMeta.BuildingType.OperaType,
        preview: "source/building/center2.png",
        width: BuildingMeta.OperaWidth,
        height: BuildingMeta.OperaHeight,
        realWidth: 256,
        realHeight: 256,
        adjustX: 0,
        adjustY: 0,
        buildingName: "歌剧院",
    },
    // 警察局
    [String(BuildingMeta.BuildingType.PoliceStationType)]: {
        prefab: ResourceMeta.PoliceStationPrefabPath,
        type: BuildingMeta.BuildingType.PoliceStationType,
        preview: "source/building/police.png",
        width: BuildingMeta.PoliceStationWidth,
        height: BuildingMeta.PoliceStationHeight,
        realWidth: 256,
        realHeight: 256,
        adjustX: 64,
        adjustY: 128,
        buildingName: "警察局",
    },
    // 实验室
    [String(BuildingMeta.BuildingType.LabType)]: {
        prefab: ResourceMeta.LabPrefabPath,
        type: BuildingMeta.BuildingType.LabType,
        preview: "source/building/scienceLab.png",
        width: BuildingMeta.LabWidth,
        height: BuildingMeta.LabHeight,
        realWidth: 256,
        realHeight: 256,
        adjustX: 64,
        adjustY: 128,
        buildingName: "科学实验室",
    },
    // 写字楼
    [String(BuildingMeta.BuildingType.OfficeType)]: {
        prefab: ResourceMeta.OfficePrefabPath,
        type: BuildingMeta.BuildingType.OfficeType,
        preview: "source/building/office.png",
        width: BuildingMeta.OfficeWidth,
        height: BuildingMeta.OfficeHeight,
        realWidth: 256,
        realHeight: 256,
        adjustX: 0,
        adjustY: 0,
        buildingName: "写字楼",
    },
};