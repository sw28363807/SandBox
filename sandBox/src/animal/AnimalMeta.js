export default class AnimalMeta {
};

AnimalMeta.AnimalMaxNumPerTrigger = 1;  //每个动物触发器的最大生动物物数量
AnimalMeta.AnimalTriggerArea = 50;      //动物出现的范围
AnimalMeta.AnimalUpdateTime = 5000;        //更新动物出现的时间
AnimalMeta.AnimalZOrder = 99;           //动物层级
AnimalMeta.AnimalMoveSpeed = 100;       //动物移动速度
AnimalMeta.AnimalLife = 100;            //动物的生命值



AnimalMeta.AnimalState = {
    NullState: 0,   //空状态
    Idle: 1,        //待机
    Walk: 2,        //移动
    Die: 3,         //死亡
};
