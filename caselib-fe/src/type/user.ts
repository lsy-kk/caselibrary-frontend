// 用户信息
export interface IUser{
    id?: number,
    email?: string,
    image?: string,
    username?: string,
    password?: string,
    authority?: number,
    status?: number,
    createTime?: Date,
    updateTime?: Date,
}
export interface ISelectData{
    // 搜索信息，非必要
    id?: number,
    email?: string,
    authority?: number,
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class InitUser{
    selectData: ISelectData={
        // 页码信息
        page: 1,
        pageSize: 10,
        // 搜索信息,设置为可选
        id: undefined,
        email: undefined,
        authority: undefined,
    }
    // 总页码
    pageCount: number = 0;
    // 用户列表
    list: IUser[]=[]
}