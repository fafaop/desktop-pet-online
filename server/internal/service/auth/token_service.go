package auth

import "time"

// GenerateToken creates a simple demo token.
func GenerateToken(userID int64) string {
	return "token-" + time.Now().Format("20060102150405")
}
