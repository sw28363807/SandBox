(function () {
    'use strict';

    class RandomMgr {

        //以(x, y) 为原点 distance 距离内的一个随机点
        static randomByArea(x, y, distance) {
            let signX = RandomMgr.randomSign();
            let signY = RandomMgr.randomSign();
            let factorX = Math.random();
            let factorY = Math.random();
            let retX = x + signX * factorX * distance;
            let retY = y + signY * factorY * distance;
            return {x: Math.floor(retX), y: Math.floor(retY)};
        };

        // 以(x, y) 为原点 distance 距离内的一个随机点，但是这个点不能大于maxX，maxY并且不能小于0
        static randomByArea2(x, y, distance, maxX, maxY, offX, offY) {
            let p = RandomMgr.randomByArea(x, y, distance);
            if (p.x < offX) {
                p.x = offX;
            } else if (p.x > maxX - offX) {
                p.x = maxX - offX;
            }
            if (p.y < offY) {
                p.y = offY;
            } else if (p.y > maxY - offY) {
                p.y = maxY - offY;
            }
            return p;
        }

        // 做一个是否的随机
        static randomYes() {
            if (Math.random() >= 0.5) {
                return true;
            } else {
                return false;
            }
        }

        static randomSign() {
            if (Math.random() >= 0.5) {
                return 1;
            } else {
                return -1;
            }
        }
    }

    class GameMeta {
    }

    // 资源路径
    GameMeta.ResidentPrefabPath = "prefab/Resident.prefab";   //居民prefab路径
    GameMeta.FoodPrefabPath = "prefab/Food.prefab";           //食物prefab路径
    GameMeta.ResdientDetailsPanelPath = "prefab/ResidentDetailsPanel.prefab";   //显示居民信息prfab路径
    GameMeta.HomePrefabPath = "prefab/Home.prefab";       //家prefab路径

    GameMeta.TreeImagePath = [
        "source/landscape/tree1.png",
        "source/landscape/tree2.png",
        "source/landscape/tree3.png",
        "source/landscape/tree4.png"
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
    ];

    // 石头图片资源
    GameMeta.StoneImagePath = [
        "source/landscape/stone1.png",
        "source/landscape/stone2.png",
        "source/landscape/stone3.png",
    ];

    // 尺寸
    GameMeta.HomeWidth = 256;   //建筑宽度
    GameMeta.HomeHeight = 256;   //建筑高度
    FoodMeta.FoodMaxNumPerTrigger = 1;  //每个食物触发器的最大生成食物数量
    FoodMeta.FoodTriggerArea = 50;      //食物出现的范围
    FoodMeta.FoodUpdateTime = 0;        //更新食物出现的时间

    class ResidentMeta {
    }

    //0-空状态 1-待机 2-搜索寻找盖房的地方 3-建造房子 4-寻找木材
    ResidentMeta.ResidentState = {
        NullState: 0,       //无状态
        IdleState: 1,       //待机状态
        FindBlockForCreateHome: 2,  //搜索能盖房的地方
        CreateHome: 3,      //建造房屋
        FindTree: 4,         //搜索树木
        CutDownTree: 5,      //砍伐树木
        FindStone: 6,       //寻找石材
        CollectStone: 7,    //收集石头
        FindFood: 8,        //搜索食物
        EatFood: 9,         //吃饭饭
        FindWater: 10,      //寻找水源
        DrinkWater: 11,    //喝水
    };

    // 动画枚举
    ResidentMeta.ResidentAnim = {
        Null: 0,    // 无动画
        Idle: 1,    //待机动画
        Walk: 2,    //行走动画
    };

    // 层级
    ResidentMeta.ResidentZOrder = 100;  //居民层级

    // 砍树消耗单位时间
    ResidentMeta.CutDownTreeTimeStep = 1000;

    // 收集石头的时间
    ResidentMeta.CollectStoneTimeStep = 1000;

    //吃东西消耗的时间
    ResidentMeta.EatFoodTimeStep = 1000;

    // 人物移动速度
    ResidentMeta.ResidentMoveSpeed = 150;

    // 属性掉落基础值
    ResidentMeta.ResidentValueStep = 2000;  //人物数值消耗Step
    ResidentMeta.ResidentMakeIdeaStep = 1000;  //人物做决策Step
    ResidentMeta.ResidentReduceWaterBaseValue = -9;
    ResidentMeta.ResidentReduceFoodBaseValue = -6;

    class NameMeta {
        // 随机一个名字
        static randomOneName() {
            let nameFactor = Math.random();
            let idx1 = Math.floor(nameFactor * NameMeta.FirstName.length);
            let dex2 = Math.floor(nameFactor * NameMeta.LastName.length);
            return NameMeta.FirstName[idx1] + NameMeta.LastName[dex2];
        }
    }

    // 姓氏集合
    NameMeta.FirstName = [
        "孙",
        "沈",
        "李",
        "王",
        "赵",
        "司马",
        "诸葛",
    ];

    // 名字集合
    NameMeta.LastName = [
        "文",
        "建蕊",
        "二狗",
        "狗胜",
        "桂芬",
        "翠萍",
        "秀姑",
        "大壮",
        "Joel",
        "Season",
        "Jack",
        "大壮",

    ];

    class ResidentModel extends Laya.Script {
        constructor() { 
            super();
            // 面上的数值
            this.life = 100;    //生命
            this.water = 100;   //水源
            this.enjoy = 100;   //娱乐
            this.food = 100;    //食物
            this.teach = 0;     //教育
            this.health = 100;  //健康
            this.social = 100;    //社交

            // 隐藏数值
            this.createBuildingIdea = 0;    //盖房的欲望值
            this.cutDownTreeIdea = 0;       //砍树的欲望值
            this.transportStoneIdea = 0;    //搬运石头的欲望值
            this.myHomeID = 0;              //我的家的ID

            this.temperature = 36;  //体温
            this.age = 1;       //年龄
            this.sex = 1;   // 性别 1 男 2 女
            this.married = 1; //1 未婚 2 已婚
            this.residentName = NameMeta.randomOneName();


            this.x = 0;     //当前角色所处坐标x
            this.y = 0;     //当前角色所处坐标y
            this.residentId = 0;    //角色Id
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
                if (data.createBuildingIdea) {
                    this.createBuildingIdea = data.createBuildingIdea;
                }
                if (data.myHomeID) {
                    this.myHomeID = data.myHomeID;
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
            }
        }

        // 下降需求和上升满足
        onStep() {
            this.changeWater(ResidentMeta.ResidentReduceWaterBaseValue);
            this.changeFood(ResidentMeta.ResidentReduceFoodBaseValue);
        }

        // 调整食物
        changeFood(delta) {
            this.food = this.food + delta;
            if (this.food < 0) {
                this.food = 0;
            } else if (this.food > 100) {
                this.food = 100;  
            }
        }

        // 调整水源
        changeWater(delta) {
            this.water = this.water + delta;
            if (this.water < 0) {
                this.water = 0;
            } else if (this.water > 100) {
                this.water = 100;  
            }
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

        // 获得水源
        getWater() {
            return this.water;
        }

        // 获得食物
        getFood() {
            return this.food;
        }
    }

    class GameModel extends Laya.Script {

        constructor() { 
            super();
            this.maxResidentID = 0;         //人物最大ID
            this.residentModels = {};       //角色数据
        }
        
        onEnable() {
        }

        onDisable() {
        }

        static getInstance() {
            if (GameModel.instance) {
                return GameModel.instance
            }
            GameModel.instance =  new GameModel();
            GameModel.instance.initSelf();
            return GameModel.instance;
        }

        // 添加角色Model
        newResidentModel(param) {
            this.maxResidentID++;
            let model = new ResidentModel();
            model.updateData({
                x: param.x,
                y: param.y,
                sex: param.sex,
                residentId: this.maxResidentID,
            });
            this.residentModels[String(this.maxResidentID)] = model;
            return model;
        }

        // 人物数值timer
        onUpdateResidentValue() {
            // 数值计算定时器
            for (let key in this.residentModels) {
                let item = this.residentModels[key];
                item.onStep();
            }
        }

        //初始化自己 
        initSelf() {
            Laya.timer.loop(ResidentMeta.ResidentValueStep, this, this.onUpdateResidentValue);
        }
    }

    class HomeLogic extends Laya.Script {

        constructor() { 
            super();
            this.buildingState = 0; //0-无状态 1-建造中
        }
        
        onEnable() {
            this.pos = this.owner.getChildByName("pos");
            this.homeImage = this.pos.getChildByName("image"); 
            this.sliderControl = this.owner.getChildByName("sliderControl");
            this.slider = this.sliderControl.getChildByName("slider");
            this.sliderControl.visible = false;
        }

        onDisable() {
        }

        refreshInfo(config) {
            this.homeImage.loadImage(GameMeta.HomeImagePath[0].homeImage, Laya.Handler.create(this, function () {
                this.homeImage.width = 128;
                this.homeImage.height = 128;
                this.homeImage.x = (128 - this.owner.width)/2;
                this.homeImage.y = - this.homeImage.height;
            }));
            this.owner.x = config.x;
            this.owner.y = config.y;
            this.startCreate();
        }

        // 开始建造
        startCreate() {
            this.buildingState = 1;
            this.pos.alpha = 0.5;
            this.sliderControl.visible = true;
            this.slider.width = 1;
            Laya.timer.loop(30, this, this.onCreateProgress);
        }

        onCreateProgress() {
            this.buildingState = 0;
            this.slider.width = this.slider.width + 1;
            if (this.slider.width > 192) {
                this.slider.width = 192;
                this.onCreateFinish();
            }
        }

        onCreateFinish() {
            this.pos.alpha = 1;
            this.sliderControl.visible = false;
            Laya.timer.clear(this, this.onCreateProgress);
        }
    }

    class BuildingMgr extends Laya.Script {

        constructor() { 
            super();
            this.buildings = [];
            this.maxID = 0;
        }

        static getInstance() {
            return BuildingMgr.instance = BuildingMgr.instance || new BuildingMgr();
        }
        
        onEnable() {
        }

        onDisable() {
        }

        // 建造家园
        createHomeByConfig(config, callback) {
            this.maxID++;
            let cell = {
                x: config.x,
                y: config.y,
                width: GameMeta.HomeWidth,
                height: GameMeta.HomeHeight,
                building: "loadingRes",
                id: this.maxID,
            };
            Laya.loader.create(GameMeta.HomePrefabPath, Laya.Handler.create(this, function (prefabDef) {
                config.id = this.maxID;
                let home = prefabDef.create();
                config.parent.addChild(home);
                let script = home.getComponent(HomeLogic);
                script.refreshInfo(config);
                cell.building = home;
                this.buildings.push(cell);
                if (callback) {
                    callback.runWith(cell);
                }
            }));
            return this.maxID;
        }

        // 是否可以盖房
        isCanBuildHome(x, y) {
            let cur = new Laya.Rectangle(x, y, GameMeta.HomeWidth, GameMeta.HomeHeight);
            for (let index = 0; index < this.buildings.length; index++) {
                let item = this.buildings[index];
                if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                    return false;
                }
            };
            return true;
        }
    }

    class GameContext {
    }

    GameContext.mapWidth = 0;   //地图宽度
    GameContext.mapHeight = 0;  //地图高度
    GameContext.residentMapOff = 200;   //人物行走的边界距离
    GameContext.mapContainer = null;    //地图容器

    class ResidentDetailsPanel extends Laya.Script {

        constructor() { 
            super(); 
        }
        
        onEnable() {
        }

        onDisable() {
        }

        // 刷新信息
        refreshInfo(config) {
            this.owner.getChildByName("name").text = config.residentName;
            let sexString = "男";
            if (config.sex == 2) {
                sexString = "女";
            }
            this.owner.getChildByName("sex").text = "性别: " +  sexString;

            let marriedString = "未婚";
            if (config.married == 2) {
                marriedString = "已婚";
            }
            this.owner.getChildByName("married").text = marriedString;
            this.owner.getChildByName("temperature").text = "体温: "+String(config.temperature);
            this.owner.getChildByName("age").text = "年龄: "+String(config.age);

            this.setSlider("sliderLife", config.life);
            this.setSlider("sliderWater", config.water);
            this.setSlider("sliderFood", config.food);
            this.setSlider("sliderEnjoy", config.enjoy);
            this.setSlider("sliderTeach", config.teach);
            this.setSlider("sliderHealth", config.health);
            this.setSlider("sliderSocial", config.social);
        }

        // 设置进度条
        setSlider(key, value) {
            let maxHeight = 194;
            let control = this.owner.getChildByName(key).getChildByName("slider");
            let factor = value/100;
            let curHeight = Math.ceil(factor * maxHeight);
            let scaleY = curHeight/maxHeight;
            control.scaleY = scaleY;
        }
    }

    class ResidentDetailsPanelMgr extends Laya.Script {

        constructor() { 
            super();
            this.curPanel = null;
        }
        
        onEnable() {
        }

        onDisable() {
        }

        static getInstance() {
            let ret = ResidentDetailsPanelMgr.instance = ResidentDetailsPanelMgr.instance || new ResidentDetailsPanelMgr();
            return ret
        }

        // 显示界面
        showPanel(config) {
            this.removePanel();
            Laya.loader.create(GameMeta.ResdientDetailsPanelPath, Laya.Handler.create(this, function (prefabDef) {
                this.curPanel = prefabDef.create();
                this.curPanel.x = 50;
                this.curPanel.y = -120;
                config.parent.addChild(this.curPanel);
                let script = this.curPanel.getComponent(ResidentDetailsPanel);
                script.refreshInfo(config.data);
                this.curPanel.alpha = 0;
                Laya.Tween.to(this.curPanel, {alpha: 1}, 200);
                Laya.timer.once(3000, this, this.fadeOutFunc);
            }));
        }

        fadeOutFunc() {
            Laya.Tween.to(this.curPanel, {alpha: 0}, 200, null, Laya.Handler.create(this, function () {
                this.removePanel();
            }));
        }

        removePanel() {
            if (this.curPanel) {
                Laya.timer.clear(this, this.fadeOutFunc);
                this.curPanel.removeSelf();
                this.curPanel.destroy();
                this.curPanel = null;
            }
        }
    }

    class Treelogic extends Laya.Script {

        constructor() { 
            super();
            this.treeID = 0;
        }
        
        onEnable() {
            this.treeImage = this.owner.getChildByName("image");
        }

        onDisable() {
        }

        onStart() {
            this.treeImage.loadImage(GameMeta.TreeImagePath[0], Laya.Handler.create(this, function() {
            }));
        }

        setTreeID(id) {
            this.treeID = id;
        }


    }

    class TreeMgr extends Laya.Script {

        constructor() { 
            super();
            this.trees = [];
            this.maxID = 0;
        }
        
        static getInstance() {
            let ret = TreeMgr.instance = TreeMgr.instance || new TreeMgr();
            return ret
        }

        pushTree(tree) {
            this.maxID++;
            let script = tree.getComponent(Treelogic);
            if (script) {
                script.setTreeID(this.maxID);
            }
            this.trees.push(tree);
        }

        // 寻找最近的一颗树
        getNearstTree(x, y) {
            let distance = 99999999;
            let ret = null;
            for (let index = 0; index < this.trees.length; index++) {
                let tree = this.trees[index];
                let curDistance = new Laya.Point(tree.x, tree.y).distance(x, y);
                if (curDistance < distance) {
                    distance = curDistance;
                    ret = tree;
                }
            }
            return ret;
        }

        onEnable() {
        }

        onDisable() {
        }
    }

    class StoneLogic extends Laya.Script {

        constructor() { 
            super();
            this.stoneID = 0;
        }
        
        onEnable() {
            this.stoneImage = this.owner.getChildByName("image");
        }

        onDisable() {
        }

        onStart() {
            // new Laya.Sprite().
            this.stoneImage.loadImage(GameMeta.StoneImagePath[0], Laya.Handler.create(this, function() {
                this.stoneImage.width = this.stoneImage.texture.sourceWidth;
                this.stoneImage.height = this.stoneImage.texture.sourceHeight;
                this.stoneImage.y = this.owner.height - this.stoneImage.texture.sourceHeight;
                this.stoneImage.x = Math.floor((this.owner.width - this.stoneImage.texture.sourceWidth)/2);
            }));
        }

        setStoneID(id) {
            this.stoneID = id;
        }
    }

    class StoneMgr extends Laya.Script {

        constructor() { 
            super();
            this.stones = [];
            this.maxID = 0;
        }

            
        static getInstance() {
            let ret = StoneMgr.instance = StoneMgr.instance || new StoneMgr();
            return ret
        }

        pushStone(stone) {
            this.maxID++;
            let script = stone.getComponent(StoneLogic);
            if (script) {
                script.setStoneID(this.maxID);
            }
            this.stones.push(stone);
        }

        // 寻找最近的一块石头
        getNearstStone(x, y) {
            let distance = 99999999;
            let ret = null;
            for (let index = 0; index < this.stones.length; index++) {
                let stone = this.stones[index];
                let curDistance = new Laya.Point(stone.x, stone.y).distance(x, y);
                if (curDistance < distance) {
                    distance = curDistance;
                    ret = stone;
                }
            }
            return ret;
        }
        
        onEnable() {
        }

        onDisable() {
        }
    }

    class FoodMgr extends Laya.Script {

        constructor() { 
            super();
            this.foods = [];
        }
        
        static getInstance() {
            return FoodMgr.instance = FoodMgr.instance || new FoodMgr();
        }

        // 创建食物
        createFoodByConfig(config, callback) {
            Laya.loader.create(GameMeta.FoodPrefabPath, Laya.Handler.create(this, function (prefabDef) {
                let food = prefabDef.create();
                config.parent.addChild(food);
                food.x = config.x;
                food.y = config.y;
                this.foods.push(food);
                if (callback) {
                    callback.runWith(food);
                }
            }));
        }

        // 获得距离最近的一个食物
        getNearstFood(x, y) {
            let distance = 99999999;
            let ret = null;
            for (let index = 0; index < this.foods.length; index++) {
                let food = this.foods[index];
                let curDistance = new Laya.Point(food.x, food.y).distance(x, y);
                if (curDistance < distance) {
                    distance = curDistance;
                    ret = food;
                }
            }
            return ret;
        }
    }

    class WaterMgr extends Laya.Script {

        constructor() { 
            super();
            this.waters = [];
        }
        
        static getInstance() {
            let ret = WaterMgr.instance = WaterMgr.instance || new WaterMgr();
            return ret
        }

        pushWater(water) {
            this.waters.push(water);
        }

        // 寻找最近的水源
        getNearstWater(x, y) {
            let distance = 99999999;
            let ret = null;
            for (let index = 0; index < this.waters.length; index++) {
                let water = this.waters[index];
                let curDistance = new Laya.Point(water.x, water.y).distance(x, y);
                if (curDistance < distance) {
                    distance = curDistance;
                    ret = water;
                }
            }
            return ret;
        }

        onEnable() {
        }

        onDisable() {
        }
    }

    class ResidentLogic extends Laya.Script {

        constructor() { 
            super();
        }

        onStart() {
            // Laya.timer.once(1000, this, function () {
            //     this.setFSMState(ResidentMeta.ResidentState.FindWater);
            // });
        }
        
        onEnable() {
            this.initModel();
            this.initControl();
            this.initTouch();
        }

        onDisable() {
            Laya.timer.clear(this, this.onDoWorkFinish);
        }

        //初始化控件
        initControl() {
            this.ani = this.owner.getChildByName("ani");
            this.axAni = this.owner.getChildByName("ax");
            this.axAni.visible = false;
        }

        //初始化属性
        initModel() {
            this.findCreateHomeTimes = 0;   //寻找盖房地点的次数
            this.stateAnim = ResidentMeta.ResidentAnim.Null;
            this.curFSMState = ResidentMeta.ResidentState.NullState;
        }

        initTouch() {
            this.owner.on(Laya.Event.CLICK, this, function () {
                ResidentDetailsPanelMgr.getInstance().showPanel({
                    data:this.model,
                    parent: this.owner
                });
            });
        }

        // 刷新数据
        refreshByModel(model) {
            this.model = model;
            this.owner.x = this.model.getX();
            this.owner.y = this.model.getY();
            this.setFSMState(ResidentMeta.ResidentState.IdleState);
        }

        // 设置动画
        setAnim(anim) {
            if (this.stateAnim == anim) {
                return;
            }
            // new Laya.Animation().play();
            this.stateAnim = anim;
            let ext  = String(this.model.getSex());
            if (anim == ResidentMeta.ResidentAnim.Idle) {
                this.ani.play(0, true, "idle_role1_sex" + ext);
            } else if (anim == ResidentMeta.ResidentAnim.Walk) {
                this.ani.play(0, true, "walk_role1_sex" + ext);
            }
        }



        //  设置状态机状态
        setFSMState(state) {
            if (this.curFSMState == state) {
                return;
            }
            this.curFSMState = state;
            this.axAni.visible = false;
            this.axAni.stop();
            Laya.timer.clear(this, this.onDoWorkFinish);
            // 待机
            if (this.curFSMState == ResidentMeta.ResidentState.IdleState) {
                this.setAnim(ResidentMeta.ResidentAnim.Idle);
            }
            // 寻找可以盖房子的地方
            else if (this.curFSMState == ResidentMeta.ResidentState.FindBlockForCreateHome) {
                this.setAnim(ResidentMeta.ResidentAnim.Walk);
                this.startFindCreateHomeBlock();
            }
            // 盖房子
            else if (this.curFSMState == ResidentMeta.ResidentState.CreateHome) {
                this.setAnim(ResidentMeta.ResidentAnim.Idle);
            }
            // 寻找树木
            else if (this.curFSMState == ResidentMeta.ResidentState.FindTree) {
                this.setAnim(ResidentMeta.ResidentAnim.Walk);
                this.startFindANearstTree();
            // 砍树
            } else if (this.curFSMState == ResidentMeta.ResidentState.CutDownTree) {
                this.setAnim(ResidentMeta.ResidentAnim.Idle);
                this.axAni.visible = true;
                this.axAni.play(0, true, "ani1");
                Laya.timer.once(ResidentMeta.CutDownTreeTimeStep * 3, this, this.onDoWorkFinish);
            }
            // 寻找石头
            else if (this.curFSMState == ResidentMeta.ResidentState.FindStone) {
                this.setAnim(ResidentMeta.ResidentAnim.Walk);
                this.startFindANearstStone();
            }
            // 收集石头
            else if (this.curFSMState == ResidentMeta.ResidentState.CollectStone) {
                this.axAni.visible = true;
                this.axAni.play(0, true, "ani2");
                Laya.timer.once(ResidentMeta.CollectStoneTimeStep* 3, this, this.onDoWorkFinish);
            }
            // 搜索食物
            else if (this.curFSMState == ResidentMeta.ResidentState.FindFood) {
                this.setAnim(ResidentMeta.ResidentAnim.Walk);
                this.startFindANearstFood();
            }
            // 吃食物
            else if (this.curFSMState == ResidentMeta.ResidentState.EatFood) {
                this.axAni.visible = true;
                this.setAnim(ResidentMeta.ResidentAnim.Idle);
                this.axAni.play(0, true, "ani3");
                Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
            }
            // 寻找水源
            else if (this.curFSMState == ResidentMeta.ResidentState.FindWater) {
                this.setAnim(ResidentMeta.ResidentAnim.Walk);
                this.startFindANearstWater();
            }
            // 喝水
            else if (this.curFSMState == ResidentMeta.ResidentState.DrinkWater) {
                this.setAnim(ResidentMeta.ResidentAnim.DrinkWater);
                this.axAni.visible = true;
                this.setAnim(ResidentMeta.ResidentAnim.Idle);
                this.axAni.play(0, true, "ani4");
                Laya.timer.once(ResidentMeta.EatFoodTimeStep * 3, this, this.onDoWorkFinish);
            }
        }


        // 工作完成
        onDoWorkFinish() {
            Laya.timer.clear(this, this.onDoWorkFinish);
            this.setFSMState(ResidentMeta.ResidentState.IdleState);
        }

        // 开始寻找可以建房子的空地
        startFindCreateHomeBlock() {
            if (this.findCreateHomeTimes < 3) {
                if (this.curFSMState == ResidentMeta.ResidentState.FindBlockForCreateHome) {
                    let dstP = RandomMgr.randomByArea2(this.owner.x,
                         this.owner.y,
                          400,
                        GameContext.mapWidth, GameContext.mapHeight, 200, 200);
                    this.gotoDest({x:dstP.x, y:dstP.y}, Laya.Handler.create(this, function () {
                        this.findCreateHomeTimes++;
                        // 查看此处可不可以盖房
                        if (BuildingMgr.getInstance().isCanBuildHome(this.owner.x, this.owner.y)) {
                            this.myHomeID = BuildingMgr.getInstance().createHomeByConfig({
                                parent:this.owner.parent,
                                x:this.owner.x,
                                y:this.owner.y
                            });
                            this.setFSMState(ResidentMeta.ResidentState.CreateHome);                        
                        } else {
                            this.startFindCreateHomeBlock();
                        }
                    }));
                }   
            } else {
                this.curFSMState = ResidentMeta.ResidentState.NullState;
                this.findCreateHomeTimes = 0;
                this.makeIdea();
            }
        }

        startFindANearstTree() {
            if (this.curFSMState == ResidentMeta.ResidentState.FindTree) {
                let nearstTree = TreeMgr.getInstance().getNearstTree(this.owner.x, this.owner.y);
                if (nearstTree) {
                    this.gotoDest({x:nearstTree.x, y:nearstTree.y} , Laya.Handler.create(this, function () {
                        this.setFSMState(ResidentMeta.ResidentState.CutDownTree);
                    }));
                } else {
                    this.setFSMState(ResidentMeta.ResidentState.IdleState);
                    this.makeIdea();
                }
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        }

        // 寻找最近的水源
        startFindANearstWater() {
            if (this.curFSMState == ResidentMeta.ResidentState.FindWater) {
                let nearstWater = WaterMgr.getInstance().getNearstWater(this.owner.x, this.owner.y);
                if (nearstWater) {
                    this.gotoDest({x: nearstWater.x, y: nearstWater.y}, Laya.Handler.create(this, function () {
                        this.setFSMState(ResidentMeta.ResidentState.DrinkWater);
                    }));
                } else {
                    this.setFSMState(ResidentMeta.ResidentState.IdleState);
                    this.makeIdea();
                }
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        }

        // 寻找最近的食物
        startFindANearstFood() {
            if (this.curFSMState == ResidentMeta.ResidentState.FindFood) {
                let nearstFood = FoodMgr.getInstance().getNearstFood(this.owner.x, this.owner.y);
                if (nearstFood) {
                    this.gotoDest({x: nearstFood.x, y: nearstFood.y}, Laya.Handler.create(this, function () {
                        this.setFSMState(ResidentMeta.ResidentState.EatFood);
                    }));
                } else {
                    this.setFSMState(ResidentMeta.ResidentState.IdleState);
                    this.makeIdea();
                }
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        }

        startFindANearstStone() {
            if (this.curFSMState == ResidentMeta.ResidentState.FindStone) {
                let nearstStone = StoneMgr.getInstance().getNearstStone(this.owner.x, this.owner.y);
                if (nearstStone) {
                    this.gotoDest({x: nearstStone.x, y: nearstStone.y}, Laya.Handler.create(this, function () {
                        this.setFSMState(ResidentMeta.ResidentState.CollectStone);
                    }));
                } else {
                    this.setFSMState(ResidentMeta.ResidentState.IdleState);
                    this.makeIdea();
                }
            } else {
                this.setFSMState(ResidentMeta.ResidentState.IdleState);
                this.makeIdea();
            }
        }

        // 行走到某个位置
        gotoDest(info, handler) {
            let dstX = info.x;
            let dstY = info.y;
            let distance = new Laya.Point(dstX, dstY).distance(this.owner.x, this.owner.y);
            let time = distance/ResidentMeta.ResidentMoveSpeed;
            Laya.Tween.to(this.owner, {x:dstX, y: dstY}, time*1000, null, handler);
        }

        getFSMState() {
            return this.curFSMState;
        }

        // 做出策略
        makeIdea() {
            if (this.curFSMState != ResidentMeta.ResidentState.IdleState) {
                return;
            }
            if (this.model.getWater() < 90 && RandomMgr.randomYes()) {
                this.setFSMState(ResidentMeta.ResidentState.FindWater);
                return;
            }
            if (this.model.getFood() < 90 && RandomMgr.randomYes()) {
                this.setFSMState(ResidentMeta.ResidentState.FindFood);
                return;
            }
        }

    }

    class ResidentMgr extends Laya.Script {

        constructor() { 
            super();
            this.residents = [];
        }
        
        onEnable() {
        }

        onDisable() {
        }

        static getInstance() {
            if (ResidentMgr.instance) {
                return ResidentMgr.instance
            }
            ResidentMgr.instance =  new ResidentMgr();
            ResidentMgr.instance.initSelf();
            return ResidentMgr.instance;
        }


        initSelf() {
            Laya.timer.loop(ResidentMeta.ResidentMakeIdeaStep, this, this.onMakeIdea);
        }

        onMakeIdea() {
            this.residents.forEach(function (item, idnex, array) {
                let script = item.getComponent(ResidentLogic);
                if (RandomMgr.randomYes()) {
                    script.makeIdea();
                }
            });
        }

        ceateFunc(config, callback) {
            this.maxID++;
            Laya.loader.create(GameMeta.ResidentPrefabPath, Laya.Handler.create(this, function (prefabDef) {
                let resident = prefabDef.create();
                resident.zOrder = GameMeta.ResidentZOrder;
                config.parent.addChild(resident);
                let script = resident.getComponent(ResidentLogic);
                let model = GameModel.getInstance().newResidentModel(config);
                script.refreshByModel(model);
                this.residents.push(resident);
                if (callback) {
                    callback.runWith(resident);
                }
            }));
        }

        // 创建居民
        createResidentByConfig(config, callback) {
            if (Laya.loader.getRes("res/atlas/source/resident.atlas")) {
                this.ceateFunc(config, callback);
            } else {
                Laya.loader.load("res/atlas/source/resident.atlas",Laya.Handler.create(this, function() {
                    this.ceateFunc(config, callback);
                }));
            }
        }
    }

    class TestSceneLogic extends Laya.Script {

        constructor() { 
            super(); 
        }
        
        onEnable() {
            this.ScrollView = this.owner.getChildByName("ScrollView");
            this.container = this.ScrollView.getChildByName("container");
            ResidentMgr.getInstance().createResidentByConfig({
                parent:this.container,
                x: 100, y: 200, sex: 2
            }, Laya.Handler.create(this, function(obj){
            }));

            ResidentMgr.getInstance().createResidentByConfig({
                parent:this.container,
                x: 200, y: 260, sex: 1
            }, Laya.Handler.create(this, function(obj){
            }));
        }

        onDisable() {
        }
    }

    class FoodTrigger extends Laya.Script {

        constructor() { 
            super();
        }
        
        onEnable() {
            this.curNum = 0;
        }

        onDisable() {
        }

        onStart() {
            this.owner.timer.loop(FoodMeta.FoodUpdateTime, this, function() {
                if (this.curNum >= FoodMeta.FoodMaxNumPerTrigger) {
                    return;
                }
                let pos = RandomMgr.randomByArea(this.owner.x, this.owner.y, FoodMeta.FoodTriggerArea);
                FoodMgr.getInstance().createFoodByConfig({
                    parent:GameContext.mapContainer,
                    x: pos.x,
                    y: pos.y
                }, Laya.Handler.create(this, function(obj) {
                    
                }));
                this.curNum++;
            });
        }
    }

    class Waterlogic extends Laya.Script {

        constructor() { 
            super();
        }
        
        onEnable() {
        }

        onDisable() {
        }

        onStart() {

        }
    }

    class MapScrollView extends Laya.Script {

        constructor() { 
            super();
        }
        
        onEnable() {
            this.startPos = null;
            this.container = this.owner.getChildByName("container");
            GameContext.mapContainer = this.container;
            GameContext.mapWidth = this.container.width;
            GameContext.mapHeight = this.container.height;
        }

        onDisable() {
        }

        onStart() {
            for (let index = 0; index < this.container.numChildren; index++) {
                let child = this.container.getChildAt(index);
                let treeScript = child.getComponent(Treelogic);
                if (treeScript) {
                    TreeMgr.getInstance().pushTree(child);
                }
                let stoneScript = child.getComponent(StoneLogic);
                if (stoneScript) {
                    StoneMgr.getInstance().pushStone(child);
                }
                let waterScript = child.getComponent(Waterlogic);
                if (waterScript) {
                    WaterMgr.getInstance().pushWater(child);
                }
            }
        }

        onMouseDown(e) {
            this.startPos = {x: e.stageX, y: e.stageY};
        }

        onMouseMove(e) {
            if (this.startPos) {
                let dx = e.stageX - this.startPos.x;
                let dy = e.stageY - this.startPos.y;
                this.processPos(this.container.x + dx, this.container.y + dy);  
                this.startPos.x = e.stageX;
                this.startPos.y = e.stageY;
            }
        }

        onMouseUp(e) {
            this.startPos = null;
        }

        onMouseOut(e) {
            this.startPos = null;
        }

        processPos(toX, toY) {
            if (toX != null && toY != null) {
                if (toX > 0) {
                    toX = 0;
                }
                if (toY > 0) {
                    toY = 0;
                }
                if (toX < this.owner.width - GameContext.mapWidth) {
                    toX = this.owner.width - GameContext.mapWidth;
                }
                if (toY < this.owner.height - GameContext.mapHeight) {
                    toY = this.owner.height - GameContext.mapHeight;
                }
                this.container.x = toX;
                this.container.y = toY;
            }
        }

    }

    class FoodLogic extends Laya.Script {

        constructor() { 
            super();
        }
        
        onEnable() {
            this.foodImage = this.owner.getChildByName("image");
        }

        onDisable() {
        }

        onStart() {
            this.owner.alpha = 0;
            this.foodImage.loadImage(GameMeta.FoodImagePath[0]["normalState"], Laya.Handler.create(this, function() {
            }));
            Laya.Tween.to(this.owner, {alpha: 1}, 500);
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scene/TestSceneLogic.js",TestSceneLogic);
    		reg("source/Treelogic.js",Treelogic);
    		reg("source/FoodTrigger.js",FoodTrigger);
    		reg("source/StoneLogic.js",StoneLogic);
    		reg("source/Waterlogic.js",Waterlogic);
    		reg("helper/MapScrollView.js",MapScrollView);
    		reg("source/FoodLogic.js",FoodLogic);
    		reg("building/HomeLogic.js",HomeLogic);
    		reg("resident/ResidentLogic.js",ResidentLogic);
    		reg("panel/ResidentDetailsPanel.js",ResidentDetailsPanel);
        }
    }
    GameConfig.width = 1336;
    GameConfig.height = 750;
    GameConfig.scaleMode ="fixedwidth";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "scene/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		GameModel.getInstance();
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
