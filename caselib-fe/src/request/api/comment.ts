import type { IComment } from "@/type/comment";
import service from "..";

// 发布评论
export function insertComment(data: IComment){
    return service({
        url: "/comment/insert", 
        method: "post",
        data,
    })
}