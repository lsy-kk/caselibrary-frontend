import service from "..";
import type { ITag, ISelectTag } from "@/type/tag"

// 分页获取标签列表
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

export function getTagVoList(data: ISelectTag){
    return service({
        url: "/tag/getTagVoList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            id: data.id,
            name: data.name
        }
    })
}
// 根据前缀，获取标签列表
export function getTagListByPrefix(prefix: String){
    return service({
        url: "/tag/getTagListByPrefix", 
        method: "get",
        params: {
            prefix: prefix
        }
    })
}
// 根据关键字，获取tagVo列表
export function getSearchList(page: Number, pageSize: Number, keyword: string){
    return service({
        url: "/tag/getSearchList", 
        method: "get",
        params: {
            page: page,
            pageSize: pageSize,
            keyword: keyword,
        }
    })
}

// 根据id，获取标签vo
export function getTagVoById(tagId: number){
    return service({
        url: "/tag/getTagVoById", 
        method: "get",
        params: {
            id: tagId
        }
    })
}
// 根据案例id，获取标签列表
export function findTagVoByCaseId(caseId: number){
    return service({
        url: "/tag/findTagVoByCaseId", 
        method: "get",
        params: {
            caseId: caseId
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