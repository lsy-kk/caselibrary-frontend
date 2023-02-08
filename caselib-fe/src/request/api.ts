import service from ".";
import type { ISelectData, IUser} from "@/type/user";


// 获取用户列表
export function getUserList(data:ISelectData){
    return service({
        url: "/user/getList", 
        method: "get",
        params: {
            page: data.page,
            pageSize: data.pageSize,
            id: data.id,
            email: data.email,
            authority: data.authority
        }
    })
}

// 更新用户信息（权限和状态）
export function updateUser(data: IUser){
    return service({
        url: "/user/update", 
        method: "put",
        data,
    })
}

// 更新用户信息（密码）
export function updatePassword(data: IUser){
    return service({
        url: "/user/updatePassword", 
        method: "put",
        data,
    })
}

// 新增用户
export function insertUser(data: IUser){
    return service({
        url: "/user/insert", 
        method: "post",
        data,
    })
}
