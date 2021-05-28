import Treelogic from "./Treelogic";

export default class TreeMgr extends Laya.Script {

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

    // 是否有交集
    intersectsTree(x, y, w, h) {
        let cur = new Laya.Rectangle(x, y, w, h);
        for (let key in this.trees) {
            let item = this.trees[key];
            if (cur.intersects(new Laya.Rectangle(item.x, item.y, item.width, item.height))) {
                return true;
            }
        }
        return false;
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