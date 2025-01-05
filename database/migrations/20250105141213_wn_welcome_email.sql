-- +goose Up
-- +goose StatementBegin
INSERT INTO template (
    id, project_id, title, sender
) VALUES (
    2,
    1,
    'How are things going?',
    'support@workoutnotepad.co'
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM template WHERE id = 2;
-- +goose StatementEnd
