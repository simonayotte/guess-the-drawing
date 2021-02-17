-- Pas d'héritage avec les FK: https://stackoverflow.com/questions/58541643/postgres-inheritance-and-foreign-keys-or-alternative
SET search_path = LOG3900DB;

DROP SCHEMA IF EXISTS LOG3900DB CASCADE;
CREATE SCHEMA LOG3900DB;

CREATE TABLE IF NOT EXISTS Player(
	idPlayer         	SERIAL 			NOT NULL,
	username            VARCHAR(30)     NOT NULL,
	isVirtualPlayer		BOOLEAN			DEFAULT 'false',
	
	PRIMARY KEY (idPlayer)
);

CREATE TABLE IF NOT EXISTS Person(
	idPlayer         	INT				NOT NULL,
	idSocket			VARCHAR(30)		DEFAULT '',
	password         	VARCHAR(30)		NOT NULL,
    email               VARCHAR(30)     DEFAULT '',
    firstName           VARCHAR(30)     DEFAULT '',
    lastName            VARCHAR(30)     DEFAULT '',
    avatar              INT             DEFAULT 0,
    gamePlayed          INT             DEFAULT 0, -- number of
    winRate             FLOAT           DEFAULT 0.0,
    averageTimePerGame  INTERVAL        DEFAULT '0M0S', -- 0 minutes 0 secondes
    totalTimePlayed     INTERVAL        DEFAULT '0M0S',
    bestScoreSprintSolo INT             DEFAULT 0,
    likes               INT             DEFAULT 0, -- number of
    dislikes            INT             DEFAULT 0, -- number of
    isConnected         BOOLEAN        	DEFAULT '0', -- true if connected, false if disconnected
	
	FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Personnality(
    idPersonnality      SERIAL 			NOT NULL,
    personnalityName    VARCHAR(30)     NOT NULL,

	PRIMARY KEY (idPersonnality)
);

CREATE TABLE IF NOT EXISTS VirtualPlayer(
	idPlayer         	INT 			NOT NULL,
    idPersonnality      INT             NOT NULL,
	
	FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPersonnality) REFERENCES Personnality(idPersonnality) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Expression(
    idExpression        SERIAL 			NOT NULL,
    idPersonnality      INT             NOT NULL,
    expressionContent   VARCHAR(500)    DEFAULT '',

	PRIMARY KEY (idExpression),
    FOREIGN KEY (idPersonnality) REFERENCES Personnality(idPersonnality) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Game(
    idGame              SERIAL 			NOT NULL,
    gameDate           	TIMESTAMP		WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    gameModeId          INT             DEFAULT 0,  
	difficultyLevel		INT				DEFAULT 0,

	PRIMARY KEY (idGame)
);

CREATE TABLE IF NOT EXISTS Team(
    idTeam              SERIAL 			NOT NULL,
    idGame              INT             NOT NULL,
    teamScore           INT             DEFAULT 0,

	PRIMARY KEY (idTeam),
    FOREIGN KEY (idGame) REFERENCES Game(idGame) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS TeamPlayer(
    idTeamPlayer        SERIAL 			NOT NULL,
    idTeam              INT             NOT NULL,
    idPlayer            INT             NOT NULL,

	PRIMARY KEY (idTeamPlayer),
    FOREIGN KEY (idTeam) REFERENCES Team(idTeam) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Friendship(
    idFriendship        SERIAL 			NOT NULL,
	idPlayer1           INT     		NOT NULL,
    idPlayer2      		INT     		NOT NULL,

	PRIMARY KEY (idFriendship),
	FOREIGN KEY (idPlayer1) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (idPlayer2) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Login(
    idLogin             SERIAL 			NOT NULL,
	idPlayer			INT				NOT NULL,
    loginDate           TIMESTAMP		WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isLogin             BOOLEAN        	DEFAULT '1', -- true if login, false if logout

	PRIMARY KEY (idLogin),
	FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Channel(
    channelName         VARCHAR(30)   	NOT NULL,

	PRIMARY KEY (channelName)
);

CREATE TABLE IF NOT EXISTS Message(
    idMessage           SERIAL 			NOT NULL,
	idPlayer			INT				NOT NULL,
    channelName         VARCHAR(30)   	NOT NULL,
    messageContent      VARCHAR(500)    DEFAULT '',
    messageDate         TIMESTAMP		WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY (idMessage),
	FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (channelName) REFERENCES Channel(channelName) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ChannelConnexion(
    idChannelConnexion  SERIAL 			NOT NULL,
	idPlayer			INT				NOT NULL,
    channelName         VARCHAR(30)   	NOT NULL,

	PRIMARY KEY (idChannelConnexion),
    FOREIGN KEY (idPlayer) REFERENCES Player(idPlayer) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (channelName) REFERENCES Channel(channelName) ON DELETE CASCADE ON UPDATE CASCADE
);