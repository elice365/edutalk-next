const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// JWT 비밀키 읽기
const privateKey = fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
  .split('\n')
  .filter(line => line.startsWith('JWT_SECRET_PRIVATE'))
  .join('\n')
  .replace('JWT_SECRET_PRIVATE="', '')
  .replace('"', '');

// 강사용 토큰 생성
const instructorPayload = {
  identy: 'asdfkqwle',
  type: 'teacher',  // 강사 타입
  sub: 'e3a0b56c-2505-43f4-818f-ae02df956825',  // 강사 ID
  name: '1234',  // 강사 이름
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),  // 24시간 후 만료
  iat: Math.floor(Date.now() / 1000)
};

const instructorToken = jwt.sign(instructorPayload, privateKey, { algorithm: 'RS256' });

console.log('강사용 토큰:');
console.log(instructorToken);
console.log('\n토큰 정보:');
console.log(instructorPayload);
console.log('\n채팅 URL (강사):');
console.log(`http://localhost:3000/chat?token=${instructorToken}&chatId=e657c32a-84a0-491c-8308-545a53d95e73&instructorName=1234&studentName=Student+Name&instructorID=e3a0b56c-2505-43f4-818f-ae02df956825&studentID=student-id`);