CREATE TABLE IF NOT EXISTS documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    public_id VARCHAR(36) NOT NULL UNIQUE,
    original_file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    page_count INT NOT NULL DEFAULT 0,
    highlight_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS note_jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL,
    message TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_jobs_document
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS highlights (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    page_number INT NOT NULL,
    excerpt_text TEXT NOT NULL,
    bound_x DOUBLE NULL,
    bound_y DOUBLE NULL,
    bound_width DOUBLE NULL,
    bound_height DOUBLE NULL,
    ordinal_index INT NOT NULL,
    CONSTRAINT fk_highlights_document
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    source_page INT NOT NULL,
    heading VARCHAR(255) NOT NULL,
    summary_text TEXT NOT NULL,
    bullet_lines TEXT NOT NULL,
    section_order INT NOT NULL,
    CONSTRAINT fk_note_sections_document
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    format_type VARCHAR(16) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exports_document
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX idx_highlights_document_order ON highlights(document_id, ordinal_index);
CREATE INDEX idx_note_sections_document_order ON note_sections(document_id, section_order);
CREATE INDEX idx_exports_document_created ON exports(document_id, created_at);
