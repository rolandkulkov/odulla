package models

type App struct {
	ID         uint   `gorm:"primaryKey"`
	Name       string `gorm:"unique"`
	Image      string
	Repository string
	Tag        string
}
