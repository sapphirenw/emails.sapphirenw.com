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

-- name: GetEmailAndUser :one
SELECT
    sqlc.embed(e),
    sqlc.embed(u)
FROM email e
JOIN user u ON e.recipient = u.email
WHERE e.id = ?;

-- name: GetEmailsByUserProject :one
SELECT
    sqlc.embed(u),
    sqlc.embed(e)
FROM user as u
JOIN email e ON u.email = e.recipient AND u.project_id = e.project_id
WHERE u.email = ? AND u.project_id = ?;

-- name: CreateEmailEvent :exec
INSERT INTO email_event (
    type, created_at, email_id
) VALUES (?,?,?);

-- name: GetEmailEvents :many
SELECT * FROM email_event
WHERE email_id = ?;