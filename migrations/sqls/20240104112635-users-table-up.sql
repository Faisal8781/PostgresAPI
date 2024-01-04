CREATE TABLE users (
    id SERIAL PRIMARY  KEY,
    firstName VARCHAR(200) NOT NULL,
    lastName VARCHAR(200) NOT NULL,
    password VARCHAR NOT NULL
);