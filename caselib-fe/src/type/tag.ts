// 标签信息
export interface ITag{
    id?: number,
    name?: string,
    description?: string,
    image?: string,
    status?: number,
    createTime?: string,
    updateTime?: string,
}
// VO
export interface ITagVo{
    id: number,
    name: string,
    description: string,
    image: string,
}
export interface ISelectTag{
    // 搜索信息
    id?: number
    name?: string
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class TagData{
    selectData: ISelectTag={
        page: 1,
        pageSize: 10,
        id: undefined,
        name: undefined,
    }
    // 总页码
    pageCount: number = 0;
    // 标签列表
    list: ITag[]=[]
}