import service from ".";
import type { ILoginForm } from "@/type/login";
// 登录
export function login(data:ILoginForm){
    return service({
        url: "/login", 
        method: "post",
        data,
    })
}

// 登出
export function logout(token: string){
    return service({
        url: "/logout", 
        method: "get",
        params: token,
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

