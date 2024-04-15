
export interface IUser{
    id: string
    userName: string
    email: string
    password: string
    role: 'user' | 'moderator' |'admin'
    verify: boolean
    image?: string 
    ban: boolean
}

export interface IUserNetworkLogin {
    email?: string;
    userName?: string;
    image?: string;
}