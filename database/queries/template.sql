-- name: CreateTemplate :exec
INSERT INTO template (
    project_id, title, version, html, sender, subject, metadata
) VALUES (
    ?,?,?,?,?,?,?
);

-- name: GetTemplates :many
SELECT * FROM template;

-- name: GetProjectTemplates :many
SELECT * FROM template
WHERE project_id = ?;

-- name: GetTemplate :one
SELECT * FROM template
WHERE id = ?;