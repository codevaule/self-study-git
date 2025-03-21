/// <reference types="jest" />
import { convertDocumentToText } from '../lib/document-converter';

// 가상 파일 객체 생성 헬퍼 함수
function createMockFile(name: string, type: string, size: number = 1024): File {
  // 빈 Blob으로 테스트용 파일 생성
  const blob = new Blob(['test content'], { type });
  const file = new File([blob], name, { type });
  
  // File 객체 크기 속성 오버라이드
  Object.defineProperty(file, 'size', {
    get() { return size; }
  });
  
  return file;
}

describe('Document Converter Integration Tests', () => {
  describe('File format support', () => {
    test('TXT 파일 지원', async () => {
      const file = createMockFile('sample.txt', 'text/plain');
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
      expect(result).toContain(file.name);
    });
    
    test('DOCX 파일 지원', async () => {
      const file = createMockFile(
        'sample.docx', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
      expect(result).toContain(file.name);
    });
    
    test('PDF 파일 지원', async () => {
      const file = createMockFile('sample.pdf', 'application/pdf');
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
      expect(result).toContain(file.name);
    });
    
    test('PPT 파일 지원', async () => {
      const file = createMockFile(
        'sample.ppt', 
        'application/vnd.ms-powerpoint'
      );
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
      expect(result).toContain(file.name);
    });
    
    test('PPTX 파일 지원', async () => {
      const file = createMockFile(
        'sample.pptx', 
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      );
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
      expect(result).toContain(file.name);
    });
    
    test('HWP 파일 지원', async () => {
      const file = createMockFile('sample.hwp', 'application/x-hwp');
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
      expect(result).toContain(file.name);
    });
  });
  
  describe('Error handling', () => {
    test('지원하지 않는 파일 형식 처리', async () => {
      const file = createMockFile('sample.xyz', 'application/octet-stream');
      await expect(convertDocumentToText(file)).rejects.toThrow();
    });
    
    test('빈 파일 처리', async () => {
      const file = createMockFile('empty.txt', 'text/plain', 0);
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
    });
    
    test('매우 큰 파일 처리', async () => {
      const file = createMockFile('large.txt', 'text/plain', 10 * 1024 * 1024); // 10MB
      const result = await convertDocumentToText(file);
      expect(result).toBeTruthy();
    });
  });
}); 