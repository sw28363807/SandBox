export default class Utils {
    // 获得符号
    static getSign(value) {
        if (value > 0) {
            return 1;
        }
        return -1;
    }

    // 获得符号包含0
    static getSign2(value) {
        if (value > 0) {
            return 1;
        } else if (value == 0) {
            return 0;
        }
        return -1;
    }
};