export default class ResourceMeta {

}

ResourceMeta.SoundPiano1Path = "source/sound/1.mp3";
ResourceMeta.SoundPiano2Path = "source/sound/2.mp3";
ResourceMeta.SoundPiano3Path = "source/sound/3.mp3";
ResourceMeta.SoundPiano4Path = "source/sound/4.mp3";
ResourceMeta.SoundPiano5Path = "source/sound/5.mp3";
ResourceMeta.SoundPiano6Path = "source/sound/6.mp3";
ResourceMeta.SoundPiano7Path = "source/sound/7.mp3";

ResourceMeta.ManAniPath = "anim/Man.ani";    //男人动画
ResourceMeta.WomanAniPath = "anim/Woman.ani";    //女人动画

ResourceMeta.ShopDialogScenePath = "scene/ShopDialog.scene";
ResourceMeta.SchoolDialogScenePath = "scene/SchoolDialog.scene";
ResourceMeta.ChildSchoolDialogScenePath = "scene/ChildSchoolDialog.scene";
ResourceMeta.PowerPlantDialogScenePath = "scene/PowerPlantDialog.scene";
ResourceMeta.HospitalDialogScenePath = "scene/HospitalDialog.scene";
ResourceMeta.FactoryDialogScenePath = "scene/FactoryDialog.scene";
ResourceMeta.OperaDialogScenePath = "scene/OperaDialog.scene";

ResourceMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
ResourceMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
ResourceMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径
ResourceMeta.AnimalPrefabPath = "prefab/Animal.prefab";   //动物的prefab路径
ResourceMeta.PetPrefabPath = "prefab/Pet.prefab";   //宠物的prefab路径
ResourceMeta.Livestock1PrefabPath = "prefab/Livestock1.prefab";   //家畜1的prefab路径
ResourceMeta.Livestock2PrefabPath = "prefab/Livestock2.prefab";   //家畜2的prefab路径
ResourceMeta.Livestock3PrefabPath = "prefab/Livestock3.prefab";   //家畜3的prefab路径
ResourceMeta.DragRenderPrefabPath = "prefab/DragRender.prefab";   //拖拽物
ResourceMeta.TipPrefabPath = "prefab/Tip.prefab";   //Tips路径
ResourceMeta.CommonItemPrefabPath = "prefab/CommonItem.prefab";   //菜单选项

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
ResourceMeta.RestaurantPrefabPath = "prefab/Restaurant.prefab";       //餐厅prefab路径
ResourceMeta.PoliceStationPrefabPath = "prefab/PoliceStation.prefab";    //警察局prefab路径
ResourceMeta.LabPrefabPath = "prefab/Lab.prefab";    //实验室prefab路径
ResourceMeta.PetShopPrefabPath = "prefab/PetShop.prefab";    //宠物店prefab路径
ResourceMeta.FoodPoolPrefabPath = "prefab/FoodPool.prefab";    //食物仓库prefab路径
ResourceMeta.WaterPoolPrefabPath = "prefab/WaterPool.prefab";    //水仓库prefab路径
ResourceMeta.FirePrefabPath = "prefab/Fire.prefab";    //火堆prefab路径
ResourceMeta.SpeedBuildingPrefabPath = "prefab/SpeedBuilding.prefab";    //健身房prefab路径
ResourceMeta.ToolBuildingPrefabPath = "prefab/ToolBuilding.prefab";    //工具工坊prefab路径
ResourceMeta.VillageComPrefabPath = "prefab/VillageCom.prefab";    //采集课堂prefab路径
ResourceMeta.BankPrefabPath = "prefab/Bank.prefab";    //银行prefab路径
ResourceMeta.BloodBuildingPrefabPath = "prefab/BloodBuilding.prefab";    //养生堂prefab路径
ResourceMeta.OilPrefabPath = "prefab/Oil.prefab";    //炼油厂prefab路径
ResourceMeta.FactoryPrefabPath = "prefab/Factory.prefab";    //工厂prefab路径

// 图集map
ResourceMeta.ResourceMap = [
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano1Path
    },
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano2Path
    },
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano3Path
    },
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano4Path
    },
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano5Path
    },
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano6Path
    },
    {
        type: Laya.Loader.SOUND,
        url: ResourceMeta.SoundPiano7Path
    },
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
        url: ResourceMeta.DragRenderPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.TipPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.CommonItemPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.AnimalPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.PetPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.Livestock1PrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.Livestock2PrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.Livestock3PrefabPath
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
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.PetShopPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.RestaurantPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.ShopPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.FoodPoolPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.WaterPoolPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.FirePrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.SpeedBuildingPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.ToolBuildingPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.VillageComPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.BankPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.BloodBuildingPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.OilPrefabPath
    },
    {
        type: Laya.Loader.PREFAB,
        url: ResourceMeta.FactoryPrefabPath
    },
];