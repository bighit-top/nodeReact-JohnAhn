const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next) {
    var user = this;

    //비밀번호를 암호화한다.
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) { //salt: 공식문서상 bcrypt 사용시 salt가 필요함
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) { //hash: 암호화된 비밀번호
                if(err) return next(err);
                user.password = hash; //패스워드를 암호화된 것으로 교체
                next();
            });
        });
    } else {
        next(); //받아서 처리할 곳으로 넘김. 예)index.js의 user.save()
    }
});

//패스워드 확인
userSchema.methods.comparePassword = function(insertedPassword, callback) {
    bcrypt.compare(insertedPassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
}

//jwt 생성
userSchema.methods.generateToken = function(callback) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken'); //user_.id+'secretToken'

    user.token = token; //토큰 값 입력
    user.save(function(err, user) {
        if (err) return callback(err);
        callback(null, user);
    });
}

//토큰을 찾아 복호화함
userSchema.statics.findByToken = function(token, callback) {
    var user = this;

    //토큰 복호화
    jwt.verify(token, 'secretToken', function(err, decoded) { //복호화된 user._id
        //유저 아이디를 이용해서 유저를 찾아 클라이언트에서 가져온 token과 db에 보관된 token 일치 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {  //mongoDB method
            if (err) return callback(err);
            callback(null, user);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = { User }; //다른 곳에서 사용할 수 있도록