import { IUserVo } from "./user";

// 消息信息
export interface INotice{
    id?: number,
    fromId?: number,
    toId?: number,
    title?: string,
    content?: string,
    type?: number,
    caseId?: number
    isRead?: number,
    status?: number,
    createTime?: Date,
    updateTime?: Date,
}
// VO
export interface INoticeVo{
    id: number,
    fromUser: IUserVo,
    toId: number,
    title: string,
    content: string,
    type: number,
    caseId: number
    isRead: number,
    createTime: string,
}