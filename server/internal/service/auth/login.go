package auth

// LoginRequest represents client login data.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse represents login result.
type LoginResponse struct {
	Code   int    `json:"code"`
	UserID int64  `json:"userId"`
	Token  string `json:"token"`
}
