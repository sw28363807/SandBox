export default class Utils {
    // 获得符号
    static getSign(value) {
        if (value > 0) {
            return 1;
        }
        return -1;
    }
};