export default class ResidentMeta {
}

//0-空状态 1-待机 2-搜索寻找盖房的地方 3-建造房子 4-寻找木材
ResidentMeta.ResidentState = {
    NullState: 0,
    IdleState: 1,
    FindBlockForCreateHome: 2,
    CreateHome: 3,
    FindTree: 4
};