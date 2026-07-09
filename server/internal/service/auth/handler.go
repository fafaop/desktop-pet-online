package auth

func HandleLogin(req LoginRequest) LoginResponse {
	if req.Username == "demo" && req.Password == "123456" {
		return LoginResponse{
			Code:   0,
			UserID: 10001,
			Token:  GenerateToken(10001),
		}
	}

	return LoginResponse{Code: 1}
}
