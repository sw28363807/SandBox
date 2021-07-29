import RandomMgr from "../helper/RandomMgr";
import Treelogic from "./Treelogic";

export default class TreeMgr extends Laya.Script {

    constructor() { 
        super();
        this.trees = {};
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
        this.trees[String(this.maxID)] = tree;
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
    getNearstTree(x, y, distance) {
        let ret = [];
        for (let key in this.trees) {
            let tree = this.trees[key];
            let curDistance = new Laya.Point(tree.x, tree.y).distance(x, y);
            if (curDistance < distance) {
                ret.push(tree);
            }
        }
        return RandomMgr.randomACellInArray(ret);
    }

    onEnable() {
    }

    onDisable() {
    }
}