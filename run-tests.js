// 자동화된 테스트 실행기
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 설정
const config = {
  maxRetries: 3,
  waitBetweenRetries: 2000, // 2초
  testsDir: '__tests__',
  reportDir: 'test-reports',
  unitTestPattern: '**/*.test.ts',
  integrationTestPattern: '**/*.integration.test.ts',
  autoContinue: true,
};

// 실행 시작 시간
const startTime = new Date();

// 색상 코드
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// 로깅 함수
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// 보고서 디렉토리 생성
function createReportDirectory() {
  if (!fs.existsSync(config.reportDir)) {
    fs.mkdirSync(config.reportDir, { recursive: true });
  }
}

// 명령 실행 함수
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(`실행 중: ${command} ${args.join(' ')}`, colors.cyan);
    
    const proc = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`명령이 종료 코드 ${code}로 실패했습니다`));
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// 단위 테스트 실행
async function runUnitTests(retry = 0) {
  log('\n========== 단위 테스트 실행 중 ==========', colors.blue);
  try {
    await runCommand('npx', ['jest', config.unitTestPattern, '--testPathIgnorePatterns=integration']);
    log('✅ 단위 테스트 성공', colors.green);
    return true;
  } catch (error) {
    log(`❌ 단위 테스트 실패: ${error.message}`, colors.red);
    
    if (retry < config.maxRetries) {
      log(`재시도 중... (${retry + 1}/${config.maxRetries})`, colors.yellow);
      await new Promise(resolve => setTimeout(resolve, config.waitBetweenRetries));
      return runUnitTests(retry + 1);
    } else {
      log('최대 재시도 횟수에 도달했습니다.', colors.red);
      return false;
    }
  }
}

// 통합 테스트 실행
async function runIntegrationTests(retry = 0) {
  log('\n========== 통합 테스트 실행 중 ==========', colors.blue);
  try {
    await runCommand('npx', ['jest', config.integrationTestPattern]);
    log('✅ 통합 테스트 성공', colors.green);
    return true;
  } catch (error) {
    log(`❌ 통합 테스트 실패: ${error.message}`, colors.red);
    
    if (retry < config.maxRetries) {
      log(`재시도 중... (${retry + 1}/${config.maxRetries})`, colors.yellow);
      await new Promise(resolve => setTimeout(resolve, config.waitBetweenRetries));
      return runIntegrationTests(retry + 1);
    } else {
      log('최대 재시도 횟수에 도달했습니다.', colors.red);
      return false;
    }
  }
}

// 테스트 요약 보고
function reportSummary(unitTestsSuccess, integrationTestsSuccess) {
  const endTime = new Date();
  const duration = (endTime - startTime) / 1000;
  
  log('\n========== 테스트 요약 ==========', colors.magenta);
  log(`총 실행 시간: ${duration.toFixed(2)}초`, colors.cyan);
  log(`단위 테스트: ${unitTestsSuccess ? '성공 ✅' : '실패 ❌'}`, unitTestsSuccess ? colors.green : colors.red);
  log(`통합 테스트: ${integrationTestsSuccess ? '성공 ✅' : '실패 ❌'}`, integrationTestsSuccess ? colors.green : colors.red);
  
  const overallSuccess = unitTestsSuccess && integrationTestsSuccess;
  log(`\n전체 결과: ${overallSuccess ? '성공 ✅' : '실패 ❌'}`, overallSuccess ? colors.green : colors.red);
  
  // 보고서 파일 작성
  const reportContent = `
테스트 실행 보고서
===================
날짜: ${new Date().toISOString()}
총 실행 시간: ${duration.toFixed(2)}초
단위 테스트: ${unitTestsSuccess ? '성공' : '실패'}
통합 테스트: ${integrationTestsSuccess ? '성공' : '실패'}
전체 결과: ${overallSuccess ? '성공' : '실패'}
  `;
  
  const reportPath = path.join(config.reportDir, `test-report-${Date.now()}.txt`);
  fs.writeFileSync(reportPath, reportContent);
  log(`보고서가 작성되었습니다: ${reportPath}`, colors.cyan);
  
  return overallSuccess;
}

// 메인 함수
async function main() {
  log('자동화된 테스트 실행 시작...', colors.magenta);
  createReportDirectory();
  
  let continueTests = true;
  let unitTestsSuccess = false;
  
  // 단위 테스트 실행
  unitTestsSuccess = await runUnitTests();
  
  // 단위 테스트가 실패했을 때 자동 계속 진행 여부 확인
  if (!unitTestsSuccess && !config.autoContinue) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    continueTests = await new Promise(resolve => {
      readline.question('단위 테스트가 실패했습니다. 통합 테스트를 계속 진행하시겠습니까? (y/n) ', answer => {
        readline.close();
        resolve(answer.toLowerCase() === 'y');
      });
    });
  }
  
  // 통합 테스트 실행
  let integrationTestsSuccess = false;
  if (continueTests) {
    integrationTestsSuccess = await runIntegrationTests();
  } else {
    log('통합 테스트를 건너뜁니다.', colors.yellow);
  }
  
  // 결과 보고
  const overallSuccess = reportSummary(unitTestsSuccess, integrationTestsSuccess);
  
  // 종료 코드 설정
  process.exit(overallSuccess ? 0 : 1);
}

// 스크립트 실행
main().catch(error => {
  log(`오류 발생: ${error.message}`, colors.red);
  process.exit(1);
}); 