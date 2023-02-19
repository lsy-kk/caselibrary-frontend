import type { ICaseHeader, ISelectCase, ICaseBody } from "@/type/case";
import service from "..";
import serviceFile from "..";

// 获取案例列表
export function getCaseList(data: ISelectCase){
    return service({
        url: "/case/getList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            authorId: data.authorId,
            id: data.id
        }
    })
}

// 根据用户id，获取他人案例列表
export function getOtherAuthorList(page: Number, pageSize: Number, userid: Number){
    return service({
        url: "/case/getOtherAuthorList", 
        method: "get",
        params: {
            page: page,
            pageSize: pageSize,
            userid: userid
        }
    })
}


// 更新收藏夹信息
export function updateCase(data: ICaseHeader){
    return service({
        url: "/case/update", 
        method: "put",
        data,
    })
}

// 获取收藏夹内案例列表
export function getCaseBodyByCaseId(id: number){
    return service({
        url: "/", 
        method: "get",
        params:{
            id: id,
        }
    })
}

// 新增案例头部
export function insertCaseHeader(data: ICaseHeader){
    return service({
        url: "/case/insertCaseHeader", 
        method: "post",
        data,
    })
}

// 获取案例头部
export function getCaseHeader(caseId: Number){
    return service({
        url: "/case/getCaseHeader", 
        method: "get",
        params:{
            caseId: caseId,
        }
    })
}

// 新增案例头部
export function updateCaseHeader(data: ICaseHeader){
    return service({
        url: "/case/updateCaseHeader", 
        method: "post",
        data,
    })
}

// 更新案例内容
export function updateCaseBody(data: ICaseBody){
    return service({
        url: "/case/updateCaseBody", 
        method: "post",
        data,
    })
}

// 获取案例内容
export function getCaseBody(caseId: Number){
    return service({
        url: "/case/getCaseBodyByCaseId", 
        method: "get",
        params:{
            caseId: caseId,
        }
    })
}

// 导出markdown文本
export function exportMarkdownFile(data: ICaseBody){
    return service({
        url: "/case/exportMarkdownFile", 
        method: "post",
        data,
        responseType: 'blob',
    })
}
