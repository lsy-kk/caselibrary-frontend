// 标签信息
export interface ITag{
    tagId: number,
    tagname: string,
    description: string,
    image: string,
    status: number,
    createTime: string,
    updateTime: string,
}
interface ISelectTag{
    // 搜索信息
    tagname: string
    // 当前页码
    page: number,
    // 总页码
    pageCount: number,
    // 页面大小
    pageSize: number,
}
export class TagData{
    selectData: ISelectTag={
        tagname: "",
        page: 1,
        pageCount: 0,
        pageSize: 10,
    }
    // 标签列表
    list: ITag[]=[]
}