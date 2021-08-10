CREATE DATABASE pernshoes;

CREATE TABLE shoes(
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    price FLOAT
);