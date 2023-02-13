import type { ITag, ITagVo } from "./tag";
import type { IUser } from "./user";

// 案例头部信息
export interface ICaseHeader{
    id?: number,
    title?: string,
    summary?: string,
    authorId?: string, 
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
    authorId: string, 
    thumb: number,
    viewtimes: number, 
    comment: number,
    visible: number,
    createTime: String,
    updateTime: String,
    caseBody: ICaseBodyVo,
    authorName: String,
    tags: Array<ITagVo>,
}
export interface ICaseBodyVo{
    content: String
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