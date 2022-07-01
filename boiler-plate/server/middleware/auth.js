const { User } = require('../models/User');

//인증 처리
let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth; //x_auth는 만들때 설정했던 키

    //토큰을 복호화한 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;

        next(); //auth는 middleware이기 때문에 다음 것을 실행해야 빠져나간다.
    });
}

module.exports = { auth };