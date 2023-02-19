import type { ITag, ITagVo } from "./tag";
import type { IUser } from "./user";

// 案例头部信息
export interface ICaseHeader{
    id?: number,
    title: string,
    summary: string,
    authorId: number, 
    thumb?: number,
    viewtimes?: number, 
    comment?: number,
    state: number,
    visible: number,
    status?: number, 
    createTime?: Date,
    updateTime?: Date,
}
//VO
export interface ICaseHeaderVo{
    id: number,
    title: string,
    summary: string,
    authorId: number, 
    thumb: number,
    viewtimes: number, 
    comment: number,
    visible: number,
    createTime: string,
    updateTime: string,
    caseBody: ICaseBodyVo,
    authorName: string,
    tags: Array<ITagVo>,
}
export interface ICaseBody{
    id?: number,
    caseId?: number,
    content: string,
    appendix: string,
    version: number,
    status?: number, 
    createTime?: Date,
    updateTime?: Date,
}
export interface ICaseBodyVo{
    content: string,
    appendixList: Array<string>,
}
export interface ISelectCase{
    // 搜索信息（案例id，案例名称，作者id）
    id?: number,
    authorId?: number,
    state?: number,
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class CaseData{
    selectData: ISelectCase={
        id: undefined,
        state: undefined,
        authorId: undefined,
        page: 1,
        pageSize: 10,
    }
    // 总页码
    pageCount: number = 0;
    // 案例列表
    list: ICaseHeaderVo[]=[]
}