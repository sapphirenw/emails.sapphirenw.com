-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS email_event(
    id INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL,
    email_id VARCHAR(36) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (email_id) REFERENCES email (id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS email_event;
-- +goose StatementEnd
