# Web3Forms 이메일 설정 가이드

## 1. Web3Forms 계정 설정

### 무료 API 키 받기
1. [Web3Forms](https://web3forms.com) 접속
2. "Get Access Key" 클릭
3. 이메일 주소 입력 (실제 수신할 이메일)
4. API Key를 이메일로 받기

### Pro 플랜 업그레이드 (선택사항)
- 월 $8
- 무제한 제출
- 첨부파일 최대 25MB 지원
- 스팸 필터링
- 우선 지원

## 2. 환경 변수 설정

`.env` 파일에 받은 API Key 입력:

```env
VITE_WEB3FORMS_API_KEY=your-actual-api-key-here
```

예시:
```env
VITE_WEB3FORMS_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 3. 구현된 기능

### 무료 견적 분석 (FreeAnalysisForm.tsx)
- 기본 견적서 AI 분석 요청
- 고객 정보, 프로젝트 정보, 파일 정보 전송
- 24시간 내 결과 제공 안내

### 책임 분석 (PaidAnalysisForm.tsx)
- 유료 전문가 분석 요청
- 결제 정보 포함
- 전문가 1:1 분석 및 협력사 할인 혜택

### 협력사 서비스 (PartnerService.tsx)
- 검증된 협력사 매칭 요청
- 프로젝트 정보 및 요구사항 전송
- 전담 매니저 배정

## 4. 기능 테스트

1. 개발 서버 재시작 (환경 변수 적용):
```bash
# 현재 서버 중지 (Ctrl+C)
npm run dev
```

2. http://localhost:3000 접속

3. 각 서비스별 테스트:
   - "무료 견적 분석" 선택 → 폼 작성 → 제출
   - "책임 분석" 선택 → 결제 → 폼 작성 → 제출
   - "협력사 서비스" 선택 → 폼 작성 → 제출

4. Web3Forms에 등록한 이메일로 메일 수신 확인

## 5. 이메일 템플릿 형식

모든 이메일은 다음 정보를 포함합니다:
- 신청자 정보 (이름, 이메일, 전화번호)
- 프로젝트 정보 (유형, 지역, 예산)
- 첨부 파일 정보 (파일명, 크기)
- 추가 요청사항
- 신청 일시

## 6. 문제 해결

### 이메일이 오지 않는 경우
1. API Key가 올바른지 확인
2. 스팸 폴더 확인
3. Web3Forms 대시보드에서 로그 확인
4. 브라우저 개발자 도구에서 네트워크 요청 확인

### API Key 오류
- `.env` 파일의 키가 `VITE_WEB3FORMS_API_KEY`인지 확인
- 실제 API 키로 교체했는지 확인
- 서버 재시작 후 테스트

### CORS 에러
- Web3Forms는 CORS를 지원하므로 일반적으로 발생하지 않음
- 에러 발생 시 API Key 확인

## 7. 프로덕션 배포

배포 전 체크리스트:
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 프로덕션용 API Key 설정
- [ ] 실제 수신 이메일 주소 확인
- [ ] 환경 변수가 호스팅 플랫폼에 설정되어 있는지 확인

### Netlify 배포 시
1. Netlify 대시보드 → Site settings → Environment variables
2. `VITE_WEB3FORMS_API_KEY` 추가
3. 재배포

### Vercel 배포 시
1. Vercel 대시보드 → Settings → Environment Variables
2. `VITE_WEB3FORMS_API_KEY` 추가
3. 재배포

## 8. 보안 주의사항

- API Key를 절대 GitHub에 커밋하지 마세요
- `.env` 파일은 항상 `.gitignore`에 포함
- 프로덕션과 개발 환경에 다른 API Key 사용 권장