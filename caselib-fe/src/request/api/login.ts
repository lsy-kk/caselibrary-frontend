import service from "..";
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

// 发送验证码
export function sendEmailCode(data:ILoginForm){
    return service({
        url: "/sendEmailCode",
        method: "post",
        data,
    })
}
// 通过邮件验证码登录
export function loginByEmailCode(data:ILoginForm){
    return service({
        url: "/loginByEmailCode", 
        method: "post",
        data,
    })
}

