"use strict";

const {createDBconnection} = require('./src/database/db');

require('dotenv').config();

const dbName = process.env.DATABASE;

async function createDB() {

    let connection;

    try {
    connection = await createDBconnection();
    
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);

    await connection.query(`CREATE DATABASE ${dbName}`);

    await connection.query(`USE ${dbName}`);


    //USERS
    await connection.query(
        `
        CREATE TABLE IF NOT EXISTS users(
            id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
            user_name VARCHAR(40) UNIQUE NOT NULL,
            email VARCHAR(256) UNIQUE NOT NULL,
            pwd VARCHAR(512) NOT NULL,
            avatar VARCHAR(100),
            biography VARCHAR(3000),
            link_twitter VARCHAR(200),
            link_youtube VARCHAR(200),
            link_insta VARCHAR(200),
            link_ttv VARCHAR(200),
            created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            active_user BOOLEAN DEFAULT FALSE,
            user_role ENUM("admin", "user") DEFAULT "user" NOT NULL,
            user_badge ENUM("Genin","Chūnin","Jōnin","ANBU","Sannin","Kage") DEFAULT "Genin" NOT NULL,
            reg_code CHAR(36),
            deleted BOOLEAN DEFAULT FALSE,
            last_auth_update DATETIME,
            recover_code CHAR(36),
            banned BOOLEAN DEFAULT FALSE            
        );
        `
    );

    //ENTRIES
    await connection.query(
        `
        CREATE TABLE IF NOT EXISTS entries(
            id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
            create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            banned BOOLEAN DEFAULT FALSE,
            last_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            edited BOOLEAN DEFAULT FALSE,
            title VARCHAR(100) NOT NULL,
            content VARCHAR(10000) NOT NULL,
            anime_character VARCHAR (100),
            category ENUM(
                "Recomendaciones", "Teorías", "FanArt",
                "Openings", "Cosplays", "Memes"
            ) NOT NULL,
            genre ENUM(
                "Acción", "Aventura", "Deportes",
                "Comedia", "Drama", "Fantasía",
                "Musical","Romance", "Ciencia-ficción",
                "Sobrenatural", "Thriller", "Terror",
                "Psicológico", "Infantil"
            ) NOT NULL,
            video_url VARCHAR(3000),
            user_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        `
    );

    //PHOTOS
    await connection.query(
        `
        CREATE TABLE IF NOT EXISTS photos(
            id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
            photo VARCHAR (1000),
            photo_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            entry_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (entry_id) REFERENCES entries(id)
        );
        `
    );

    //COMMENTS
    await connection.query(
        `
        CREATE TABLE IF NOT EXISTS comments(
            id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
            comment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            content VARCHAR(5000) NOT NULL,
            banned BOOLEAN DEFAULT FALSE,
            edited BOOLEAN DEFAULT FALSE,
            user_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            entry_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (entry_id) REFERENCES entries(id)
        );
        `
    );

    //VOTES
    await connection.query(
        `
        CREATE TABLE IF NOT EXISTS votes(
            id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
            vote_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            vote_entry BOOLEAN DEFAULT FALSE,
            vote_comment BOOLEAN DEFAULT FALSE,
            user_id INT UNSIGNED NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            entry_id INT UNSIGNED,
            FOREIGN KEY (entry_id) REFERENCES entries(id),
            comment_id INT UNSIGNED,
            FOREIGN KEY (comment_id) REFERENCES comments(id)
        );
        `
    ); 

    //REPORTS
    await connection.query(
    `
    CREATE TABLE IF NOT EXISTS reports(
        id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
        report_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        report_entry BOOLEAN DEFAULT FALSE,
        report_comment BOOLEAN DEFAULT FALSE,
        report_user INT DEFAULT NULL,
        report_type ENUM(
            "acoso", "incitacion al odio", "contenido sexual",
            "apologia del terrorismo", "estafa", "suplantacion de identidad",
            "otros"
        )NOT NULL,
        report_content VARCHAR(2000),
        user_id INT UNSIGNED,
        FOREIGN KEY (user_id) REFERENCES users(id),
        entry_id INT UNSIGNED,
        FOREIGN KEY (entry_id) REFERENCES entries(id),
        comment_id INT UNSIGNED,
        FOREIGN KEY (comment_id) REFERENCES comments(id)
    );
    `
    );

    console.log(`Si existía una base de datos con el mismo nombre se ha eliminado. Además, se ha creado una nueva base de datos con el nombre "${dbName}" y sus correspondientes tablas (completamente vacías).`);

    }catch(e){

        console.log(e);

    }finally{

        if (connection){
            connection.release();
        }

        process.exit();

    }

}

createDB();
