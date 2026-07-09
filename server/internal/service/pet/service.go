package pet

// Service manages pet state synchronization.
type Service struct {
}

func (s *Service) Sync(userID int64, state string) error {
	return nil
}
