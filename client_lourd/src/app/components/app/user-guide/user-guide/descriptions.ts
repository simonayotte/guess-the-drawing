import { MenuId } from '../menu-tree/menu-id.enum';

export interface Descriptions {
  id: MenuId;
  title: string;
  paragraphs: string[];
}

export const descriptions: Descriptions[] = [
  {
    id: MenuId.NO_ID,
    title: 'Pas de titre associé à cet élément',
    paragraphs: [
      'Pas de description associé à cet élément'
    ]

  },
  {
    id: MenuId.WELCOME,
    title: 'Bienvenue',
    paragraphs: [
      "Bienvenue dans le guide d'utilisation de Polydessin!",
      "Vous verrez sur la zone gauche de l'écran, les différentes \
      catégories dans lesqulles vous pouvez naviguer.",
      "En cliquant sur une catégorie, sa liste d'éléent se \
      développera.",
      "En cliquant sur un élément, sa description apparraitera \
      dans la zone droite de l'écran.",
      "Pour naviguer à travers le guide d'utilisation, utiliser \
      les boutons 'précédent' et 'suivant' pour afficher l'éléments \
      précédent ou suivant.",
      'Pour vous aider à naviguer, lorsque vous appuirrez sur ces \
      boutons, le menu développera toutes ses branches.'
    ]
  },
  {
    id: MenuId.NEW_DRAWING,
    title: 'Nouveau dessin',
    paragraphs: [
      "Pour créer un nouveau dessin, sélectionnez le bouton 'Nouveau dessin' dans le menu d'accueil.",
      "Dans la fenêtre qui s'affiche à l'écran, entrez les dimensions voulues qu'aura le canvas de dessin ainsi \
      ainsi que la couleur d'arrière-plan (blanc par défaut) et sélectionnez le bouton 'Créer nouveau dessin'.",
      "S'il y a déjà un dessin en cours, l'ancien dessin sera supprimé et un nouveau canvas vide sera affiché."
    ]
  },
  {
    id: MenuId.GALLERY,
    title: 'Gallerie de dessin',
    paragraphs: [
      'Dans cette fenêtre, il est possible de voir les dessins sauvegardés sur le serveur.',
      "Il est possible d'ouvrir la fenêtre de Galerie avec le raccourci  `CTRL + G`.",
      'Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.',
      "Chaque élément de la liste comporte un nom, des étiquettes (s'il y en a) et un aperçu du dessin en format réduit.",
      'Il est possible de filtrer les dessins par leurs étiquettes.',
      'Si un dessin choisi ne peut pas être ouvert, vous pourrez en choisir un autre via la même fenêtre modale.',
      "Il est possible de supprimer un dessin à l'aide d'un bouton de suppression."
    ]
  },
  {
    id: MenuId.CONTINUE_DRAWING,
    title: 'Continuer un dessin',
    paragraphs: [
      'Il est possible de charger le dernier dessin sauvegardé par le système de sauvegarde automatique.',
      "Il est possible de voir l'option _Continuer un dessin_ dans le point d'entrée de l'application seulement \
      s'il y a un dessin sauvegardé.",
      "L'utilisateur est amené à la vue de dessin avec le dessin déjà chargé sur la surface de dessin."
    ]
  },
  {
    id: MenuId.DRAWING_VIEW,
    title: 'Vue de dessin',
    paragraphs: [
      'Dans la vue de dessin, vous avez accès à une surface de dessin, une zone de travail, et une barre latérale.',
      'Il est seulement possible de dessiner sur la surface de dessin.',
      "La barre latérale contient les outils de dessins, les options et le guide d'utilisation."
    ]
  },
  {
    id: MenuId.SAVE_DRAWING,
    title: 'Sauvegarde le dessin',
    paragraphs: [
      'Il est possible de sauvegarder le dessin sur un serveur via une fenêtre de sauvegarde.',
      "Il est possible d'ouvrir la fenêtre de sauvegarde avec le raccourci  `CTRL + S`.",
      'Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.',
      "Il est possible d'associer un nom au dessin à sauvegarder",
      "Il est possible d'associer une ou plusieurs étiquettes au dessin",
      "Il est possible d'enlever les étiquettes si elles sont choisies dans la fenêtre.",
      'Il est possible de sauvegarder des dessins avec le même nom et avec les mêmes étiquettes \
      (cette condition simultanément ou non) dans le serveur.',
      "Le tag et le nom doivent respecter ces conditions: Min: 2 caractères, Max: 50 caractères, \
      contenir que des lettres et/ou des chiffres, AUCUN CARACTÈRES SPÉCIAUX OU D'ESPACES (ex:!/$%?&*)",
      'Un bouton de confirmation est présent pour sauvegarder le dessin.',
      'Un message de confirmation aparrait lorsque la sauvegarde se fait'
    ]
  },
  {
    id: MenuId.AUTOMATIC_SAVE,
    title: 'Sauvegarde automatique',
    paragraphs: [
      'Il est possible récupéré un dessin même en fermant la fenêtre.',
      "La sauvegarde automatique est déclenchée après la création d'un nouveau dessin.",
      "La sauvegarde automatique est déclenchée après le chargement d'un dessin.",
      'La sauvegarde automatique est déclenchée après toute modification au dessin.'
    ]
  },
  {
    id: MenuId.EXPORT_DRAWING,
    title: 'Exporter le dessin',
    paragraphs: [
      "Il est possible d'exporter le dessin localement via une fenêtre d'export de fichier.",
      "Il est possible d'ouvrir la fenêtre d'export avec le raccourci `CTRL + E`.",
      'Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.',
      "Il est possible d'exporter une image en format JPG, PNG et SVG",
      "Il est possible d'appliquer un filtre à l'image exportée.",
      "Un choix d'au moins 5 filtres _sensiblement_ différents est offert.",
      "Un seul filtre est appliqué à l'image exportée.",
      "Il est possible d'entrer un nom pour le fichier exporté.",
      "Un bouton de confirmation est présent pour exporter l'image.",
      "Il est possible d'exporter le dessin et l'envoyer par courriel via une fenêtre d'export de fichier.",
    ]
  },
  {
    id: MenuId.COLOR,
    title: 'La couleur',
    paragraphs: [
      "La sélection des couleurs se fait à travers une palette de couleurs qui permet de sélectionner \
      la couleur ou d'entrer les valeurs RGB en hexadecimal.",
      "L'outil couleur permet de choisir une couleur principal et secondaire.",
      'La couleur principal est utilisée pour dessiner et la couleur secondaire est utilisée pour les contours lorsqu’il y en a.',
      'Vous pouvez inverser les 2 couleurs et définir la transparence pour chaque couleur.',
      'Vous pouvez choisir la couleur de fond de la surface de dessin.',
      'Le système mémorise les 10 dernières couleurs utilisées et vous les propose.',
      'Je peux chosir une de ces couleurs et elle devient automatiquement la couleur primaire ou secondaire.',
      'Un clic gauche modifie la couleur primaire et un clic droit modifie la couleur secondaire.'
    ]
  },
  {
    id: MenuId.PENCIL,
    title: 'Crayon',
    paragraphs: [
      "L'outil crayon comporte une pointe ronde.",
      "L'épaisseur du trait peut être configuré.",
      'Afin de dessiner, il suffit de maintenir le bouton gauche de la souris enfoncé.',
      'La couleur du crayon est celle de la couleur principale sélectionné.'
    ]
  },
  {
    id: MenuId.BRUSH,
    title: 'Pinceau',
    paragraphs: [
      "L'outil pinceau comporte une pointe ronde.",
      "L'épaisseur et la texture du trait  peuvent être configurés.",
      'Il existe 5 textures différentes parmis lesquelles choisir.',
      'Afin de dessiner, il suffit de maintenir le bouton gauche de la souris enfoncé.'
    ]
  },
  {
    id: MenuId.AEROSOL,
    title: 'Aérosol',
    paragraphs: [
      "Il est possible de sélectionner l'outil Aérosol avec la touche `A`.",
      "Il est possible de définir le nombre d'émissions par seconde.",
      "L'émission de peinture se fait à intervalle régulier.",
      'Le motif de vaporisation change à chaque émission.',
      'Il est possible de définir le diamètre du jet.'
    ]
  },
  {
    id: MenuId.RECTANGLE,
    title: 'Rectangle',
    paragraphs: [
      "Pour utiliser l'outil rectangle, il suffit d'effectuer un glisser-déposer avec la souris.",
      "En appuyant sur la touche 'SHIFT' pendant le glisser-déposer, vous pouvez dessiner un carré.",
      "Il est possible de configurer l'épaisseur du contour mais aussi le type de tracé. Voici les types de tracés: ",
      '- Contour: on ne dessine que les contours',
      "- Plein: on ne dessine que l'intérieur, sans les contours",
      "- Plein avec contour: on dessine l'intérieur et les contours du rectangle"

    ]
  },
  {
    id: MenuId.ELLIPSE,
    title: 'Ellipse',
    paragraphs: [
      "Il est possible de sélectionner l'outil Ellipse avec la touche `2`.",
      'Un glisser-déposer permet de créer un périmètre rectangulaire.',
      'La forme à créer est inscrite dans le périmètre.',
      'La forme à créer occupe la plus grande aire possible dans le périmètre.',
      'La forme est toujours ancrée par rapport au coin initial.',
      'Le périmètre et la forme sont dessinés et mis à jour en temps réel.',
      'Il est possible de définir l’épaisseur du trait de contour.',
      'Il est possible de choisir le type de tracé.',
      'L’intérieur d’une forme est dessiné avec la couleur principale.',
      'Le contour d’une forme est dessiné avec la couleur secondaire.',
      'Il est possible de forcer la création d’un cercle avec la touche `SHIFT`.',
      'Si la touche `SHIFT` est relâchée, la forme à créer redevient une ellipse.',
      "Le passe d'ellipse à cercle et vice-versa se fait automatiquement, sans le déplacement de la souris."
    ]
  },
  {
    id: MenuId.POLYGON,
    title: 'Polygone',
    paragraphs: [
      "Il est possible de sélectionner l'outil Polygone avec la touche **3**.",
      'Un glisser-déposer permet de créer un périmètre rectangulaire.',
      'La forme à créer est inscrite dans le périmètre.',
      'La forme à créer occupe la plus grande aire possible dans le périmètre.',
      'La forme est toujours ancrée par rapport au coin initial.',
      'Le périmètre et la forme sont dessinés et mis à jour en temps réel.',
      'Il est possible de définir l’épaisseur du trait de contour.',
      'Il est possible de choisir le type de tracé.',
      'L’intérieur d’une forme est dessiné avec la couleur principale.',
      'Le contour d’une forme est dessiné avec la couleur secondaire.',
      'Il est possible de définir le nombre de côtés du polygone à créer (3 à 12).',
      'Les polygones dessinés sont réguliers et convexes.'
    ]
  },
  {
    id: MenuId.LINE,
    title: 'Ligne',
    paragraphs: [
      "Cet outil permet de tracer une ligne d'un ou plusieurs segments.",
      'Il est possible de déterminer le début de la ligne avec un clic.',
      'Avec chaque clic suivant, un segment connectera le clic précédant.',
      "En gardant la touche 'SHIFT' enfoncé, vous pourrez créer un ligne en angle de 45° avec l'horizontale.",
      'Pour terminer le tracage, il suffit de double-cliquer sur la zone de dessin.',
      "Pour annuler le tracage complet de la ligne, il suffit d'appuyer sur la touche 'ESCAPE' de votre clavier.",
      "Afin de supprimer le dernier point sélectionner (à l'exception du 1er point), il suffit d'appuyer sur la \
      touche 'BACKSPACE' de votre clavier.",
      "Vous pouvez configurer le type de jonction (normal ou avec point), l'épaisseur de la ligne (en pixels), \
      le diamètre des points de jonction (si l’option avec point est choisie)."
    ]
  },
  {
    id: MenuId.COLOR_APPLICATOR,
    title: 'Applicateur de couleur',
    paragraphs: [
      "Il est possible de sélectionner l'outil Applicateur de couleur avec la touche `R`.",
      'Il est possible d’appliquer la couleur principale à la forme (intérieur) d’un objet.',
      "Il est possible d’appliquer la couleur secondaire au contour d’un objet s'il y a un contour présent.",
      'Un clic avec le bouton gauche sur un objet fera changer sa couleur pour la couleur principale',
      'Un clic avec le bouton droit sur un objet fera changer la couleur de bordure, s’il en a une, pour la couleur secondaire.'
    ]
  },
  {
    id: MenuId.REGION_TO_FILL,
    title: 'Sceau de peinture',
    paragraphs: [
      "L'outil sceau de peinturecsert à remplir une région avec la couleur principale en cliquant l'intérieur d'une région",
      "Il est possible de sélectionner l'outil Sceau de Peinture avec la touche `B`."
    ]
  },
  {
    id: MenuId.ERASER,
    title: 'Efface',
    paragraphs: [
      "Il est possible de sélectionner l'outil Efface avec la touche `E`.",
      'Il est possible de définir la taille de l’efface.',
      "La taile minimale de l'efface est de 3 pixels.",
      'C’est l’objet sur le dessus de la pile qui est effacé lorsque plusieurs objets se trouvent sous un même point.',
      'Il est possible d’utiliser l’efface comme une brosse.',
      'Un effacement par glisser-déposer ne constitue qu’une seule action dans un contexte d’annuler-refaire.',
      'Un objet en contact ave l’outil efface doit être mis en évidence à l’aide d’un contour rouge.',
      "La mise en évidence est présente même si l'outil n'est pas actif.",
      "Les objets crées par l'outil **Texte** et **Aérosol** se comportente comme un seul objet pour l'efface."
    ]
  },
  {
    id: MenuId.PIPETTE,
    title: 'Pipette',
    paragraphs: [
      "Il est possible de sélectionner l'outil Pinceau avec la touche `I`.",
      'La couleur saisie est celle du pixel sous le pointeur de la souris.',
      "Il est possible de saisir et d’assigner la couleur d'un point à la couleur principale.",
      "Il est possible de saisir et d’assigner la couleur d'un point à la couleur secondaire.",
      'Le changement de la couleur principale se fait avec un clic gauche.',
      'Le changement de la couleur secondaire se fait avec un clic droit.'
    ]
  },
  {
    id: MenuId.SELECTION_RECTANGLE,
    title: 'Rectangle de sélection',
    paragraphs: [
      'Il est possible de sélectionner tous les objets sur la surface de dessin avec le raccourci `CTRL + A`.',
      "Il est possible de sélectionner un objet avec un clic simple (sans déplacement) sur l'objet.",
      'Il est possible de sélectionner un ou plusieurs objets avec un rectangle de sélection.',
      'Un rectangle de sélection s’effectue avec un glisser-déposer.',
      'Le rectangle de sélection a un cadre en pointillé.',
      'Le rectangle de sélection peut avoir un intérieur coloré avec une transparence.',
      'L’affichage du rectangle de sélection est en tout temps mis à jour pendant le glisser-déposer.',
      "Un objet est sélectionné si le réctangle de sélection est en collision avec la boîte englobante de l'objet.",
      'Un objet sélectionné est entouré d’une boite englobante.',
      'Plusieurs objets sélectionnés sont entourés d’une boite englobante commune.',
      'Une boite englobante doit être minimale, peu importe son orientation.',
      'Une boite englobante a quatre points de contrôle.',
      'La sélection et l’affichage de la boite englobante résultante sont en tout temps mis à jour pendant le glisser-déposer.'
    ]
  },
  {
    id: MenuId.INVERSION_SELECTION,
    title: "Rectangle d'inversion de sélection",
    paragraphs: [
      "Il est possible de faire une inversion de la sélection (ou un rectangle d'inversion) avec le bouton droit de la souris."
    ]
  },
  {
    id: MenuId.MOVING,
    title: 'Déplacement',
    paragraphs: [
      'Il est possible de déplacer une sélection avec un glisser-déposer avec le bouton gauche de la souris.',
      'La sélection suit le pointeur de la souris en tout temps.',
      'Le point de sélection sous le pointeur de la souris doit rester le même.',
      'Il est possible de déplacer une sélection avec les touches directionnelles (flèches) du clavier.',
      'La sélection est déplacée de 3 pixels dans la direction de la touche appuyée.',
      'Il est possible de déplacer la sélection de manière continue si au moins une touche est maintenue appuyée pendant 500 ms.',
      'La sélection est déplacée de 3 pixels dans la direction de la touche appuyée à chaque 100 ms pendant un déplacement continu.',
      'Il est possible de déplacer la sélection dans plusieurs directions en même temps.',
      "Un déplacement de plusieurs objets compte comme une seule action pour l'outil Annuler-Refaire."
    ]
  },
  {
    id: MenuId.ROTATION,
    title: 'Rotation',
    paragraphs: [
      'Il est possible de faire pivoter une sélection avec la roulette de la souris.',
      'À chaque cran de roulette, une rotation de 15 degrés est effectuée.',
      'Il est possible de faire passer la rotation par cran de roulette de 15 à 1 degré si la touche `ALT ` est enfoncée.',
      "Il est possible de faire pivoter les objets d’une sélection individuellement autour de leur propre centre à l'aide de \
      la touche `SHIFT`."
    ]
  },
  {
    id: MenuId.MANIPULATION,
    title: 'Manipulation de sélection et presse-papier',
    paragraphs: [
      'Il est possible de copier une sélection avec le raccourci `CTRL + C`.',
      "Le contenu du presse-papier est remplacé par la sélection lors d'un copiage.",
      'Il est possible de couper une sélection avec le raccourci `CTRL + X`.',
      "Le contenu du presse-papier est remplacé par la sélection active lors d'un coupage.",
      'Il est possible de coller ce qui se trouve dans le presse-papier avec le raccourci `CTRL + V`.',
      'Les objets créés par un collage sont automatiquement sélectionnés.',
      'Le contenu du presse-papier n’est pas affecté par un collage.',
      'Il est possible de dupliquer une sélection avec le raccourci `CTRL + D`.',
      'Les objets créés par une duplication sont automatiquement sélectionnés.',
      'Le contenu du presse-papier n’est pas affecté par une duplication.',
      'Il est possible de supprimer une sélection avec le raccourci `DELETE`.',
      'Les actions couper, copier, coller, dupliquer et supprimer ne sont pas disponibles sans une sélection courante.'
    ]
  },
  {
    id: MenuId.UNDO_REDO,
    title: 'Annuler et refaire',
    paragraphs: [
      'Il est possible d’annuler la dernière action réalisée.',
      'La fonction d’annulation de dernière action peut être appelée un nombre illimité de fois.',
      'Il est possible de refaire toutes les actions annulées, une à la fois, dans l’ordre inverse.',
      'Une nouvelle action élimine la pile des actions annulées pouvant être refaite.',
      'Annuler-refaire doit ignorer le presse-papier, sauf pour la valeur de décalage.',
      'Annuler et Refaire sont accessible via la barre latérale.',
      "Si l'action Annuler ou Refaire est indisponible, il doit être impossible de choisir respectivement \
      l'action Annuler ou Refaire via la barre latérale.",
      "Il est possible d'annuler une action avec le raccourci `CTRL + Z`.",
      'Il est possible de refaire une action avec le raccourci `CTRL + SHIFT + Z`.'
    ]
  },
  {
    id: MenuId.GRID,
    title: 'Grille',
    paragraphs: [
      'Il est possible de faire afficher (et de masquer) une grille superposée à la surface de dessin.',
      'Il est possible de faire afficher (et de masquer) la grille avec la touche `G`.',
      'Il est possible de définir une valeur de transparence pour la grille.',
      'Il est possible de définir la taille des carrés composant la grille en pixels.',
      "Il est possible d'augmenter la taille des carrés de la grille au prochain multiple de 5 avec le raccourci `+`.",
      'Il est possible de diminuer la taille des carrés de la grille au prochain multiple de 5 avec le raccourci `-`.',
      'La grille est superposée à la surface de dessin et son contenu.',
      "La grille n'est pas présente lorsque le dessin est sauvegardé, exporté ou envoyé par courriel."
    ]
  },
// tslint:disable-next-line: max-file-line-count --> It is just data
];
