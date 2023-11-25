package database

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// User model
type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
}

var GlobalDB *gorm.DB

func InitDB() {
	dsn := "odulla:password@tcp(localhost:3306)/odulla?parseTime=true"
	var err error
	GlobalDB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Auto migrate the User model
	err = GlobalDB.AutoMigrate(&User{})
	if err != nil {
		log.Fatal(err)
	}
}
