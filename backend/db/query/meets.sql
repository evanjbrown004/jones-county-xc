-- name: GetAllMeets :many
SELECT id, name, date, location FROM meets
ORDER BY date ASC;

-- name: CreateMeet :execresult
INSERT INTO meets (name, date, location)
VALUES (?, ?, ?);

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;
