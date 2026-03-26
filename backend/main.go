package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"jones-county-xc/backend/db/sqlc"
)

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

type athleteResponse struct {
	ID     int32  `json:"id"`
	Name   string `json:"name"`
	Grade  int8   `json:"grade"`
	PrTime string `json:"prTime"`
	Events string `json:"events"`
}

type meetResponse struct {
	ID       int32  `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

type resultResponse struct {
	ID          int32  `json:"id"`
	AthleteID   int32  `json:"athleteId"`
	MeetID      int32  `json:"meetId"`
	Time        string `json:"time"`
	Place       int32  `json:"place"`
	AthleteName string `json:"athleteName"`
}

type topTimeResponse struct {
	ID          int32  `json:"id"`
	AthleteID   int32  `json:"athleteId"`
	MeetID      int32  `json:"meetId"`
	Time        string `json:"time"`
	Place       int32  `json:"place"`
	AthleteName string `json:"athleteName"`
	MeetName    string `json:"meetName"`
}

// makeToken returns an HMAC-SHA256 hex token for the given password.
func makeToken(password, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(password))
	return hex.EncodeToString(mac.Sum(nil))
}

// requireAdmin checks the Authorization: Bearer <token> header.
func requireAdmin(secret string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		token := strings.TrimPrefix(auth, "Bearer ")
		password := getenv("ADMIN_PASSWORD", "Hounds2026Admin")
		if token == "" || token != makeToken(password, secret) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			return
		}
		next(w, r)
	}
}

func main() {
	dsn := getenv("DB_DSN", "root:password@tcp(127.0.0.1:3306)/jones_county_xc?parseTime=true")
	conn, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("failed to open db:", err)
	}
	if err := conn.Ping(); err != nil {
		log.Fatal("failed to connect to db:", err)
	}
	log.Println("Connected to MySQL")

	q := db.New(conn)
	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	// GET /api/athletes
	mux.HandleFunc("/api/athletes", func(w http.ResponseWriter, r *http.Request) {
		athletes, err := q.GetAllAthletes(r.Context())
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		resp := make([]athleteResponse, len(athletes))
		for i, a := range athletes {
			resp[i] = athleteResponse{ID: a.ID, Name: a.Name, Grade: a.Grade, PrTime: a.PrTime.String, Events: a.Events.String}
		}
		writeJSON(w, http.StatusOK, resp)
	})

	// GET /api/athletes/{id}
	mux.HandleFunc("/api/athletes/", func(w http.ResponseWriter, r *http.Request) {
		idStr := r.URL.Path[len("/api/athletes/"):]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
			return
		}
		a, err := q.GetAthleteByID(r.Context(), int32(id))
		if err == sql.ErrNoRows {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "athlete not found"})
			return
		}
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, athleteResponse{ID: a.ID, Name: a.Name, Grade: a.Grade, PrTime: a.PrTime.String, Events: a.Events.String})
	})

	// GET /api/meets
	mux.HandleFunc("/api/meets", func(w http.ResponseWriter, r *http.Request) {
		meets, err := q.GetAllMeets(r.Context())
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		resp := make([]meetResponse, len(meets))
		for i, m := range meets {
			resp[i] = meetResponse{ID: m.ID, Name: m.Name, Date: m.Date.Format("2006-01-02"), Location: m.Location.String}
		}
		writeJSON(w, http.StatusOK, resp)
	})

	// GET /api/meets/{id}/results
	mux.HandleFunc("/api/meets/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path[len("/api/meets/"):]
		var idStr string
		for i, c := range path {
			if c == '/' {
				idStr = path[:i]
				break
			}
		}
		if idStr == "" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid path"})
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
			return
		}
		results, err := q.GetMeetResults(r.Context(), int32(id))
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		resp := make([]resultResponse, len(results))
		for i, r := range results {
			resp[i] = resultResponse{ID: r.ID, AthleteID: r.AthleteID, MeetID: r.MeetID, Time: r.Time.String, Place: r.Place.Int32, AthleteName: r.AthleteName}
		}
		writeJSON(w, http.StatusOK, resp)
	})

	// GET /api/results/top
	mux.HandleFunc("/api/results/top", func(w http.ResponseWriter, r *http.Request) {
		times, err := q.ListTopTimes(r.Context())
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		resp := make([]topTimeResponse, len(times))
		for i, t := range times {
			resp[i] = topTimeResponse{ID: t.ID, AthleteID: t.AthleteID, MeetID: t.MeetID, Time: t.Time.String, Place: t.Place.Int32, AthleteName: t.AthleteName, MeetName: t.MeetName}
		}
		writeJSON(w, http.StatusOK, resp)
	})

	// POST /api/results
	mux.HandleFunc("/api/results", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		var params db.CreateResultParams
		if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
			return
		}
		_, err := q.CreateResult(r.Context(), params)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusCreated, map[string]string{"status": "created"})
	})

	adminSecret := getenv("ADMIN_SECRET", "jcxc-secret-key")

	// POST /api/athletes/create
	mux.HandleFunc("/api/athletes/create", requireAdmin(adminSecret, func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		var body struct {
			Name   string `json:"name"`
			Grade  int8   `json:"grade"`
			PrTime string `json:"prTime"`
			Events string `json:"events"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "name is required"})
			return
		}
		var prTime sql.NullString
		if body.PrTime != "" {
			prTime = sql.NullString{String: body.PrTime, Valid: true}
		}
		var events sql.NullString
		if body.Events != "" {
			events = sql.NullString{String: body.Events, Valid: true}
		}
		_, err := q.CreateAthlete(r.Context(), db.CreateAthleteParams{
			Name:   body.Name,
			Grade:  body.Grade,
			PrTime: prTime,
			Events: events,
		})
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusCreated, map[string]string{"status": "created"})
	}))

	// DELETE /api/athletes/{id}
	mux.HandleFunc("/api/athletes/delete/", requireAdmin(adminSecret, func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		idStr := r.URL.Path[len("/api/athletes/delete/"):]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
			return
		}
		if err := q.DeleteAthlete(r.Context(), int32(id)); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
	}))

	// POST /api/meets/create
	mux.HandleFunc("/api/meets/create", requireAdmin(adminSecret, func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		var body struct {
			Name     string `json:"name"`
			Date     string `json:"date"`
			Location string `json:"location"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" || body.Date == "" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "name and date are required"})
			return
		}
		date, err := time.Parse("2006-01-02", body.Date)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "date must be YYYY-MM-DD"})
			return
		}
		var location sql.NullString
		if body.Location != "" {
			location = sql.NullString{String: body.Location, Valid: true}
		}
		_, err = q.CreateMeet(r.Context(), db.CreateMeetParams{
			Name:     body.Name,
			Date:     date,
			Location: location,
		})
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusCreated, map[string]string{"status": "created"})
	}))

	// DELETE /api/meets/{id}
	mux.HandleFunc("/api/meets/delete/", requireAdmin(adminSecret, func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		idStr := r.URL.Path[len("/api/meets/delete/"):]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id"})
			return
		}
		if err := q.DeleteMeet(r.Context(), int32(id)); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
	}))

	// POST /api/admin/login
	mux.HandleFunc("/api/admin/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		var body struct {
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Password == "" {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "password required"})
			return
		}
		adminPassword := getenv("ADMIN_PASSWORD", "Hounds2026Admin")
		if body.Password != adminPassword {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid password"})
			return
		}
		token := makeToken(body.Password, adminSecret)
		writeJSON(w, http.StatusOK, map[string]string{"token": token})
	})

	// GET /api/admin/me — example protected route to verify token
	mux.HandleFunc("/api/admin/me", requireAdmin(adminSecret, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"role": "admin"})
	}))

	log.Println("Backend running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", corsMiddleware(mux)))
}
