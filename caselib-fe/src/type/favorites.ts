// 标签信息
export interface IFavorites{
    id?: number,
    name?: string,
    description?: string,
    image?: string,
    ownerId?: number,
    status?: number,
    visible?: number,
    createTime?: string,
    updateTime?: string,
}
export interface ISelectFavorites{
    // 搜索信息（所有人id，收藏夹id，收藏夹名称）
    ownerId?: number,
    id?: number,
    status?: number,
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class FavoritesData{
    selectData: ISelectFavorites={
        page: 1,
        pageSize: 10,
    }
    // 总页码
    pageCount:number = 0;
    // 收藏夹列表
    list: IFavorites[]=[]
}