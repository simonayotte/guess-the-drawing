package com.example.client_leger.tutorial.model

import com.example.client_leger.R

class TutorialData {

    companion object{
        fun createDataSet(): ArrayList<TutorialModel>{
            val list = ArrayList<TutorialModel>()
            list.add(
                TutorialModel(
                    "Bienvenue dans le guide de l'utilisateur de Fais moi un dessin",
                    "Pour visionner une section du guide en particulier, utilisez la barre de navigation à gauche.\n" +
                            "Pour visionner les sections précédentes et suivantes, utilisez les boutons Précédent et Suivant au bas de la page.\n" +
                            "Pour revenir où vous étiez précédement, utilisez le bouton Retour.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Se connecter",
                    "À l'entrée de l'application, vous aurez la possibilité de vous connecter ou de vous inscrire.\n" +
                    "Pour vous connecter, insérez votre pseudo ainsi que votre mot de passe.\n" +
                    "Pour vous inscrire, appuyez tout simplement sur le bouton S'inscrire.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "S'inscrire",
                    "Ici, vous pourrez créer un nouveau compte.\n" +
                    "Pour créer un nouveau compte, insérez votre pseudo, votre adresse courriel ainsi que votre mot de passe.\n" +
                    "Pour retourner à la page de connexion, appuyez tout simplement sur le bouton Se connecter.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Menu principal",
                    "Vous arrivez sur le menu principal, ce dernier vous permet d'exécuter plusieurs actions et de naviguer dans l'application.\n" +
                    "1. Déconnexion: Veuillez appuyer ici pour vous déconnecter.\n" +
                    "2. Tutoriel: Vous pouvez revisionner le tutoriel à tout moment en appuyant sur cette icone.\n" +
                    "3. Profil: Vous pouvez voir votre profil contenant toutes vos informations et vos statistiques.\n" +
                    "4. Classement: Vous pouvez voir le classement mondial de l'application, les meilleurs joueurs et leurs points.\n" +
                    "5. Créer un salons: Vous pourrez créer un nouveau salon si vous le désirez, un salon permet d'établir les règles d'une partie ainsi que les participants.\n" +
                    "6. Salons: Vous avez accès à une liste de salons, vous pouvez joindre celui que vous voulez.\n" +
                    "7. Salle d'attente: Vous verrez les paramètres du salon choisi ici au centre de l'écran.\n" +
                    "8. Difficulté: Il existe trois difficultés (facile, intermédiaire et difficile).\n" +
                    "9. Canaux: Vous pourrez choisir des canaux de discussion, en chercher, en joindre, en créer ou en quitter.\n" +
                    "10. Clavardage: Une fois dans un canal de discussion, vous pourrez clavarder avec tous les membres du canal. \n" +
                    "11. Paire mot-image (client-lourd seulement): Vous pouvez créer un dessin avec un nom et des indices. Il sera utilisé dans les parties de la difficultée correspondante.",
                    R.drawable.menuprincipal,
                )
            )
            list.add(
                TutorialModel(
                    "Salons",
                    "Vous verrez à gauche tous les salons avec le nombre de joueurs dans ce salon et son mode de jeu.\n" +
                    "Il est possible de naviguer dans les salons ou d'en créer un nouveau.\n" +
                    "1. Créer un salon.\n" +
                    "2. Joindre un salon.\n" +
                    "3. Commencer une partie (il est possible de commencer une partie uniquement si le nombre minimum de joueur est atteint).\n" +
                    "4. Quitter un salon.",
                    R.drawable.salon,
                )
            )
            list.add(
                TutorialModel(
                    "Canaux de discussion",
                    "Vous verrez à droite vos canaux de discussion, il est possible de clavarder avec tous les membres qui en font partie.\n" +
                    "Le mode fenêtré est aussi disponible pour les modes de discussion.\n" +
                    "1. Joindre un canal s'il existe, sinon en créer un nouveau.\n" +
                    "2. Ouvrir le fil de discussion du canal.\n" +
                    "3. Quitter le canal.",
                    R.drawable.canaux,
                )
            )
            list.add(
                TutorialModel(
                    "Clavardage",
                    "Une fois dans un fil de discussion, vous pouvez clavarder avec les autres joueurs.\n" +
                    "1. Envoyer un message (on peut utiliser enter aussi).\n" +
                    "2. Retourner à la liste de canaux. \n" +
                    "3. Mode fenêtré (client-lourd seulement).",
                    R.drawable.chat,
                )
            )
            list.add(
                TutorialModel(
                    "Tableau de jeu",
                    "Une fois dans un fil de discussion, vous pouvez clavarder avec les autres joueurs.\n" +
                            "1. Envoyer un message (on peut utiliser enter aussi).\n" +
                            "2. Retourner à la liste de canaux.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Crayon",
                    "Cet outil permet de faire de simples traits. \n" +
                    "On peut configurer l'épaisseur de son trait en pixels ainsi que sa couleur.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Sélecteur de couleurs",
                    "Cet outil permet de choisir la couleur du crayon.\n" +
                    "Il est possible de choisir parmi les 9 dernières couleurs utilisées.\n" +
                    "Il est possible de choisir une toute nouvelle couleur.\n" +
                    "Il est possible de choisir la transparence de la couleur.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Efface",
                    "Cet outil permet de supprimer des objets de la surface de dessin.\n" +
                    "Tout objet se trouvant en contact avec l'efface lors d’un clic gauche est effacé.\n" +
                    "L'objet effacé est toujours celui au-dessus des autres objets.\n" +
                    "On peut également se servir de l'efface comme d'une brosse en maintenant le bouton gauche de la souris enfoncé.\n" +
                    "Tout objet qui entre en contact avec le pointeur de la souris est alors supprimé.\n" +
                    "Si le pointeur survole un objet, sans qu'il n'y ait de clic, alors l'objet survolé a un contour rouge.\n" +
                    "On peut configurer la taille de l'efface en pixels, soit la taille du carré qui représente l'efface.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Grille",
                    "Cela permet d'afficher une grille superposée à la surface de dessin et à son contenu.\n" +
                    "Il est possible d'activer ou de désactiver la grille et de lui assigner une valeur de transparence.\n" +
                    "Il est aussi possible de définir la taille en pixels des carrés de la grille.\n" +
                    "La grille n'est pas présente lorsque le dessin est sauvegardé sur le serveur, exporté ou envoyé par courriel.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Annuler-refaire",
                    "Cela permet d'annuler une action altérant le dessin faite par l'utilisateur en commençant par la dernière exécutée.\n" +
                    "Cela permet également de refaire ce qui a été annulé, en commençant par la dernière action annulée. \n" +
                    "Dès qu'une nouvelle action est exécutée, la pile des actions annulées est supprimée. \n" +
                    "Cette fonctionnalité ne tient pas compte du presse-papier sauf pour un détail: la valeur de décalage lors d'un coller. \n" +
                    "Si une action annulée ou refaite comportait une modification de la valeur de décalage, celle-ci doit être appliquée à l'inverse. \n" +
                    "Cette fonctionnalité est accessible par des boutons sur l'écran et des raccourcis clavier.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Mode de jeu classique",
                    "Le mode de jeu classique se joue à 4 personnes. Un minimum de deux joueurs réels est requis.\n" +
                    "Les joueurs manquants seront remplacés par des joueurs virtuels.\n" +
                    "Ce mode de jeu se joue en équipe de deux et chaque équipe joue une après l'autre.\n" +
                    "DÉBUT DE MANCHE:\n" +
                    "L'équipe qui commence la manche est composée d'un artiste et d'un devineur.\n" +
                    "L'artiste reçoit un mot à dessiner puis il se met à l'oeuvre.\n" +
                    "Son cohéquipier se doit de deviner le mot dans le temps imparti.\n" +
                    "Si le cohéquipier rate toutes ses chances ou manque de temps, l'équipe adverse a un droit de réplique.\n" +
                    "L'équipe qui devine le mot se verra attribué un point.\n" +
                    "MANCHE SUIVANTE:\n" +
                    "Les rôles sont inversés, c'est à dire que l'équipe qui dessinait est maintenant en attente et l'autre équipe dessine.\n" +
                    "La personne qui devinait il y a deux manches est maintenant l'artiste.\n" +
                    "Cela dit, si l'équipe est composée d'un joueur virtuel, ce dernier est artiste en permanence.\n" +
                    "FIN DE LA PARTIE:\n" +
                    "La partie est terminée après 4 manches.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Mode de jeu Sprint Solo",
                    "Le mode de jeu Sprint Solo se joue seul.\n" +
                    "Votre rôle est de deviner les mots dessinés par un joueur virtuel.\n" +
                    "Attention, vous avez un nombre d'essais limité.\n" +
                    "Chaque bonne réponse vous rapporte un point et du temps supplémentaire.\n" +
                    "FIN DE LA PARTIE:\n" +
                    "La partie est terminée lorsque le compteur de temps se rend à 0.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Mode de jeu Sprint Coop",
                    "Le mode de jeu Sprint Coop se joue à maximum 4 personnes.\n" +
                    "Votre rôle est de deviner les mots dessinés par un joueur virtuel.\n" +
                    "Attention, vous avez un nombre d'essais limité.\n" +
                    "Chaque bonne réponse rapporte un point à votre équipe et du temps supplémentaire.\n" +
                    "FIN DE LA PARTIE:\n" +
                    "La partie est terminée lorsque le compteur de temps se rend à 0.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Mode de jeu Battle Royal",
                    "Le mode de jeu Sprint Battle Royal se joue de 2 à 4 personnes.\n" +
                    "Votre but est d'être le premier à deviner le mot dessiné par un joueur virtuel.\n" +
                    "Il n'y a pas de nombre d'essaies limité dans ce mode de jeu.\n" +
                    "LES VIES:\n" +
                    "Vous aurez un certain nombre de vies.\n" +
                    "La seule façon de perdre une vie est d'être le dernier à deviner.\n" +
                    "Lorsque vous n'avez plus de vie, vous ne pouvez plus jouer.\n" +
                    "LES POINTS:\n" +
                    "Le premier à deviner reçoit 2 points, le deuxième 1 point et le troisième 0 point.\n" +
                    "La dernière personne à deviner ne reçoit jamais de point.\n" +
                    "FIN DE LA PARTIE:\n" +
                    "La partie est terminée lorsqu'il ne reste qu'un seul joueur en vie.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Difficultés",
                    "La difficulté d'un mode de jeu défini son temps et son nombre d'essais.\n" +
                    "FACILE:\n" +
                    "Temps: 60 secondes\n" +
                    "5 essais\n" +
                    "INTERMÉDIAIRE:\n" +
                    "Temps: 40 secondes\n" +
                    "3 essais.\n" +
                    "DIFFICILE:\n" +
                    "Temps: 20 secondes\n" +
                    "1 essai.\n" +
                    "____________________\n" +
                    "Le mode Battle Royal est différent puisque les joueurs ont des vies.\n" +
                    "Facile:        5 vies.\n" +
                    "Intermédiaire: 3 vies.\n" +
                    "Difficile:     1 vie.",
                    R.drawable.invisible,
                )
            )
            list.add(
                TutorialModel(
                    "Fin du tutoriel",
                    "Vous avez terminé de tutoriel!\n" +
                    "Clickez sur la flèche de retour pour aller sur le menu principal.\n" +
                    "Amusez-vous bien!.",
                    R.drawable.invisible,
                )
            )
            return list
        }
    }
}