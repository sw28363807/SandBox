import EventMgr from "../helper/EventMgr";
import TimeUtils from "../helper/TimeUtils";
import GameEvent from "../meta/GameEvent";
import NameMeta from "../meta/NameMeta";
import ResidentMeta from "../meta/ResidentMeta";

export default class ResidentModel extends Laya.Script {
    constructor() {
        super();
        // 面上的数值
        this.life = 100;    //生命
        this.water = 100;   //水源
        this.enjoy = 100;   //快乐
        this.food = 100;    //食物
        this.teach = 0;     //教育
        this.social = 100;  //社交

        // 隐藏数值
        this.positive = 0.6;            //积极性
        this.myHomeId = 0;              //我的家的ID
        this.isInChildSchool = false;   //当前是不是处在幼儿园中
        this.ageExp = 0;
        this.makeLoveSystemTime = 0;    //生孩子间隔时间
        this.petType = 0;               //宠物ID
        this.speedScale = 1;


        this.temperature = ResidentMeta.ResidentStandardTemperature;  //体温
        this.temperatureTick = 0;
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
            if (data.ageExp) {
                this.ageExp = data.ageExp;
            }
            if (data.petType) {
                this.petType = data.petType;
            }
            if (data.speedScale) {
                this.speedScale = data.speedScale;
            }
        }
    }

    setSpeedScale(scale) {
        this.speedScale = scale;
    }

    getSpeedScale() {
        return this.speedScale;
    }

    addTemperature(num) {
        this.setTemperature(this.getTemperature() + num);
    }

    getTemperature() {
        return this.temperature;
    }

    setTemperature(temperature) {
        this.temperature = temperature;
        if (this.temperature < 30) {
            this.temperature = 30;
        }
    }

    setPetType(petType) {
        this.petType = petType;
    }

    getPetType() {
        return this.petType;
    }

    recordMakeLoveSystemTime() {
        if (this.makeLoveSystemTime == 0) {
            this.makeLoveSystemTime = TimeUtils.getSystemTime();
        }
    }

    getMakeLoveSystemTime() {
        return this.makeLoveSystemTime;
    }

    addAgeExp(num, isSendEvent) {
        this.setAgeExp(this.getAgeExp() + num);
        if (this.ageExp >= ResidentMeta.ResidentAgePeriod) {
            let lastAge = this.age;
            let remainExp = this.ageExp % ResidentMeta.ResidentAgePeriod;
            this.addAge(Math.floor(this.ageExp / ResidentMeta.ResidentAgePeriod));
            this.ageExp = remainExp;
            if (lastAge < ResidentMeta.ResidentAdultAge &&
                this.age >= ResidentMeta.ResidentAdultAge) {
                if (isSendEvent) {
                    EventMgr.getInstance().postEvent(GameEvent.RESIDENT_GROWUP, this);
                }
                return true;
            }
        }
        return false;
    }

    setAgeExp(num) {
        this.ageExp = num;
    }

    getAgeExp() {
        return this.ageExp;
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


    // 设置年龄
    setAge(num) {
        this.age = num;
    }
    // 获得年龄
    getAge() {
        return this.age;
    }

    // 增加年龄
    addAge(num) {
        this.setAge(this.getAge() + num);
    }

    setMyHomeId(buildingId) {
        this.myHomeId = buildingId;
    }

    getMyHomeId() {
        return this.myHomeId;
    }

    // 下降需求和上升满足
    onStep(config) {
        if (TimeUtils.getSystemTime() >= this.getMakeLoveSystemTime() + ResidentMeta.MakeLoveMaxDeltay) {
            this.makeLoveSystemTime = 0;
        }
        if (config.gameSeason == 3) {
            this.temperatureTick++;
            if (this.temperatureTick > ResidentMeta.ResidentReduceTemperatureTickStep) {
                this.addTemperature(-ResidentMeta.ResidentReduceTemperatureValue);
                this.temperatureTick = 0;
            }
        } else {
            this.temperatureTick = 0;
            this.setTemperature(ResidentMeta.ResidentStandardTemperature);
        }
        this.addAgeExp(ResidentMeta.ResidentMakeIdeaStep, true);
        if (this.getLife() <= 0 && this.getFSMState() == ResidentMeta.ResidentState.IdleState) {
            EventMgr.getInstance().postEvent(GameEvent.RESIDENT_DIE, this);
            return;
        }
        this.addEnjoy(ResidentMeta.ResidentReduceEnjoyBaseValue);
        this.addSocial(ResidentMeta.ResidentReduceSocialBaseValue);
        this.addWater(ResidentMeta.ResidentReduceWaterBaseValue);
        this.addFood(ResidentMeta.ResidentReduceFoodBaseValue);
        if (this.getSick() == 1) {
            if (Math.random() > ResidentMeta.ResidentSickProbability) {
                this.setSick(2);
                EventMgr.getInstance().postEvent(GameEvent.RESIDENT_SICK, this);
            }
        }
        // 处在饥饿状态和缺水减少生命值
        if (this.food <= 0 ||
            this.water <= 0 ||
            this.getSick() == 2 ||
            this.temperature < ResidentMeta.ResidentDangerTemperature) {
            if (this.getSick() == 2) {
                this.addLife(ResidentMeta.ResidentReduceLifeBaseValue * 1.5);
            } else {
                this.addLife(ResidentMeta.ResidentReduceLifeBaseValue);
            }

        }
    }

    // 能够要求结婚（主动）
    canAskMarry() {
        // console.debug("+++++++++++++++++++++++++++++++++++++");
        // console.debug("this.getMakeLoveSystemTime():" + String(this.getMakeLoveSystemTime()));
        // console.debug("this.getAge():" + String(this.getAge()));
        // console.debug("this.getSex():" + String(this.getSex()));
        // console.debug("this.getMyHomeId():" + String(this.getMyHomeId()));
        // console.debug("this.getSocial():" + String(this.getSocial()));
        // console.debug("this.getFSMState():" + String(this.getFSMState()));
        // console.debug("------------------------------------");
        if (this.getMakeLoveSystemTime() == 0 &&
            this.getAge() >= ResidentMeta.ResidentMarryAge &&
            this.getSex() == 1 &&
            this.getMyHomeId() != 0 &&
            this.getSocial() >= 20 &&
            this.getFSMState() == ResidentMeta.ResidentState.IdleState) {
            return true;
        }
        return false;
    }

    // 能够结婚（被动）
    canMarry(manModel) {
        if (this.getSex() == 2 &&
            this.getMakeLoveSystemTime() == 0 &&
            this.getAge() > ResidentMeta.ResidentMarryAge &&
            this.getFSMState() == ResidentMeta.ResidentState.IdleState) {
            return true;
        }
        return false;
    }


    addEnjoy(delta) {
        this.setEnjoy(this.getEnjoy() + delta);
    }

    setEnjoy(num) {
        this.enjoy = num;
        if (this.enjoy < 0) {
            this.enjoy = 0;
        } else if (this.enjoy > 100) {
            this.enjoy = 100;
        }
    }

    getEnjoy() {
        return this.enjoy;
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

    getSocial() {
        return this.social;
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

    // 是够已经成年
    isAdult() {
        return this.age >= ResidentMeta.ResidentAdultAge
    }
}