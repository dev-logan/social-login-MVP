const express = require('express')
const connect = require('./models')
const app = express()
const port = 3000
const User = require('./models/user')
connect()
const jwt = require('jsonwebtoken')

app.get('', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/users/auth', async (req, res) => {
    let { snsId, nickName } = req.body

    let user

    const existUser = await User.findOne({ snsId })
    if (existUser) {
        user = existUser
    } else {
        // 존재하는 유저가 없으면 회원 가입
        const newUser = new User({ nickName, snsId })
        await newUser.save()
        user = newUser
    }

    nickName = user.nickName
    const userId = user.userId

    const token = jwt.sign({ userId }, 'work-out-at-home-secret-key')
    res.json({ token, nickName })
})

app.listen(port, () => {
	console.log(port, 'port ON')
})

// const KAKAO_OAUTH_TOKEN_API_URL = 'https://kauth.kakao.com/oauth/token'
// const KAKAO_GRANT_TYPE = 'authorization_code'
// const KAKAO_CLIENT_id = 'aa8217c943973196abf8dfd06871ba5e'
// const KAKAO_REDIRECT_URL = 'http://localhost:3000/kakao/code'

// app.post('/login/kakao', async (req, res, next) => {
// 	const { kakaoToken } = req.body

// 	const result = await axios.post(
// 		`${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${kakaoToken}`,
// 		{
// 			headers: {
// 				'Content-type':
// 					'application/x-www-form-urlencoded;charset=utf-8',
// 			},
// 		}
// 	)

//     console.log(result)
// try {
// 	axios
// 		.post(
// 			`${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`,
// 			{
// 				headers: {
// 					'Content-type':
// 						'application/x-www-form-urlencoded;charset=utf-8',
// 				},
// 			}
// 		)
// 		.then((result) => {
// 			console.log(result.data['access_token'])
// 			// 토큰을 활용한 로직을 적어주면된다.
// 		})
// 		.catch((e) => {
// 			console.log(e)
// 			res.send(e)
// 		})
// } catch (e) {
// 	console.log(e)
// 	res.send(e)
// }
// })
