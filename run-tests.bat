@echo off
echo Study Helper 자동화 테스트 실행...
echo ==============================

:: 노드 환경 확인
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Node.js가 설치되어 있지 않습니다. 설치 후 다시 시도하세요.
  exit /b 1
)

:: 노드 패키지 확인
if not exist node_modules (
  echo 노드 모듈이 없습니다. 설치를 시작합니다...
  call npm install
)

:: 테스트 실행
echo 테스트 실행 중...
node run-tests.js

:: 종료 코드 확인
if %ERRORLEVEL% equ 0 (
  echo 모든 테스트가 성공적으로 완료되었습니다.
) else (
  echo 테스트 중 오류가 발생했습니다. 로그를 확인하세요.
)

echo ==============================
pause 