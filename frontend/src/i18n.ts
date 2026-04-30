import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      common: {
        confirmDelete: '이 문서를 영구적으로 삭제하시겠습니까?',
      },
      nav: {
        library: '내 서재',
        upload: '새 업로드',
        search: '아카이브 검색...',
        signIn: '로그인',
      },
      hero: {
        tagline: '문서 처리',
        title: '노트를 학술적\\n통찰로\\n변환하세요.',
        description: '연구 논문, 현장 노트 또는 저널 초안을 업로드하세요. HighlightNote는 사용자가 표시한 구절만 추출하여 구조화된 노트 초안으로 변환합니다.',
      },
      upload: {
        title: '원고 드래그 앤 드롭',
        subtitle: '최대 50MB의 PDF, EPUB 또는 LaTeX 파일',
        selectFile: '워크스페이스에서 파일 선택',
        selected: '선택됨',
        process: '문서 처리 시작',
        uploading: '업로드 중...',
        clear: '선택 취소',
      },
      recent: {
        title: '최근 처리된 문서',
        subtitle: '가장 최근의 문서 추출 결과를 확인하세요.',
        viewAll: '전체 아카이브 보기',
        viewingAll: '전체 아카이브 표시 중',
        status: {
          completed: '완료됨',
          processing: '처리 중',
          error: '오류',
        },
        neural: '신경망 매핑',
        processingHint: '확인 중',
        processed: '처리 일시',
        date1: '2023년 10월 12일',
        date2: '5시간 전 추가됨',
        retry: '업로드 재시도',
        download: 'PDF 학습 정리본 다운로드',
        delete: '문서 삭제',
      },
      footer: {
        copyright: '© 2024 HighlightNote. 학술 문서 처리 서비스.',
        privacy: '개인정보 처리방침',
        terms: '이용약관',
        institutional: '기관용 액세스',
      },
      processing: {
        tagline: '문서 처리 작업',
        title: '업로드한 문서를 정리하고\\n분석 공간을 준비하는 중입니다.',
        statusLabel: '상태',
        statusValue: '처리 중',
        activeTask: '진행 중인 작업',
        progress: '전체 진행률',
        step1: '텍스트 추출',
        step1Desc: '요약 가능한 텍스트 구조를 확인 중입니다.',
        step2: '좌표 매핑',
        step2Desc: '하이라이트 영역과 본문 위치를 연결하고 있습니다.',
        step3: '노트 생성',
        step3Desc: '학습용 정리 초안으로 재구성할 준비를 하고 있습니다.',
        fileLabel: '파일',
        fileHint: '현재 분석 대상 문서',
        stageLabel: '현재 단계',
        stageValue: '분석 중',
        stageHint: 'PDF 검사 및 추출',
        modeLabel: '응답 방식',
        modeValue: '실시간',
        modeHint: '동기화 응답 방식 적용됨',
        syncError: '연결 문제',
        syncDesc: '업로드를 재시도해 흐름을 복구할 수 있습니다.',
        retryBtn: '연결 재시도',
        errNoHighlights: '하이라이트가 없는 문서는 결과 초안을 만들 수 없습니다.',
        errFormat: '읽을 수 없는 PDF 구조는 현재 처리할 수 없습니다.',
        errParsing: '파싱 중 오류가 발생했습니다. 다른 샘플 PDF를 시도해 주세요.'
      },
      result: {
        tagline: '문서 메타데이터',
        title: '하이라이트 기반\\n노트 초안 생성',
        successDesc: '성공적으로 하이라이트를 추출했고 노트 초안을 완성했습니다.',
        failNoHighlights: '업로드는 성공했지만 하이라이트 영역을 찾지 못했습니다.',
        failFormat: '파일을 로드했으나 지원하지 않는 PDF 양식입니다.',
        failParsing: '텍스트 파싱에 실패했습니다. 다른 샘플 파일로 시도해 주세요.',
        failNotFound: '요청한 문서를 스토리지에서 찾을 수 없습니다.',
        statFile: '원본 파일',
        statFileHint: '현재 분석이 연결된 문서',
        statCount: '하이라이트 수',
        statCountHint: '발견된 어노테이션 개수',
        statPages: '전체 페이지',
        statPagesHint: '문서에서 인식한 총 페이지',
        btnDownload: 'PDF 학습 정리본 다운로드',
        btnDownloading: 'PDF 준비 중...',
        btnNew: '새 PDF 업로드',
        btnRefresh: '상태 새로고침',
        noteResultLabel: '학습 노트 결과',
        fallbackTitle: '업로드 결과',
        emptyResult: '결과 화면은 파싱 실패 상태를 숨기지 않고 그대로 보여줍니다. 하이라이트가 포함된 정상적인 PDF로 다시 업로드해 보세요.',
        noteHighlightFrom: '{{page}} 페이지 하이라이트',
        noteSourceLinked: '원본 연결됨',
        noteSourceHighlights: '원본 하이라이트',
        notePageNum: '페이지 {{page}}'
      }
    }
  },
  en: {
    translation: {
      common: {
        confirmDelete: 'Are you sure you want to permanently delete this document?',
      },
      nav: {
        library: 'My Library',
        upload: 'New Upload',
        search: 'Search archive...',
        signIn: 'Sign In',
      },
      hero: {
        tagline: 'MANUSCRIPT PROCESSING',
        title: 'Transmute notes\\ninto academic\\ninsights.',
        description: 'Upload your research monographs, field notes, or journal drafts. HighlightNote extracts only the passages you marked and converts them into a structured note draft.',
      },
      upload: {
        title: 'Drag & Drop Manuscript',
        subtitle: 'PDF, EPUB, or LaTeX files up to 50MB',
        selectFile: 'Select File from Workspace',
        selected: 'Selected',
        process: 'Process Document',
        uploading: 'Uploading...',
        clear: 'Clear selection',
      },
      recent: {
        title: 'Recently Processed',
        subtitle: 'Review your most recent monograph extractions.',
        viewAll: 'View Complete Archive',
        viewingAll: 'Showing complete archive',
        status: {
          completed: 'Completed',
          processing: 'Processing',
          error: 'Error',
        },
        neural: 'Neural Mapping',
        processingHint: 'Checking',
        processed: 'Processed',
        date1: '12 Oct 2023',
        date2: 'Added 5 hours ago',
        retry: 'Retry Upload',
        download: 'Download PDF study notes',
        delete: 'Delete document',
      },
      footer: {
        copyright: '© 2024 HighlightNote. An Academic Monograph Service.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        institutional: 'Institutional Access',
      },
      processing: {
        tagline: 'Document Processing',
        title: 'Organizing the uploaded document and\\npreparing the analysis workspace.',
        statusLabel: 'Status',
        statusValue: 'Processing',
        activeTask: 'Active Task',
        progress: 'Overall Progress',
        step1: 'Text Extraction',
        step1Desc: 'Identifying summable text structures.',
        step2: 'Coordinate Mapping',
        step2Desc: 'Linking highlighted regions with body text positions.',
        step3: 'Note Generation',
        step3Desc: 'Preparing to reconstruct into a study note draft.',
        fileLabel: 'File',
        fileHint: 'Target document for analysis',
        stageLabel: 'Current Stage',
        stageValue: 'Analyzing',
        stageHint: 'PDF inspection and extraction',
        modeLabel: 'Response Mode',
        modeValue: 'Real-time',
        modeHint: 'Synchronous response active',
        syncError: 'Interrupted Sync',
        syncDesc: 'If connection issues occur, retry uploading to recover the workflow.',
        retryBtn: 'Retry Connection',
        errNoHighlights: 'Documents without highlights cannot generate a draft.',
        errFormat: 'Unreadable PDF structures cannot be processed currently.',
        errParsing: 'Parsing failed. Please try another sample PDF.'
      },
      result: {
        tagline: 'Document Metadata',
        title: 'Highlight-based\\nNote Draft Generation',
        successDesc: 'Successfully extracted highlights and completed the note draft.',
        failNoHighlights: 'Upload succeeded but no highlights were found in the document.',
        failFormat: 'File loaded but the PDF structure is unsupported.',
        failParsing: 'Failed to parse text. Please try with another sample file.',
        failNotFound: 'The requested document could not be found in storage.',
        statFile: 'Source File',
        statFileHint: 'Document linked to this analysis',
        statCount: 'Highlight Count',
        statCountHint: 'Discovered annotations',
        statPages: 'Total Pages',
        statPagesHint: 'Total recognized pages within the document',
        btnDownload: 'Download PDF Study Notes',
        btnDownloading: 'Preparing PDF...',
        btnNew: 'Upload New PDF',
        btnRefresh: 'Refresh Status',
        noteResultLabel: 'Study Note Result',
        fallbackTitle: 'Upload Result',
        emptyResult: 'The result screen faithfully mirrors error states without hiding them. Prepare a standard PDF with highlights to process an actual draft.',
        noteHighlightFrom: 'Highlight from Page {{page}}',
        noteSourceLinked: 'Source-linked',
        noteSourceHighlights: 'Source Highlights',
        notePageNum: 'Page {{page}}'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
