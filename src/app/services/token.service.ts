import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
//import { JwtDecodeOptions, jwt_decode } from 'jwt-decode';
import jwt_decode, {JwtPayload} from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token:string){
    setCookie('accessToken', token, { expires: 10, path:'/'})
  }

  getToken(){
    const token  = getCookie('accessToken')
    return token
  }

  removeToken(){
    removeCookie('accessToken')
  }

  isValidToken(){
    const token = this.getToken();
    if ( !token){
      return false
    }
    const decodeToken = jwt_decode<JwtPayload>(token)
    if ( decodeToken && decodeToken?.exp  )
    {
        const tokenDate = new Date(0)
        tokenDate.setUTCSeconds(decodeToken.exp)
        const today  = new Date() 
        return tokenDate.getTime() > today.getTime()
    }
    return false
  }

  saveRefreshToken(token:string){
    //localStorage.setItem('token', token)
    setCookie('refreshToken', token, { expires: 10, path:'/'})
  }

  getRefreshToken(){
    //return localStorage.getItem('token')
    const token  = getCookie('refreshToken')
    return token
  }

  removeRefreshToken(){
    //localStorage.removeItem('token')
    removeCookie('refreshToken')
  }

  isValidRefreshToken(){
    const refreshToken = this.getRefreshToken();
    if ( !refreshToken){
      return false
    }
    const decodeToken = jwt_decode<JwtPayload>(refreshToken)
    if ( decodeToken && decodeToken?.exp  )
    {
        const tokenDate = new Date(0)
        tokenDate.setUTCSeconds(decodeToken.exp)
        const today  = new Date() 
        return tokenDate.getTime() > today.getTime()
    }
    return false
  }

}