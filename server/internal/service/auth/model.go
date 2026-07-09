package auth

// LoginRequest represents client login data.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse represents login result.
type LoginResponse struct {
	Success bool   `json:"success"`
	Token   string `json:"token"`
	UserID  int64  `json:"userId"`
}
