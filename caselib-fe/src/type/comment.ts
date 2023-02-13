// 评论信息
export interface IComment{
    id?: number,
    caseId?: number,
    content?: string,
    authorId?: number,
    parentId?: number,
    status?: number,
    createTime?: Date,
    updateTime?: Date,
}
export interface ISelectData{
    // 搜索信息，非必要
    id?: number,
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class InitComment{
    selectData: ISelectData={
        // 页码信息
        page: 1,
        pageSize: 10,
        // 搜索信息,设置为可选
        id: undefined,
    }
    // 总页码
    pageCount: number = 0;
    // 用户列表
    list: IComment[]=[]
}