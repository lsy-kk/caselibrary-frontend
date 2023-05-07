import type { IFavorites, IFavoritesInstance, ISelectFavorites } from "@/type/favorites";
import service from "..";

// 获取收藏夹列表
export function getFavoritesList(data: ISelectFavorites){
    return service({
        url: "/favorites/getFavoritesList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            ownerId: data.ownerId,
            id: data.id,
            status: data.status,
        }
    })
}

// 根据收藏夹id，获取收藏夹Vo信息
export function getFavoritesVoById(id: number){
    return service({
        url: "/favorites/getFavoritesVoId", 
        method: "get",
        params: {
            id: id,
        }
    })
}

// 根据用户id，获取收藏夹列表
export function getFavoritesByOwnerId(userId: number){
    return service({
        url: "/favorites/getFavoritesVoByOwnerId", 
        method: "get",
        params: {
            ownerId: userId,
        }
    })
}

// 根据用户id和收藏夹id，获取收藏夹以及是否收藏有该案例
export function getFavoritesVoByCaseIdAndUserId(caseId: number, userId: number){
    return service({
        url: "/favorites/getFavoritesVoByCaseIdAndUserId", 
        method: "get",
        params: {
            caseId: caseId,
            userId: userId,
        }
    })
}

// 获取特定用户对特定案例的点赞、收藏情况
export function getUserAttitudeVo(caseId: number, userId: number){
    return service({
        url: "/favorites/getUserAttitudeVo", 
        method: "get",
        params: {
            caseId: caseId,
            userId: userId,
        }
    })
}

// 更新收藏夹信息
export function updateFavorites(data: IFavorites){
    return service({
        url: "/favorites/update", 
        method: "put",
        data,
    })
}

// 新增收藏夹（该功能不对后台管理开放）
export function insertFavorites(data: IFavorites){
    return service({
        url: "/favorites/insert", 
        method: "post",
        data,
    })
}

// 更新收藏夹，以及相关收藏记录的状态
export function changeFavoritesStatus(favoritesId: number, status: number){
    return service({
        url: "/favorites/changeStatus", 
        method: "get",
        params: {
            favorites: favoritesId,
            status: status,
        }
    })
}

// 新增收藏记录
export function insertFavoritesItems(data: Array<IFavoritesInstance>){
    return service({
        url: "/favorites/insertItems", 
        method: "post",
        data,
    })
}


// 删除收藏记录
export function deleteFavoritesItems(data: Array<IFavoritesInstance>){
    return service({
        url: "/favorites/deleteItems", 
        method: "put",
        data,
    })
}