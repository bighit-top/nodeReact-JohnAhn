import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types'

export function loginUser(dataToSubmit) {
    const request = axios.post('/api/users/login', dataToSubmit) //로그인 요청
        .then(response => response.data);
    
    return { //action -> reducer로 보내서 다음 state를 만듬
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit) {
    const request = axios.post('/api/users/register', dataToSubmit) //회원가입 요청
        .then(response => response.data);
    
    return { //action -> reducer
        type: REGISTER_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get('/api/users/auth') //요청 페이지 권한 확인
        .then(response => response.data);
    
    return {
        type: AUTH_USER,
        payload: request
    }
}