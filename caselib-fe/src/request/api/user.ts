import service from "..";
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

// 根据token获取用户信息
export function getUserByToken(token: string){
    return service({
        url: "/user/getUserByToken", 
        method: "get",
        params: {
            token: token
        },
    })
}

// 根据id获取用户信息
export function getUserById(id: number){
    return service({
        url: "/user/getUserById", 
        method: "get",
        params: {
            id: id
        }
    })
}

// 根据id获取用户信息vo()
export function getUserVoById(id: number){
    return service({
        url: "/user/getUserVoById", 
        method: "get",
        params: {
            id: id
        }
    })
}
