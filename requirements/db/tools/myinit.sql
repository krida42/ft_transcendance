\connect database_development

-- Création de l'utilisateur avec les variables d'environnement
-- CREATE USER $DB_USER WITH PASSWORD $DB_PASSWORD;

-- Attribution des privilèges à la base de données avec les variables d'environnement
-- GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Attribution des privilèges aux schémas avec les variables d'environnement
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $DB_USER;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- CREATE TABLE users (
--     confidential_id SERIAL PRIMARY KEY,
--     public_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     pseudo VARCHAR(255) UNIQUE NOT NULL,
--     display_name VARCHAR(255) NOT NULL
-- );

-- CREATE TABLE friendship (
--     requester_id INT,
--     requested_id INT,
--     status VARCHAR(10) CHECK( status IN ('PENDING', 'ACCEPTED', 'BLOCKED') ),
--     PRIMARY KEY (requester_id, requested_id),
--     FOREIGN KEY (requester_id) REFERENCES users(confidential_id) ON DELETE CASCADE,
--     FOREIGN KEY (requested_id) REFERENCES users(confidential_id) ON DELETE CASCADE
-- );
