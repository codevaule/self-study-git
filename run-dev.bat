@echo off
echo Study Helper 개발 서버 시작...
echo 브라우저에서 http://localhost:3000 으로 접속하세요.

:: 노드 패키지 확인
if not exist node_modules (
  echo 노드 모듈이 없습니다. 설치를 시작합니다...
  call npm install
)

:: 개발 서버 실행
call npm run dev 