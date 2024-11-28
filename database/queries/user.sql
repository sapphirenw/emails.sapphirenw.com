-- name: CreateUser :exec
INSERT INTO user (
    project_id, email, name
) VALUES ( ?,?,? );

-- name: GetUser :one
SELECT * FROM user
WHERE email = ?;

-- name: GetUserProject :one
SELECT * FROM user
WHERE email = ? AND project_id = ?;

-- name: UserUnsubscribe :exec
UPDATE user
    SET notification_all = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE email = ? AND project_id = ?;

-- name: UserUnsubscribeMarketing :exec
UPDATE user
    SET notification_marketing = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE email = ? AND project_id = ?;