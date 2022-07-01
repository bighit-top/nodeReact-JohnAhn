import React, { useEffect } from 'react';
import axios from 'axios'; //axios: 서버와 통신

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello') //request getmapping
        .then(response => console.log(response.data)); //response
    }, []);

    return (
        <div>
            LandingPage
        </div>
    );
}

export default LandingPage;