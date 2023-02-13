import service from "..";
import type { ITag, ISelectTag } from "@/type/tag"

// 获取标签列表
export function getTagList(data: ISelectTag){
    return service({
        url: "/tag/getList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            id: data.id,
            name: data.name
        }
    })
}

// 更新标签信息
export function updateTag(data: ITag){
    return service({
        url: "/tag/update", 
        method: "put",
        data,
    })
}

// 新增标签
export function insertTag(data: ITag){
    return service({
        url: "/tag/insert", 
        method: "post",
        data,
    })
}