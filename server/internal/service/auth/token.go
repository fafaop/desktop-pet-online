package auth

import "fmt"

func GenerateToken(userID int64) string {
	return fmt.Sprintf("token-%d", userID)
}
