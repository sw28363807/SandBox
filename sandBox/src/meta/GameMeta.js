export default class GameMeta {
}

// 资源路径
GameMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
GameMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
GameMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径
GameMeta.HomePrefabPath = "prefab/Home.prefab";       //家prefab路径

GameMeta.TreeImagePath = [
    "source/landscape/tree1.png",
    "source/landscape/tree2.png",
    "source/landscape/tree3.png",
    "source/landscape/tree4.png"
];

// 食物图片资源
GameMeta.FoodImagePath = [
    {
        "normalState":"source/food/food1.png",
    }
];

// 家图片资源
GameMeta.HomeImagePath = [
    {
        "homeImage":"source/building/building1_1.png"
    }
]

// 石头图片资源
GameMeta.StoneImagePath = [
    "source/landscape/stone1.png",
    "source/landscape/stone2.png",
    "source/landscape/stone3.png",
];

// 尺寸
GameMeta.HomeWidth = 256;   //建筑宽度
GameMeta.HomeHeight = 256;   //建筑高度
GameMeta.FoodMaxNumPerTrigger = 1;  //每个食物触发器的最大生成食物数量
GameMeta.FoodTriggerArea = 50;      //食物出现的范围
GameMeta.FoodUpdateTime = 0;        //更新食物出现的时间

