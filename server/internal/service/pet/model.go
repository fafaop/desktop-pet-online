package pet

// State represents synchronized pet state.
type State struct {
	Name string `json:"name"`
	Mood string `json:"mood"`
	Action string `json:"action"`
	Level int `json:"level"`
}
