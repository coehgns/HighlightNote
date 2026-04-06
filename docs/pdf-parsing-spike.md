# PDF Parsing Spike

## 목적

HighlightNote MVP에서 annotation 기반 하이라이트 추출이 실제로 동작하는지 확인하기 위해
합성 PDF fixture를 사용해 파싱 스파이크를 수행했다.

## 현재 스파이크 범위

아래 4가지 fixture를 테스트 코드에서 생성해 검증했다.

| Fixture | 목적 | 기대 결과 | 현재 결과 |
| --- | --- | --- | --- |
| `highlighted.pdf` | annotation highlight가 있는 문서 | `COMPLETED` | 성공 |
| `blank.pdf` | 텍스트 레이어는 있으나 하이라이트가 없는 문서 | `NO_HIGHLIGHTS` | 성공 |
| `image-only.pdf` | 텍스트 레이어가 없는 문서 | `UNSUPPORTED_PDF` | 성공 |
| `broken.pdf` | 손상된 PDF 입력 | `PARSING_FAILED` | 성공 |

## 구현 관찰

1. 하이라이트 추출은 `PDAnnotationTextMarkup`의 `Highlight` subtype을 기준으로 동작한다.
2. 텍스트는 quad points 또는 annotation rectangle을 bounds로 변환한 뒤 `PDFTextStripperByArea`로 추출한다.
3. 문서 전체 텍스트 레이어가 비어 있고 하이라이트도 없으면 `UNSUPPORTED_PDF`로 분류한다.
4. 파싱 중 예외가 발생하면 업로드는 기록되지만 상태는 `PARSING_FAILED`로 마감한다.

## 현재 한계

- 실제 외부 PDF 샘플이 아니라 합성 fixture 기반 검증이다.
- 복잡한 2단 컬럼 논문이나 수식 중심 문서에 대한 좌표 정확도는 아직 보수적으로 봐야 한다.
- 여러 줄 하이라이트와 페이지 간 묶기 규칙은 추가 샘플로 더 보정해야 한다.

## 다음 단계

1. 실제 강의자료/교재/논문 PDF를 추가 확보한다.
2. 다중 줄 하이라이트와 2단 컬럼 문서에 대한 회귀 fixture를 확장한다.
3. 노트 구조화 로직을 페이지 기준 묶음에서 문단/개념 기준으로 정교화한다.
