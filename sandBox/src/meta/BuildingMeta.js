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
    FarmLandType: "",   //农田
    PastureType: "",    //牧场
    OperaType: "",    //歌剧院
    LabType: "",            //科学实验室
    OfficeType: "",         //鞋子楼
    ChildSchoolType: "",        //幼儿园
    FoodPoolType: "",         //食物仓库
    WaterPoolType: "",         //水仓库
    FireType: "",              //火堆
    SpeedBuildingType: "",    //健身房,
    ToolBuildingType: "",    //工具工坊,
    VilllageComType: "",       //采集课堂,
    BloodBuildingType: "",      //养生堂
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
        costTree: 1,
        costStone: 1,
        maxSave: 1000,
        desc: "可以保存水源以便今后使用",
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
        costTree: 2,
        costStone: 2,
        maxSave: 600,
        desc: "可以保存食物以便今后使用",
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
        costTree: 3,
        costStone: 3,
        addGold: 1,
        maxSave: 10,
        desc: "居民收入来源",
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
        costTree: 4,
        costStone: 4,
        desc: "可以让孩子快速成长",
        teachers: [
            {
                teacherId: 1,
                name: "大嘚嘞老师",
                desc: "教学很一般",
                sex: 1, //1 男 2 女,
                costGold: 0,
                addAgePriority: 0.5,
            },
            {
                teacherId: 2,
                name: "北辰沈老师",
                desc: "教学一般般，人很漂亮，但是对于提升教育质量似乎没有什么用",
                sex: 2, //1 男 2 女
                costGold: 0,
                addAgePriority: 0.3,
            },
            {
                teacherId: 3,
                name: "李翠萍老师",
                desc: "教学还可以",
                sex: 1, //1 男 2 女,
                costGold: 0,
                addAgePriority: 0.1,
            },
        ],
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
        costTree: 5,
        costStone: 5,
        maxSave: 3000,
        addFood: 100,
        gameAddFood: 10,
        desc: "可以养殖动物，春天冬天可以收获哦~",
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
        costTree: 6,
        costStone: 6,
        desc: "可以增长教育，促进科技发展",
        teachers: [
            {
                teacherId: 1,
                name: "李翠萍老师",
                desc: "教学一般般",
                addTeach: 10,
                addTeachPriority: 0.5,
                sex: 1, //1 男 2 女,
                costGold: 0,
            },
            {
                teacherId: 2,
                name: "北辰沈老师",
                desc: "教学一般般，人很漂亮，但是对于提升教育质量似乎没有什么用",
                addTeach: 15,
                addTeachPriority: 0.2,
                sex: 2, //1 男 2 女
                costGold: 0,
            },
            {
                teacherId: 3,
                name: "大嘚嘞老师",
                desc: "教学一般般，人很漂亮，但是对于提升教育质量似乎也没有什么用",
                addTeach: 17,
                addTeachPriority: 0.1,
                sex: 2, //1 男 2 女
                costGold: 0,
            },
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
        costTree: 1,
        costStone: 1,
        maxSave: 3000,
        addFood: 100,
        gameAddFood: 10,
        desc: "可以种植增加食物，夏天秋天可以收获哦~",
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
        costTree: 30,
        costStone: 30,
        desc: "快速增长科技研究",
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
        costTree: 1,
        costStone: 2,
        addTouchEnjoy: 1,
        desc: "可以让居民快乐的地方",
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
        costTree: 2,
        costStone: 3,
        addSpeedScale: 1.5,
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
        costTree: 3,
        costStone: 3,
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
        costTree: 4,
        costStone: 4,
        desc: "可以增加采集食物水源速度",
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
        costTree: 3,
        costStone: 3,
        desc: "可以恢复少量生命值",
    },
};