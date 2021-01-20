import { MenuId } from './menu-id.enum';

export interface MenuNode {
  name: string;
  id: MenuId;
  children?: MenuNode[];
}

// The menu need to be in the order in which he is posted
export const MENU_TREE: MenuNode[] = [
    {
      name: 'Bienvenue', id: MenuId.WELCOME
    },
    {
      name: 'Menu de navigation', id: MenuId.NO_ID,
      children: [
        { name: 'Nouveau dessin', id: MenuId.NEW_DRAWING },
        { name: 'Gallerie de dessin', id: MenuId.GALLERY },
        { name: 'Continuer un dessin', id: MenuId.CONTINUE_DRAWING }
      ]
    },
    {
      name: 'Vue de dessin', id: MenuId.DRAWING_VIEW
    },
    {
      name: 'Option de fichier', id: MenuId.NO_ID,
      children: [
        { name: 'Sauvegarde', id: MenuId.SAVE_DRAWING },
        { name: 'Sauvegarde automatique', id: MenuId.AUTOMATIC_SAVE },
        { name: 'Exporter', id: MenuId.EXPORT_DRAWING }
      ]
    },
    {
      name: 'Outils', id: MenuId.NO_ID,
      children: [
        { name: 'Couleur', id: MenuId.COLOR },
        {
          name: 'Tracage', id: MenuId.NO_ID,
          children: [
            { name: 'Crayon', id: MenuId.PENCIL },
            { name: 'Pinceau', id: MenuId.BRUSH },
            { name: 'Aérosol', id: MenuId.AEROSOL },
          ]
        },
        {
          name: 'Formes', id: MenuId.NO_ID,
          children: [
            { name: 'Rectangle', id: MenuId.RECTANGLE },
            { name: 'Ellipse', id: MenuId.ELLIPSE },
            { name: 'Polygone', id: MenuId.POLYGON }
          ]
        },
        {
          name: 'Ligne', id: MenuId.LINE
        },
        {
          name: 'Applicateur de couleur', id: MenuId.COLOR_APPLICATOR
        },
        {
          name: 'Sceau de peinture', id: MenuId.REGION_TO_FILL,
        },
        {
          name: 'Efface', id: MenuId.ERASER
        },
        {
          name: 'Pipette', id: MenuId.PIPETTE
        },
        {
          name: 'Sélection', id: MenuId.NO_ID,
          children: [
            { name: 'Rectangle', id: MenuId.SELECTION_RECTANGLE },
            { name: "Rectangle d'inversion", id: MenuId.INVERSION_SELECTION },
            { name: 'Déplacement', id: MenuId.MOVING },
            { name: 'Rotation', id: MenuId.ROTATION },
            { name: 'Manipulation et presse-papier', id: MenuId.MANIPULATION },
          ]
        },
      ]
    },
    {
      name: 'Annuler et refaire', id: MenuId.UNDO_REDO
    },
    {
      name: 'Option de surface de dessin', id: MenuId.NO_ID,
      children: [
        { name: 'Grille', id: MenuId.GRID }
      ]
    },
  ];
