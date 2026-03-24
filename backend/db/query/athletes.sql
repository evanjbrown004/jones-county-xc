-- name: GetAllAthletes :many
SELECT id, name, grade, pr_time, events FROM athletes;

-- name: GetAthleteByID :one
SELECT id, name, grade, pr_time, events FROM athletes
WHERE id = ?;
