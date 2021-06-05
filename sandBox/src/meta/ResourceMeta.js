export default class ResourceMeta {

}

ResourceMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
ResourceMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
ResourceMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径
ResourceMeta.AnimalPrefabPath = "prefab/Animal.prefab";   //动物的prefab路径

ResourceMeta.BuildingAtlasPath = "res/atlas/source/building.atlas"; //建筑引用的图片
ResourceMeta.FoodAtlasPath = "res/atlas/source/food.atlas";         //食物所引用的图片
ResourceMeta.ResidentAtlasPath = "res/atlas/source/resident.atlas"; //居民所引用的图片

ResourceMeta.HomePrefabPath = "prefab/Home.prefab";       //家prefab路径
ResourceMeta.HospitalPrefabPath = "prefab/Hospital.prefab";       //医院prefab路径
ResourceMeta.SchoolPrefabPath = "prefab/School.prefab";       //学校prefab路径
ResourceMeta.ChildSchoolPrefabPath = "prefab/ChildSchool.prefab";       //幼儿园prefab路径
ResourceMeta.PowerPlantPrefabPath = "prefab/PowerPlant.prefab";       //发电厂prefab路径
ResourceMeta.ShopPrefabPath = "prefab/Shop.prefab";       //商店prefab路径
ResourceMeta.FarmLandPrefabPath = "prefab/FarmLand.prefab";       //农田prefab路径
ResourceMeta.PasturePrefabPath = "prefab/Pasture.prefab";       //牧场prefab路径
ResourceMeta.OperaPrefabPath = "prefab/Opera.prefab";       //歌剧院prefab路径
ResourceMeta.OfficePrefabPath = "prefab/Office.prefab";       //写字楼prefab路径
ResourceMeta.PoliceStationPrefabPath = "prefab/PoliceStation.prefab";    //警察局prefab路径
ResourceMeta.LabPrefabPath = "prefab/Lab.prefab";    //实验室prefab路径

// 图集map
ResourceMeta.ResourceMap = [
    {
        type: Laya.Loader.ATLAS,
        url: ResourceMeta.BuildingAtlasPath
    },
    {
        type: Laya.Loader.ATLAS,
        url: ResourceMeta.FoodAtlasPath
    },
    {
        type: Laya.Loader.ATLAS,
        url: ResourceMeta.ResidentAtlasPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.ResidentPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.FoodPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.ResdientDetailsPanelPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.AnimalPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.HomePrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.HospitalPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.HospitalPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.SchoolPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.ChildSchoolPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.PowerPlantPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.FarmLandPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.PasturePrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.OperaPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.OfficePrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.PoliceStationPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.LabPrefabPath
    },
];