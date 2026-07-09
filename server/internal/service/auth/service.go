package auth

// Service handles user authentication.
type Service struct {
}

func (s *Service) Login(username string, password string) bool {
	return username != "" && password != ""
}
