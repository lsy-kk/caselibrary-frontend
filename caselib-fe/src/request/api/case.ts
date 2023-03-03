import type { ICaseHeader, ISelectCase, ICaseBody, ICaseParam, ICaseBodyVo } from "@/type/case";
import service from "..";
import serviceFile from "..";

// 获取案例列表
export function getCaseVoList(data: ISelectCase){
    return service({
        url: "/case/getCaseVoList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            id: data.id,
            authorId: data.authorId,
            visible: data.visible,
            state: data.state,
            status: data.status,
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
export function getCaseListByCaseId(id: number){
    return service({
        url: "/", 
        method: "get",
        params:{
            id: id,
        }
    })
}

// 新增/提交案例Param（header,body和tags）
export function submitCaseParam(data: ICaseParam){
    return service({
        url: "/case/submitCaseParam", 
        method: "post",
        data,
    })
}

// 获取案例Param（header,body和tags）
export function getCaseParam(caseId: number|undefined){
    return service({
        url: "/case/getCaseParam", 
        method: "get",
        params:{
            caseId: caseId,
        }
    })
}

// 导出markdown文本
export function exportMarkdownFile(data: ICaseBodyVo){
    return service({
        url: "/case/exportMarkdownFile", 
        method: "post",
        data,
        responseType: 'blob',
    })
}
