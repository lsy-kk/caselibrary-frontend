import { ICaseHeaderVo } from "./case";
import { IUserVo } from "./user";

// 收藏夹
export interface IFavorites{
    id?: number,
    name?: string,
    description?: string,
    image?: string,
    ownerId?: number,
    status?: number,
    visible?: number,
    createTime?: Date,
    updateTime?: Date,
}
export interface IFavoritesVo{
    id: number,
    name: string,
    description: string,
    image: string,
    owner: IUserVo,
    visible: number,
    caseList: ICaseHeaderVo[],
    caseNumber: number,
    favorites: number,
    createTime: string,
    updateTime: string,
}
// 收藏夹记录
export interface IFavoritesInstance{
    id?: number,
    caseId?: number,
    favoritesId?: number,
    userId?: number,
    status?: number,
    createTime?: Date,
    updateTime?: Date,
}
// 特定用户对特定案例的点赞和收藏情况
export interface IUserAttitude{
    favorites: boolean,
    thumb: boolean,
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