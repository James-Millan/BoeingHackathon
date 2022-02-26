DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Pins;
DROP TABLE IF EXISTS Tags;
DROP TABLE IF EXISTS Contributions;
DROP TABLE IF EXISTS PinLikes;
DROP TABLE IF EXISTS ContributionLikes;
DROP TABLE IF EXISTS PinTags;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL
);

CREATE TABLE Pins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    long FLOAT NOT NULL,
    lat FLOAT NOT NULL,
    pinName VARCHAR(128) NOT NULL
);

CREATE TABLE Tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tagname VARCHAR(128) UNIQUE NOT NULL,
    label VARCHAR(1024)  
);

CREATE TABLE Contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    pinID INTEGER,
    content VARCHAR(1024) NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (pinID) REFERENCES Pins(id)
);

CREATE TABLE PinLikes (
    userID INTEGER,
    pinID INTEGER,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (pinID) REFERENCES Pins(id)
);

CREATE TABLE ContributionLikes (
    userID INTEGER,
    contribID INTEGER,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (contribID) REFERENCES Contributions(id)
);

CREATE TABLE PinTags (
    pinID INTEGER,
    tagID INTEGER,
    FOREIGN KEY (pinID) REFERENCES Pins(id),
    FOREIGN KEY (tagID) REFERENCES Tags(id)
);