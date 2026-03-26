-- name: GetAllAthletes :many
SELECT id, name, grade, pr_time, events FROM athletes;

-- name: GetAthleteByID :one
SELECT id, name, grade, pr_time, events FROM athletes
WHERE id = ?;

-- name: CreateAthlete :execresult
INSERT INTO athletes (name, grade, pr_time, events)
VALUES (?, ?, ?, ?);

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;
