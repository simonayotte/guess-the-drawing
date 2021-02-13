SET search_path = LOG3900DB;

INSERT INTO Player(username) VALUES ('failix');
INSERT INTO Player(username) VALUES ('sammypoush');
INSERT INTO Player(username) VALUES ('yves420');
INSERT INTO Player(username) VALUES ('jaykot');

INSERT INTO Person(idPlayer, password, email, firstName, lastName)
	SELECT idPlayer, '123','fd@polymtl.ca', 'felix', 'dumont'
	FROM Player
	WHERE username = 'failix';
INSERT INTO Person(idPlayer, password, email, firstName, lastName)
	SELECT idPlayer, '123','sp@polymtl.ca', 'samuel', 'pierre'
	FROM Player
	WHERE username = 'sammypoush';
INSERT INTO Person(idPlayer,password, email, firstName, lastName)
	SELECT idPlayer, '123','yb@polymtl.ca', 'yves', 'boudreault'
	FROM Player
	WHERE username = 'yves420';
INSERT INTO Person(idPlayer,password, email, firstName, lastName)
	SELECT idPlayer, '123','jk@polymtl.ca', 'jerome', 'kotlin'
	FROM Player
	WHERE username = 'jaykot';

INSERT INTO Personnality(personnalityName) VALUES ('cocky');
INSERT INTO Personnality(personnalityName) VALUES ('impatient');

INSERT INTO Player(username, isVirtualPlayer) VALUES ('elonMusk69', 'true');
INSERT INTO Player(username, isVirtualPlayer) VALUES ('billGates19', 'true');
INSERT INTO Player(username, isVirtualPlayer) VALUES ('nickyMinaj', 'true');

INSERT INTO VirtualPlayer(idPlayer, idPersonnality)
	SELECT idPlayer, 1
	FROM Player
	WHERE username = 'elonMusk69';
INSERT INTO VirtualPlayer(idPlayer, idPersonnality)
	SELECT idPlayer, 1
	FROM Player
	WHERE username = 'billGates19';
INSERT INTO VirtualPlayer(idPlayer, idPersonnality)
	SELECT idPlayer, 2
	FROM Player
	WHERE username = 'nickyMinaj';

INSERT INTO Expression(idPersonnality, expressionContent) VALUES (1, 'Je suis meilleurs que vous bande de pas bons');
INSERT INTO Expression(idPersonnality, expressionContent) VALUES (2, 'TES BIN LENT, CEST LONG!!!');

INSERT INTO Game(gameModeId, difficultyLevel) VALUES (1, 3);

INSERT INTO Team(idGame) VALUES (1);
INSERT INTO Team(idGame) VALUES (1);

INSERT INTO TeamPlayer(idTeam, idPlayer) VALUES (1, 1);
INSERT INTO TeamPlayer(idTeam, idPlayer) VALUES (1, 2);
INSERT INTO TeamPlayer(idTeam, idPlayer) VALUES (2, 3);
INSERT INTO TeamPlayer(idTeam, idPlayer) VALUES (2, 6);

INSERT INTO Friendship(idPlayer1, idPlayer2) VALUES (1, 2);
INSERT INTO Friendship(idPlayer1, idPlayer2) VALUES (2, 3);

INSERT INTO Login(idPlayer) VALUES (1);
INSERT INTO Login(idPlayer) VALUES (1);
INSERT INTO Login(idPlayer) VALUES (2);

INSERT INTO Channel(channelName) VALUES ('ganggangchannel');
INSERT INTO Channel(channelName) VALUES ('wasspoppin');

INSERT INTO Message(idChannel,idPlayer, messageContent) VALUES (1,1,'yoo ca va');
INSERT INTO Message(idChannel,idPlayer, messageContent) VALUES (1,2,'ouais kesspass je suis chevalier de lordre du quebec');
INSERT INTO Message(idChannel,idPlayer, messageContent) VALUES (1,1,'yoo geee cest fouuww');
INSERT INTO Message(idChannel,idPlayer, messageContent) VALUES (2,3,'Bonjour, je suis un genie');
INSERT INTO Message(idChannel,idPlayer, messageContent) VALUES (2,4,'je suis elon musk s3xy');

INSERT INTO ChannelConnexion(idChannel,idPlayer) VALUES (2,3);
INSERT INTO ChannelConnexion(idChannel,idPlayer) VALUES (2,4);
INSERT INTO ChannelConnexion(idChannel,idPlayer) VALUES (1,1);
INSERT INTO ChannelConnexion(idChannel,idPlayer) VALUES (1,2);