import type { IComment, ISelectComment } from "@/type/comment";
import service from "..";
// 根据条件，获取评论列表（管理员）
export function getCommentList(data: ISelectComment){
    return service({
        url: "/comment/getCommentList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            id: data.id,
            authorId: data.authorId,
            caseId: data.caseId,
        }
    })
}

// 发布评论
export function insertComment(data: IComment){
    return service({
        url: "/comment/insert", 
        method: "post",
        data,
    })
}

// 更新评论
export function updateComment(data: IComment){
    return service({
        url: "/comment/update", 
        method: "put",
        data,
    })
}