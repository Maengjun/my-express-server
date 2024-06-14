import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';


//Jwt를 추출하는 방법을 지정하고 Jwt를 검증할 때 사용할 비밀키 설정
const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'kitri_secret'
}
//done : 인증결과를 처리하는 함수
const jwtStrategy = new JwtStrategy(opts, async(jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
})

export default jwtStrategy;