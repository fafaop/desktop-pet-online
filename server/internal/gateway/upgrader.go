package gateway

import (
	"net/http"
)

// UpgradeWebSocket upgrades HTTP connection to websocket.
func UpgradeWebSocket(w http.ResponseWriter, r *http.Request) error {
	// TODO integrate websocket.Upgrader
	return nil
}
