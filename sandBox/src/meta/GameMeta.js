export default class GameMeta {
}

// 消息
GameMeta.ADD_FOOD_TO_MAP = "ADD_FOOD_TO_MAP";              //触发器通知生成食物

// 资源路径
GameMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
GameMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
GameMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径
GameMeta.HomePrefabPath = "prefab/Home.prefab";       //家prefab路径

// 人物图片资源路径
GameMeta.ResidentStateImagePath = {
    "normalState":"source/resident/residentNormal1.png",
    "walkState":"source/resident/residentWalk1.png",
    "createBuildingState":"source/resident/residentNormal2.png"
};

GameMeta.TreeImageImagePath = [
    "source/tree/tree1.png",
    "source/tree/tree2.png",
    "source/tree/tree3.png",
    "source/tree/tree4.png"
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

// 层级
GameMeta.ResidentZOrder = 100;  //居民层级


// 尺寸
GameMeta.HomeWidth = 256;   //建筑宽度
GameMeta.HomeHeight = 256;   //建筑高度
