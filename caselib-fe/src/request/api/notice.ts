import service from "..";
// 获取消息
export function getListByUserIdAndTypeAndIsRead(userId: number, type: number, isRead: number){
    return service({
        url: "/notice/getListByUserIdAndTypeAndIsRead", 
        method: "get",
        params: {
            userId: userId,
            type: type,
            isRead: isRead,
        }
    })
}

// 更新未读消息为已读
export function updateUnRead(userId: number, type: number){
    return service({
        url: "/notice/updateUnRead", 
        method: "get",
        params: {
            userId: userId,
            type: type,
        }
    })
}