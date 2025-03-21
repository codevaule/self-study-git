@echo off
echo Study Helper 개발 서버 시작...
echo 브라우저에서 http://localhost:3000 으로 접속하세요.

:: PowerShell 실행 정책 변경 (관리자 권한이 필요할 수 있음)
powershell -Command "Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned" 

:: 노드 패키지 확인
if not exist node_modules (
  echo 노드 모듈이 없습니다. 설치를 시작합니다...
  powershell -Command "npm install"
)

:: npm 명령어를 직접 실행하는 대신 npx를 사용
echo 개발 서버를 시작합니다...
powershell -Command "npx next dev"

:: 서버가 종료되면 메시지 표시
echo 서버가 종료되었습니다.
pause 