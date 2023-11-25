package models

type App struct {
	ID         uint   `gorm:"primaryKey"`
	Name       string `gorm:"unique"`
	Repository string
	Tag        string
}
