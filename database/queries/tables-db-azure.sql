-- DROP SCHEMA IF EXISTS LOG3900DB CASCADE;
-- CREATE SCHEMA LOG3900DB;

DROP TABLE IF EXISTS ChannelConnexion;
DROP TABLE IF EXISTS Message;
DROP TABLE IF EXISTS Channel;
DROP TABLE IF EXISTS Login;
DROP TABLE IF EXISTS Friend;
DROP TABLE IF EXISTS TeamPlayer;
DROP TABLE IF EXISTS Team;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS Expression;
DROP TABLE IF EXISTS VirtualPlayer;
DROP TABLE IF EXISTS Personnality;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS Player;

CREATE TABLE Player(
    idPlayer         	INT IDENTITY 	NOT NULL,
	PRIMARY KEY (idPlayer)
);

CREATE TABLE Person(
    username            VARCHAR(30)     NOT NULL,
    idPlayer            INT             NOT NULL,
    email               VARCHAR(30)     NOT NULL,
    firstName           VARCHAR(30)     NOT NULL,
    lastName            VARCHAR(30)     NOT NULL,
    avatar              INT             NOT NULL,
    gamePlayed          INT             DEFAULT 0,
    winRate             FLOAT           DEFAULT 0.0,
    averageTimePerGame  TIME            NOT NULL,
    totalTimePlayed     TIME            NOT NULL,
    bestScoreSprintSolo INT             NOT NULL,
    likes               INT             NOT NULL,
    dislikes            INT             NOT NULL,
    isConnected         BIT         	NOT NULL,

	PRIMARY KEY (username),
    FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Personnality(
    idPersonnality      INT IDENTITY    NOT NULL,
    personnalityName    VARCHAR(30)     NOT NULL,

	PRIMARY KEY (idPersonnality)
);

CREATE TABLE VirtualPlayer(
    idVirtualPlayer     INT IDENTITY    NOT NULL,
    idPlayer            INT             NOT NULL,
    idPersonnality      INT             NOT NULL,
    playerName          VARCHAR(30)     NOT NULL,

	PRIMARY KEY (idVirtualPlayer),
    FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPersonnality) REFERENCES Personnality(idPersonnality) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Expression(
    idExpression        INT IDENTITY 	NOT NULL,
    idPersonnality      INT             NOT NULL,
    expressionContent   VARCHAR(500)    NOT NULL,

	PRIMARY KEY (idExpression),
    FOREIGN KEY (idPersonnality) REFERENCES Personnality(idPersonnality) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Game(
    idGame              INT IDENTITY    NOT NULL,
    gameTime            DATETIME        NOT NULL,
    gameModeId          INT             NOT NULL,            

	PRIMARY KEY (idGame)
);

CREATE TABLE Team(
    idTeam              INT IDENTITY    NOT NULL,
    idGame              INT             NOT NULL,
    teamScore           INT             NOT NULL,

	PRIMARY KEY (idTeam),
    FOREIGN KEY (idGame) REFERENCES Game(idGame) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE TeamPlayer(
    idTeamPlayer        INT IDENTITY    NOT NULL,
    idTeam              INT             NOT NULL,
    idPlayer            INT             NOT NULL,

	PRIMARY KEY (idTeamPlayer),
    FOREIGN KEY (idTeam) REFERENCES Team(idTeam) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Friend(
    idFriend        	INT IDENTITY    NOT NULL,
    username            VARCHAR(30)     NOT NULL,
    usernameFriend      VARCHAR(30)     NOT NULL,

	PRIMARY KEY (idFriend),
    FOREIGN KEY (username) REFERENCES Person(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Login(
    idLogin             INT IDENTITY    NOT NULL,
    username            VARCHAR(30)     NOT NULL,
    loginTime           DATETIME        NOT NULL,
    isLogin             BIT         	NOT NULL,

	PRIMARY KEY (idLogin),
    FOREIGN KEY (username) REFERENCES Person(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Channel(
    idChannel             INT IDENTITY  NOT NULL,
    channelName           VARCHAR(30)   NOT NULL,

	PRIMARY KEY (idChannel)
);

CREATE TABLE Message(
    idMessage           INT IDENTITY    NOT NULL,
    username            VARCHAR(30)     NOT NULL,
    idChannel           INT             NOT NULL,
    messageContent      VARCHAR(500)    NOT NULL,
    messageTime         DATETIME        NOT NULL,

	PRIMARY KEY (idMessage),
    FOREIGN KEY (username) REFERENCES Person(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idChannel) REFERENCES Channel(idChannel) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ChannelConnexion(
    idChannelConnexion  INT IDENTITY    NOT NULL,
    username            VARCHAR(30)     NOT NULL,
    idChannel           INT             NOT NULL,

	PRIMARY KEY (idChannelConnexion),
    FOREIGN KEY (username) REFERENCES Person(username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idChannel) REFERENCES Channel(idChannel) ON DELETE CASCADE ON UPDATE CASCADE
);