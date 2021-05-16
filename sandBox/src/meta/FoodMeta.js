export default class FoodMeta {
}

FoodMeta.FoodMaxNumPerTrigger = 1;  //每个食物触发器的最大生成食物数量
FoodMeta.FoodTriggerArea = 50;      //食物出现的范围
FoodMeta.FoodUpdateTime = 5000;        //更新食物出现的时间
FoodMeta.FoodZOrder = 99;           //食物层级
FoodMeta.FoodBaseValue = 30;        //食物吃掉所要加的值

FoodMeta.FoodState = {
    CanEat: 1,      //能够吃
    Occupy: 2,      //被占据
    Eating: 3,      //正在被吃
    EatFinish: 4,   //被吃完 
};