const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser'); //http header에 따라 body를 처리해서 가져옴
const cookieParser = require('cookie-parser'); //쿠키
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({extended: true})); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json
app.use(cookieParser()); //cookie

const mongoose = require('mongoose'); //mongoose로 애플리케이션과 mongodb를 연결
const { application } = require('express');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected!!'))
    .catch(err => console.log(err));


/**
 * API
 */

//메인페이지
app.get('/', (req, res) => res.send('Hello World, This is Node+React test application.'));

//클라이언트 통신 테스트 페이지
app.get('/api/hello', (req, res) => {
    res.send("하이~?");
});

//회원가입 정보 저장
app.post('/api/users/register', (req, res) => {
    //req.body를 user모델을 통해 mongodb에 저장
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err}); //실패시 err 반환
        return res.status(200).json({   //성공시 200 상태코드 반환
            success: true
        });
    });
});

//로그인
app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user) => {  //mongodb 에서 제공하는 메서드로 검색한다. 
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일 or 패스워드가 잘못 입력되었습니다."
            });
        }

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({loginSuccess: false, message: "이메일 or 패스워드가 잘못 입력되었습니다."});
            }

            //비밀번호가 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 저장한다.(쿠키): 저장 위치는 다양함(쿠키, 세션, 로컬스토리지 등)
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess: true, userId: user._id});
                
            });
        });
    });
});

//권한 인증
app.get('/api/users/auth', auth, (req, res) => { //auth: token 인증 처리 middleware
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

//로그아웃
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if (err) return res.json({success: false, err});
        return res.status(200).send({success: true});
    }); //mongodb method
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));