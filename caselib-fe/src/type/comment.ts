import type { IUserVo } from "./user";

// 评论信息
export interface IComment{
    id?: number,
    caseId?: number,
    content?: string,
    authorId?: number,
    parentId?: number,
    toUserId?: number,
    status?: number,
    createTime?: Date,
    updateTime?: Date,
}
export interface ICommentVo{
    id: number,
    content: string,
    author: IUserVo,
    toUser: IUserVo,
    children: Array<ICommentVo>,
    createTime: string,
    updateTime: string,
}
export interface ISelectComment{
    // 搜索信息，非必要
    id?: number,
    authorId?: number,
    caseId?: number,
    status?: number,
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class CommentData{
    selectData: ISelectComment={
        // 页码信息
        page: 1,
        pageSize: 10,
    }
    // 总页码
    pageCount: number = 0;
    // 用户列表
    list: IComment[]=[]
}