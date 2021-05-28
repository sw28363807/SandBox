import EventMgr from "../helper/EventMgr";
import RandomMgr from "../helper/RandomMgr";
import GameEvent from "../meta/GameEvent";
import NameMeta from "../meta/NameMeta";
import ResidentMeta from "../meta/ResidentMeta";

export default class ResidentModel extends Laya.Script {
    constructor() {
        super();
        // 面上的数值
        this.life = 100;    //生命
        this.water = 100;   //水源
        this.enjoy = 100;   //娱乐
        this.food = 100;    //食物
        this.teach = 0;     //教育
        this.health = 100;  //健康
        this.social = 100;  //社交

        // 隐藏数值
        this.positive = 0.7;               //积极性
        this.myHomeId = 0;              //我的家的ID
        this.loverId = 0;               //配偶ID

        this.temperature = 36;  //体温
        this.age = 1;       //年龄
        this.sex = 1;   // 性别 1 男 2 女
        this.married = 1; //1 未婚 2 已婚
        this.sick = 1;  //1 健康 2 生病
        this.residentName = NameMeta.randomOneName();


        this.x = 0;     //当前角色所处坐标x
        this.y = 0;     //当前角色所处坐标y
        this.residentId = 0;    //角色Id
        this.curFSMState = ResidentMeta.ResidentState.NullState;
    }

    updateData(data) {
        if (data) {
            if (data.life) {
                this.life = data.life;
            }
            if (data.water) {
                this.water = data.water;
            }
            if (data.enjoy) {
                this.enjoy = data.enjoy;
            }
            if (data.food) {
                this.food = data.food;
            }
            if (data.teach) {
                this.teach = data.teach;
            }
            if (data.health) {
                this.health = data.health;
            }
            if (data.social) {
                this.social = data.social;
            }
            if (data.myHomeId) {
                this.myHomeId = data.myHomeId;
            }
            if (data.temperature) {
                this.temperature = data.temperature;
            }
            if (data.age) {
                this.age = data.age;
            }
            if (data.sex) {
                this.sex = data.sex;
            }
            if (data.married) {
                this.married = data.married;
            }
            if (data.residentName) {
                this.residentName = data.residentName;
            }
            if (data.x) {
                this.x = data.x;
            }
            if (data.y) {
                this.y = data.y;
            }
            if (data.residentId) {
                this.residentId = data.residentId;
            }
            if (data.curFSMState) {
                this.curFSMState = data.curFSMState;
            }
            if (data.sick) {
                this.sick = data.sick;
            }
            if (data.positive) {
                this.positive = data.positive;
            }
        }
    }

    getSick() {
        return this.sick;
    }

    setSick(sick) {
        this.sick = sick;
    }

    setLoverId(id) {
        this.loverId = id;
    }

    getLoverId() {
        return this.loverId;
    }

    getResidentId() {
        return this.residentId;
    }

    getFSMState() {
        return this.curFSMState;
    }

    setFSMState(state) {
        this.curFSMState = state;
    }

    // 获得婚配
    getMarried() {
        return this.married;
    }

    // 设置结婚
    setMarried(married) {
        this.married = married;
    }

    // 获得年龄
    getAge() {
        return this.age;
    }

    setMyHomeId(buildingId) {
        this.myHomeId = buildingId;
    }

    getMyHomeId() {
        return this.myHomeId;
    }

    // 下降需求和上升满足
    onStep() {
        // if (this.curFSMState == ResidentMeta.ResidentState.) {

        // }
        this.addSocial(ResidentMeta.ResidentReduceSocialBaseValue);
        this.addWater(ResidentMeta.ResidentReduceWaterBaseValue);
        this.addFood(ResidentMeta.ResidentReduceFoodBaseValue);
        if (this.getSick() == 1) {
            if (Math.random() > ResidentMeta.ResidentSickProbability) {
                this.setSick(2);
                EventMgr.getInstance().postEvent(GameEvent.RESIDENT_SICK, this);
            }
        }

        if (this.getSick() == 2) {
            this.addLife(ResidentMeta.ResidentReduceLifeBaseValue);
            if (this.getLife() <= 0) {
                EventMgr.getInstance().postEvent(GameEvent.RESIDENT_DIE, this);
            }
        }
    }

    // 能够要求结婚（主动）
    canAskMarry() {
        if (this.getAge() >= ResidentMeta.ResidentMarryAge &&
            this.getSex() == 1 &&
            this.getMyHomeId() != 0 &&
            this.getFSMState() == ResidentMeta.ResidentState.IdleState) {
            return true;
        }
        return false;
    }

    // 能够结婚（被动）
    canMarry(manModel) {
        if (this.getAge() > ResidentMeta.ResidentMarryAge &&
            this.getFSMState() == ResidentMeta.ResidentState.IdleState &&
            this.getSex() == 2) {
            if (this.loverId == 0) {
                return true; 
            } else {
                if (manModel.getLoverId() == this.residentId) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    addSocial(delta) {
        this.setSocial(this.getSocial() + delta);
    }

    setSocial(num) {
        this.social = num;
        if (this.social < 0) {
            this.social = 0;
        } else if (this.social > 100) {
            this.social = 100;
        }
    }

    getTeach() {
        return this.teach;
    }

    addTeach(delta) {
        this.setTeach(this.getTeach() + delta);
    }

    setTeach(num) {
        this.teach = num;
        if (this.teach < 0) {
            this.teach = 0;
        } else if (this.teach > 100) {
            this.teach = 100;
        }
    }

    getSocial() {
        return this.social;
    }


    // 获得生命值
    getLife() {
        return this.life;
    }

    //增加生命值
    addLife(delta) {
        this.setLife(this.getLife() + delta);
    }

    //设置生命值
    setLife(num) {
        this.life = num;
        if (this.life < 0) {
            this.life = 0;
        } else if (this.life > 100) {
            this.life = 100;
        }
    }

    // 获得食物
    getFood() {
        return this.food;
    }

    addFood(delta) {
        this.setFood(this.getFood() + delta);
    }

    // 调整食物
    setFood(num) {
        this.food = num;
        if (this.food < 0) {
            this.food = 0;
        } else if (this.food > 100) {
            this.food = 100;
        }
    }

    // 增加水源
    addWater(delta) {
        this.setWater(this.getWater() + delta);
    }

    // 调整水源
    setWater(num) {
        this.water = num;
        if (this.water < 0) {
            this.water = 0;
        } else if (this.water > 100) {
            this.water = 100;
        }
    }

    // 获得积极性
    getPositive() {
        return this.positive;
    }

    // 获得水源
    getWater() {
        return this.water;
    }

    addWater(water) {
        this.setWater(this.getWater() + water);
    }

    // 获得性别
    getSex() {
        return this.sex;
    }

    // 获得坐标x
    getX() {
        return this.x;
    }

    // 获得坐标x
    getY() {
        return this.y;
    }
}