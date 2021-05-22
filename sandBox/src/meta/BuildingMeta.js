export default class BuildingMeta {
}


BuildingMeta.HomePrefabPath = "prefab/Home.prefab";       //家prefab路径
BuildingMeta.HospitalPrefabPath = "prefab/Hospital.prefab";       //医院prefab路径


BuildingMeta.BuildingType = {
    NullTyupe: 0,   //无类型
    HomeType: 1,    //居民的家
    HospitalType: 2,    //医院
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


// 操作界面的数据源
BuildingMeta.CommandPanelDataSource = {
    [String(BuildingMeta.BuildingType.HospitalType)]:{
        prefab:BuildingMeta.HospitalPrefabPath,
        type: BuildingMeta.BuildingType.HospitalType,
        preview: "source/building/hospital1_1.png",
        width: BuildingMeta.HospitalWidth,
        height: BuildingMeta.HospitalHeight,
        adjustX: 64,
        adjustY: 128,
    }
};