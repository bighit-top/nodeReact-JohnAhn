import React from 'react';
import axios from 'axios'; //axios: 서버와 통신
import { useNavigate } from 'react-router-dom';

function LandingPage() {

    const navigate = useNavigate(); //router v6

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if (response.data.success) {
                    navigate("/login");
                } else {
                    alert("로그아웃에 실패했습니다.");
                }
            });
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh', flexDirection: 'column'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    );
}

export default LandingPage;