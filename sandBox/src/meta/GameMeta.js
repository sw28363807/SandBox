import BuildingMeta from "./BuildingMeta";

export default class GameMeta {
}

// 资源路径
GameMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
GameMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
GameMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径
GameMeta.AnimalPrefabPath = "prefab/Animal.prefab";   //动物的prefab路径
GameMeta.BuildingAtlasPath = "res/atlas/source/building.atlas"; //建筑引用的图片
GameMeta.FoodAtlasPath = "res/atlas/source/food.atlas";         //食物所引用的图片


GameMeta.MapSideOff = 0;
GameMeta.GameTimeStep = 1000;
GameMeta.Seasons = [
    "#c8eea0",  // 春
    "#8ef325",  // 夏
    "#e2f324",  // 秋
    "#e7e8d4",  // 冬
];




