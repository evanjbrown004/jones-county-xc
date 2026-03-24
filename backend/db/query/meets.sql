-- name: GetAllMeets :many
SELECT id, name, date, location FROM meets
ORDER BY date ASC;
