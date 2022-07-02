import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
    
    //null: 아무나
    //true: 로그인한 유저
    //false: 로그인 안한 유저

    function AuthenticationCheck() {

        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            //redux
            dispatch(auth())
                .then(response => {
                    //로그인 하지 않은 상태
                    if (!response.payload.isAuth) {
                        if (option) navigate("/login");
                    } else {
                        //로그인 한 상태
                        if (adminRoute && !response.payload.isAdmin) navigate("/");
                        else if (option === false) navigate("/");
                    }
                });
        }, [dispatch, navigate]);

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck;
}