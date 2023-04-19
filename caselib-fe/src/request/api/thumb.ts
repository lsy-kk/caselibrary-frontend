import service from "..";
// 新增点赞记录
export function insertThumb(caseId: number, userId: number){
    return service({
        url: "/thumb/insert", 
        method: "get",
        params: {
            caseId: caseId,
            userId: userId,
        }
    })
}
// 根据案例id和用户id，删除点赞记录
export function deleteThumb(caseId: number, userId: number){
    return service({
        url: "/thumb/delete", 
        method: "get",
        params: {
            caseId: caseId,
            userId: userId,
        }
    })
}
// 根据案例id和用户id，查找点赞记录
export function findThumb(caseId: number, userId: number){
    return service({
        url: "/thumb/get", 
        method: "get",
        params: {
            caseId: caseId,
            userId: userId,
        }
    })
}