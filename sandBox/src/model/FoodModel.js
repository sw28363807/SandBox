import FoodMeta from "../meta/FoodMeta";

export default class FoodModel extends Laya.Script {

    constructor() { 
        super();
        this.food = 0;
        this.foodId = 0;
        this.x;
        this.y;
        this.foodType = FoodMeta.FoodTypes.NullType;
        this.state = FoodMeta.FoodState.CanEat;
        this.eatFinishTime = 0;
    }

    // 获取食物类型
    getFoodType() {
        return this.foodType;
    }

    // 设置食物类型
    setFoodType(foodType) {
        this.foodType = foodType;
    }

    // 获得食物ID
    getFoodId() {
        return this.foodId;
    }

    // 获得坐标x
    getX() {
        return this.x;
    }

    // 获得坐标x
    getY() {
        return this.y;
    }

    // 获得当前食物状态
    getFoodState() {
        return this.state;
    }

    // 获得食物
    getFood() {
        return this.food;
    }

    // 设置当前食物的状态
    setFoodState(state) {
        this.state = state;
    }

    // 获得吃东西的cd时间
    getEatCDTime() {
        return FoodMeta.FoodAddValue[this.foodType].deltayTime;
    }

    updateData(data) {
        if (data) {
            if (data.food) {
                this.food = data.food;
            }
            if (data.x) {
                this.x = data.x;
            }
            if (data.y) {
                this.y = data.y;
            }
            if (data.foodId) {
                this.foodId = data.foodId;
            }
            if (data.foodType) {
                this.foodType = data.foodType;
                this.food = FoodMeta.FoodAddValue[this.foodType].addValue;
            }
        }
    }
}