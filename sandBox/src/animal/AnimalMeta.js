export default class AnimalMeta {
};

AnimalMeta.AnimalMaxNumPerTrigger = 1;  //每个动物触发器的最大生动物物数量
AnimalMeta.AnimalTriggerArea = 50;      //动物出现的范围
AnimalMeta.AnimalUpdateTime = 30000;        //更新动物出现的时间
AnimalMeta.AnimalZOrder = 99;           //动物层级
AnimalMeta.AnimalMoveSpeed = 50;       //动物移动速度
AnimalMeta.AnimalLife = 100;            //动物的生命值
AnimalMeta.AnimalHurtTime = 10000;            //动物被打猎的时间



AnimalMeta.AnimalState = {
    NullState: 0,   //空状态
    Idle: 1,        //待机
    Hurt: 2,        //被攻击
    Walk: 3,        //移动
    Die: 4,         //死亡
};
