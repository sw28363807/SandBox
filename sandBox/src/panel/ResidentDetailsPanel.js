export default class ResidentDetailsPanel extends Laya.Script {

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