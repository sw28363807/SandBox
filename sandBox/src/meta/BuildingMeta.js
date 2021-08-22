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
    SpeedBuildingType: "",    //健身房,
    ToolBuildingType: "",    //工具工坊,
    VilllageComType: "",       //采集课堂,
    BankType: "",               //银行,
    BloodBuildingType: "",      //养生堂
    OilType: "",      //炼油厂
    FactoryType: "",  //工厂
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
        realWidth: 350,
        realHeight: 350,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "家",
        costTree: 0,
        costStone: 0,
        desc: "居住的地方"
    },
    // 工厂
    [String(BuildingMeta.BuildingType.FactoryType)]: {
        prefab: ResourceMeta.FactoryPrefabPath,
        preview: "source/building/factory.png",
        realWidth: 500,
        realHeight: 500,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "工厂",
        costTree: 0,
        costStone: 0,
        desc: "可以制造各种工业产品的地方",
        addGoldPerResident: 1,
        maxResident: 10,
    },
    // 医院
    [String(BuildingMeta.BuildingType.HospitalType)]: {
        prefab: ResourceMeta.HospitalPrefabPath,
        preview: "source/building/hospital1_1.png",
        realWidth: 400,
        realHeight: 400,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "医院",
        costTree: 0,
        costStone: 0,
        desc: "可以治疗疾病",
        doctors: [
            {
                doctorId: 1,
                name: "王二狗大夫",
                desc: "医术一般般",
                healProbability: 50,
                sex: 1, //1 男 2 女,
                costGold: 1,
            },
            {
                doctorId: 2,
                name: "赵德柱大夫",
                desc: "医术还可以",
                healProbability: 90,
                sex: 2, //1 男 2 女,
                costGold: 2,
            },
        ]
    },
    // 学校
    [String(BuildingMeta.BuildingType.SchoolType)]: {
        prefab: ResourceMeta.SchoolPrefabPath,
        preview: "source/building/school_1.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "学校",
        costTree: 0,
        costStone: 0,
        addTeach: 20,
        desc: "可以增长教育，促进科技发展",
        teachers: [
            {
                teacherId: 1,
                name: "李翠萍老师",
                desc: "教学一般般",
                addTeach: 10,
                sex: 1, //1 男 2 女,
                costGold: 998,
            },
            {
                teacherId: 2,
                name: "北辰沈老师",
                desc: "教学一般般，人很漂亮，但是对于提升教育质量似乎没有什么用",
                addTeach: 10,
                sex: 2, //1 男 2 女
                costGold: 48,
            },
        ],
    },
    // 幼儿园
    [String(BuildingMeta.BuildingType.ChildSchoolType)]: {
        prefab: ResourceMeta.ChildSchoolPrefabPath,
        preview: "source/building/child_school.png",
        realWidth: 350,
        realHeight: 350,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "幼儿园",
        costTree: 0,
        costStone: 0,
        desc: "可以让孩子快速成长",
        teachers: [
            {
                teacherId: 1,
                name: "李翠萍老师",
                desc: "教学一般般",
                sex: 1, //1 男 2 女,
                costGold: 333,
                addAgePriority: 90,
            },
            {
                teacherId: 2,
                name: "北辰沈老师",
                desc: "教学一般般，人很漂亮，但是对于提升教育质量似乎没有什么用",
                sex: 2, //1 男 2 女
                costGold: 444,
                addAgePriority: 100,
            },
        ],
    },
    // 发电厂
    [String(BuildingMeta.BuildingType.PowerPlantType)]: {
        prefab: ResourceMeta.PowerPlantPrefabPath,
        preview: "source/building/power_plant.png",
        realWidth: 500,
        realHeight: 500,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "发电厂",
        costTree: 0,
        costStone: 0,
        addElec: 1,
        desc: "可以为其他建筑发电",
    },
    // 商店
    [String(BuildingMeta.BuildingType.ShopType)]: {
        prefab: ResourceMeta.ShopPrefabPath,
        preview: "source/building/shop_1.png",
        realWidth: 400,
        realHeight: 400,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "商店",
        costTree: 0,
        costStone: 0,
        desc: "可以购买神秘物品",
        items: [
            {
                itemId: 1,
                num: 1,
                img: "source/resident/zhuangshi2.png",
                name: "北辰大翅膀",
                desc: "可以轻松的飞越天津以及周边区县地区的高大上装饰。",
                costGold: 0,
                reviewOrder: 0,       //1 上层 0 下层
                reviewX: -120,
                reviewY: -200,
                scaleX: 1.2,
                scaleY: 1.2,
            }
        ],
    },
    // 农田
    [String(BuildingMeta.BuildingType.FarmLandType)]: {
        prefab: ResourceMeta.FarmLandPrefabPath,
        preview: "source/building/farmland.png",
        realWidth: 400,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "农田",
        costTree: 0,
        costStone: 0,
        maxSave: 3000,
        addFood: 100,
        desc: "可以种植增加食物，夏天秋天可以收获哦~",
    },
    // 牧场
    [String(BuildingMeta.BuildingType.PastureType)]: {
        prefab: ResourceMeta.PasturePrefabPath,
        preview: "source/building/pasture_big.png",
        realWidth: 500,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "牧场",
        costTree: 0,
        costStone: 0,
        maxSave: 3000,
        addFood: 100,
        desc: "可以养殖动物，春天冬天可以收获哦~",
    },
    // 歌剧院
    [String(BuildingMeta.BuildingType.OperaType)]: {
        prefab: ResourceMeta.OperaPrefabPath,
        preview: "source/building/center2.png",
        realWidth: 400,
        realHeight: 400,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "歌剧院",
        costTree: 0,
        costStone: 0,
        addEnjoy: 10,
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
        createPriority: 1,
        buildingName: "警察局",
        costTree: 0,
        costStone: 0,
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
        createPriority: 1,
        buildingName: "科学实验室",
        costTree: 0,
        costStone: 0,
        desc: "快速增长科技研究",
    },
    // 写字楼
    [String(BuildingMeta.BuildingType.OfficeType)]: {
        prefab: ResourceMeta.OfficePrefabPath,
        preview: "source/building/office.png",
        realWidth: 400,
        realHeight: 400,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "写字楼",
        costTree: 0,
        costStone: 0,
        addGold: 1,
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
        createPriority: 1,
        buildingName: "餐厅",
        costTree: 0,
        costStone: 0,
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
        createPriority: 1,
        buildingName: "宠物店",
        costTree: 0,
        costStone: 0,
        desc: "饲养宠物可以不减快乐值哦",
    },
    // 食物仓库
    [String(BuildingMeta.BuildingType.FoodPoolType)]: {
        prefab: ResourceMeta.FoodPoolPrefabPath,
        preview: "source/building/FoodPool.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "食物仓库",
        costTree: 0,
        costStone: 0,
        maxSave: 600,
        desc: "可以保存食物以便今后使用",
    },
    // 水仓库
    [String(BuildingMeta.BuildingType.WaterPoolType)]: {
        prefab: ResourceMeta.WaterPoolPrefabPath,
        preview: "source/building/WaterPool.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
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
        createPriority: 1,
        buildingName: "",
        costTree: 0,
        costStone: 0,
        heatingMaxTImes: 10,
        desc: "",
    },
    // 健身房
    [String(BuildingMeta.BuildingType.SpeedBuildingType)]: {
        prefab: ResourceMeta.SpeedBuildingPrefabPath,
        preview: "source/building/speedBuilding.png",
        realWidth: 250,
        realHeight: 250,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "健身房",
        costTree: 0,
        costStone: 0,
        desc: "可以健身增加居民移动速度",
    },
    // 工具工坊
    [String(BuildingMeta.BuildingType.ToolBuildingType)]: {
        prefab: ResourceMeta.ToolBuildingPrefabPath,
        preview: "source/building/ToolBuilding.png",
        realWidth: 250,
        realHeight: 250,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "工具工坊",
        costTree: 0,
        costStone: 0,
        desc: "可以升级工具加快资源收集速度",
    },
    // 农学堂
    [String(BuildingMeta.BuildingType.VilllageComType)]: {
        prefab: ResourceMeta.VillageComPrefabPath,
        preview: "source/building/villageCom.png",
        realWidth: 300,
        realHeight: 300,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "农学堂",
        costTree: 0,
        costStone: 0,
        desc: "可以增加采集食物水源速度",
    },
    // 银行
    [String(BuildingMeta.BuildingType.BankType)]: {
        prefab: ResourceMeta.BankPrefabPath,
        preview: "source/building/bank.png",
        realWidth: 350,
        realHeight: 350,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "银行",
        costTree: 0,
        costStone: 0,
        desc: "可以各种资源之间互相兑换",
    },
    // 养生堂
    [String(BuildingMeta.BuildingType.BloodBuildingType)]: {
        prefab: ResourceMeta.BloodBuildingPrefabPath,
        preview: "source/building/blood_building.png",
        realWidth: 350,
        realHeight: 350,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "养生堂",
        costTree: 0,
        costStone: 0,
        desc: "可以恢复少量生命值",
    },
    // 炼油厂
    [String(BuildingMeta.BuildingType.OilType)]: {
        prefab: ResourceMeta.OilPrefabPath,
        preview: "source/building/oil.png",
        realWidth: 500,
        realHeight: 500,
        createBuildingSpeed: 2000,
        useBuildingTime: 5000,
        createPriority: 1,
        buildingName: "炼油厂",
        costTree: 0,
        costStone: 0,
        desc: "可以提炼开采发展石油工业",
    },
};