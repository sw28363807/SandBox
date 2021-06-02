export default class FoodMeta {
}

FoodMeta.FoodMaxNumPerTrigger = 2;  //每个食物触发器的最大生成食物数量
FoodMeta.FoodUpdateTime = 20000;        //更新食物出现的时间
FoodMeta.FoodZOrder = 99;           //食物层级
FoodMeta.DrinkWaterTime = 5000;     //喝水时间

// 食物类型
FoodMeta.FoodTypes = {
    NullType: 0,    //没有类型
    FruitType: 1,   //水果
    MeatType: 2,    //肉类
};

// 食物吃完以后的增加值
FoodMeta.FoodAddValue = {
    [FoodMeta.FoodTypes.FruitType]: {
        deltayTime: 5000,       //吃食物所用的时间
        addValue: 30,           //吃食物所增加的值
    },
}

FoodMeta.FoodState = {
    CanEat: 1,      //能够吃
    Occupy: 2,      //被占据
    Eating: 3,      //正在被吃
    EatFinish: 4,   //被吃完 
};