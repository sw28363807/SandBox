export default class TimeUtils {

    // 获得当前系统时间
    static getSystemTime() {
        let date = new Date();
        let offset = date.getTimezoneOffset();
        let stampGTM = date.getTime() + offset * 60 * 1000;
        return stampGTM;
    }
}
