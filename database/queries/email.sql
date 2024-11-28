-- name: CreateEmail :exec
INSERT INTO email (
    id, recipient, project_id, template_id, attributes,
    subject, cc, bcc, scheduled_at, tags
) VALUES (
    ?,?,?,?,?,?,?,?,?,?
);

-- name: GetEmail :one
SELECT * FROM email
WHERE id = ?;

-- name: GetEmailsByUserProject :one
SELECT
    sqlc.embed(u),
    sqlc.embed(e)
FROM user as u
JOIN email e ON u.email = e.recipient AND u.project_id = e.project_id
WHERE u.email = ? AND u.project_id = ?;
