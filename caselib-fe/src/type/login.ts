export interface ILoginForm{
    email: string
    password: string
}
export interface ILoginParam{
    username: string
    email: string
    password: string
}
export class LoginData{
    ruleForm: ILoginForm={
        email: "",
        password: ""
    }
}