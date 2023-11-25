package database

import (
	"docker-deployer/models"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var GlobalDB *gorm.DB

func InitDB() {
	dsn := "odulla:password@tcp(localhost:3306)/odulla?parseTime=true"
	var err error
	GlobalDB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Auto migrate the User model
	err = GlobalDB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal(err)
	}
}
