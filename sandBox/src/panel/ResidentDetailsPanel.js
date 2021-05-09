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
        console.debug(config);
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
        
        
    }
}