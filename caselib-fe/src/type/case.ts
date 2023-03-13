import type { ICommentVo } from "./comment";
import type { IFileVo } from "./file";
import type { ITagVo } from "./tag";
import type { IUserVo } from "./user";

// 案例头部信息
export interface ICaseHeader{
    id?: number,
    title?: string,
    summary?: string,
    authorId?: number, 
    thumb?: number,
    viewtimes?: number, 
    comment?: number,
    state?: number,
    visible?: number,
    status?: number, 
    createTime?: Date,
    updateTime?: Date,
}
//VO
export interface ICaseHeaderVo{
    id: number,
    title: string,
    summary: string,
    thumb: number,
    viewtimes: number, 
    comment: number,
    visible: number,
    createTime: string,
    updateTime: string,
    caseBody: ICaseBodyVo,
    author: IUserVo,
    tags: Array<ITagVo>,
    comments: Array<ICommentVo>,
}
export interface ICaseBody{
    id?: number,
    caseId?: number,
    content?: string,
    appendix?: string,
    version?: number, 
    state?: number,
    status?: number, 
    createTime?: Date,
    updateTime?: Date,
}
export interface ICaseBodyVo{
    id?: number,
    content: string,
    appendixList: Array<IFileVo>,
    state: number,
    version: number,
    createTime: string,
    updateTime: string,
}
export interface ICaseParam{
    caseHeader: ICaseHeader,
    caseBodyVo?: ICaseBodyVo,
    caseBodyVoLatest: ICaseBodyVo,
    oldTags: Number[],
    newTags: Number[],
}
export interface ISelectCase{
    // 搜索信息（案例id，案例名称，作者id）
    id?: number,
    authorId?: number,
    visible?: number,
    state?: number,
    status?: number,
    // 当前页码
    page: number,
    // 页面大小
    pageSize: number,
}
export class CaseData{
    selectData: ISelectCase={
        page: 1,
        pageSize: 10,
    }
    // 总页码
    pageCount: number = 0;
    // 案例列表
    list: ICaseHeaderVo[]=[]
}