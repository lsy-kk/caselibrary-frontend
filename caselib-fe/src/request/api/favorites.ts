import type { IFavorites, ISelectFavorites } from "@/type/favorites";
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

// 更新收藏夹信息
export function updateFavorites(data: IFavorites){
    return service({
        url: "/favorites/update", 
        method: "put",
        data,
    })
}

// 获取收藏夹内案例列表
export function getCaseByFavorites(id: number){
    return service({
        url: "/favorites/getCase", 
        method: "get",
        params:{
            id: id,
        }
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