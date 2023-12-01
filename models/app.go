package models

type App struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"unique"`
	Image       string
	ContainerID string
	Tag         string
	UserID      int
}
