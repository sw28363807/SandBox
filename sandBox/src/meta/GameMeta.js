export default class GameMeta {
}

// 消息
GameMeta.ADD_FOOD_TO_MAP = "ADD_FOOD_TO_MAP";              //触发器通知生成食物

// 资源路径
GameMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
GameMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
GameMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径


// 层级
GameMeta.ResidentZOrder = 100;  //居民层级




// 人物图片资源路径
GameMeta.ResidentStateImagePath = {
    "normalState":"source/resident/residentNormal1.png",
    "walkState":"source/resident/residentWalk1.png"
};

// 食物图片资源
GameMeta.FoodImagePath = [
    {
        "normalState":"source/food/food1.png",
    }
];