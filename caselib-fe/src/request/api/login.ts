import service from "..";
import type { ILoginForm } from "@/type/login";
// 登录
export function login(data: ILoginForm){
    return service({
        url: "/login", 
        method: "post",
        data,
    })
}

// 登出
export function logout(){
    return service({
        url: "/login/logout", 
        method: "get",
    })
}

// 重新登陆
export function reLogin(){
    return service({
        url: "/login/reLogin", 
        method: "get",
    })
}

// 发送验证码
export function sendEmailCode(data:ILoginForm){
    return service({
        url: "/login/sendEmailCode",
        method: "post",
        data,
    })
}
// 通过邮件验证码登录
export function loginByEmailCode(data:ILoginForm){
    return service({
        url: "/login/loginByEmailCode", 
        method: "post",
        data,
    })
}

