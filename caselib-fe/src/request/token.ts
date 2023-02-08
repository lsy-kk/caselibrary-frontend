export function getToken() {
    let token = localStorage.getItem('token')
    if (!token){
        token = ''
    }
    return token
}

export function setToken(token: string) {
    return localStorage.setItem('token', token)
}

export function removeToken() {
    return localStorage.removeItem('token')
}