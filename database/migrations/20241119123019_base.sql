-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS project(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL,
    unsubscribe_url_template VARCHAR(100) NOT NULL,
    unsubscribe_url_method VARCHAR(4) NOT NULL,

    metadata JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
) ENGINE=InnoDB;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS template(
    id INT NOT NULL AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(64) NOT NULL,
    version VARCHAR(6) NOT NULL DEFAULT "v1.0.0", -- semver
    html TEXT,

    -- override fields
    sender VARCHAR(64),
    subject VARCHAR(64),

    metadata JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS user(
    -- users are a unique relationship between project and userId
    -- this allows for the same user to have different preferences for different apps

    email VARCHAR(128) NOT NULL,
    project_id INT NOT NULL,
    name VARCHAR(100),

    notification_all TINYINT(1) NOT NULL DEFAULT 1,
    notification_marketing TINYINT NOT NULL DEFAULT 1,

    metadata JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (email, project_id),
    FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS email(
    id VARCHAR(36) NOT NULL, -- from resend
    recipient VARCHAR(128) NOT NULL,
    project_id INT NOT NULL,
    template_id INT NOT NULL,

    attributes JSON,
    subject TEXT NOT NULL,
    cc TEXT,
    bcc TEXT,
    scheduled_at TEXT,
    tags TEXT,

    metadata JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    FOREIGN KEY (recipient, project_id) REFERENCES user (email, project_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES template (id) ON DELETE CASCADE
) ENGINE=InnoDB;
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO project (
    id, title, unsubscribe_url_template, unsubscribe_url_method
) VALUES (
    1, 'Workout Notepad', 'https://emails.sapphirenw.co/${email}/1/unsubscribe', 'POST'
);
-- +goose StatementEnd

-- +goose StatementBegin
INSERT INTO template (
    project_id, title, sender, subject
) VALUES (
    1, 'Welcome to Workout Notepad', 'Workout Notepad <support@workoutnotepad.co>', 'Welcome to Workout Notepad'
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS email;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE IF EXISTS user;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE IF EXISTS template;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE IF EXISTS project;
-- +goose StatementEnd
