# HighlightNote

HighlightNote는 PDF에서 사용자가 직접 표시한 하이라이트를 추출해 학습 노트 초안을 만드는 서비스다.

## MVP 목표

1. 하이라이트가 포함된 PDF 업로드
2. 하이라이트 annotation 추출
3. 하이라이트 기반 노트 구조 생성
4. 웹 미리보기
5. PDF 다운로드

## 로컬 실행

### 백엔드

```bash
cd backend
./gradlew bootRun
```

기본 주소: `http://localhost:8080`

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

기본 주소: `http://localhost:5173`

### Docker Compose

```bash
docker compose -f infra/docker-compose.yml up --build
```

## 검증 명령

```bash
cd backend && ./gradlew test
cd frontend && npm run lint
cd frontend && npm test
cd frontend && npm run build
cd frontend && npm run test:e2e
```

## 프로젝트 문서

- `docs/product-scope.md`
- `docs/sample-pdf-matrix.md`
- `docs/demo-scenarios.md`
- `docs/demo-script.md`
- `docs/pdf-parsing-spike.md`

## 배포

- EC2 수동 배포 스크립트: `infra/ec2/deploy.sh`
- GitHub Actions CI: `.github/workflows/ci.yml`
- GitHub Actions 수동 배포: `.github/workflows/deploy.yml`
