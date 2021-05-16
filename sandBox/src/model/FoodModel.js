import FoodMeta from "../meta/FoodMeta";

export default class FoodModel extends Laya.Script {

    constructor() { 
        super();
        this.food = FoodMeta.FoodBaseValue;
        this.foodId = 0;
        this.x;
        this.y;
        this.state = FoodMeta.FoodState.CanEat;
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
    getState() {
        return this.state;
    }

    // 获得食物
    getFood() {
        return this.food;
    }

    // 设置当前食物的状态
    setState(state) {
        this.state = state;
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
        }
    }
}