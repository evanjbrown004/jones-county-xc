-- name: GetMeetResults :many
SELECT r.id, r.athlete_id, r.meet_id, r.time, r.place,
       a.name AS athlete_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
WHERE r.meet_id = ?
ORDER BY r.place;

-- name: ListTopTimes :many
SELECT r.id, r.athlete_id, r.meet_id, r.time, r.place,
       a.name AS athlete_name,
       m.name AS meet_name
FROM results r
JOIN athletes a ON r.athlete_id = a.id
JOIN meets m ON r.meet_id = m.id
ORDER BY r.time ASC
LIMIT 10;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?);
