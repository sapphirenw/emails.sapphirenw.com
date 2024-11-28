-- name: CreateProject :exec
INSERT INTO project (
    title, metadata
) VALUES (?,?);

-- name: GetProjects :many
SELECT * FROM project;

-- name: GetProject :one
SELECT * FROM project
WHERE id = ?;