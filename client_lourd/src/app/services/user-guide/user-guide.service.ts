import { Injectable } from '@angular/core';
import { Descriptions, descriptions } from 'src/app/components/app/user-guide/user-guide/descriptions';
import { MenuId } from '../../components/app/user-guide/menu-tree/menu-id.enum';

@Injectable({
  providedIn: 'root'
})
export class UserGuideService {

  navigationIsClicked: boolean;
  descriptions: Descriptions[];
  idDescription: MenuId;

  constructor() {
    this.descriptions = descriptions;
    this.idDescription = MenuId.WELCOME;
    this.navigationIsClicked = false;
  }

  // Tree of the menu
  resetMenuExpansion(): void {
    this.navigationIsClicked = false;
  }

  menuIsExpanded(): boolean {
    return this.navigationIsClicked;
  }

  descriptionIsSelected(idMenuItem: MenuId): boolean {
    if (this.idDescription === idMenuItem) {
      return true;
    }
    return false;
  }

  categoryIsHidden(categoryIsClicked: boolean): boolean {
    return (!this.navigationIsClicked && !categoryIsClicked);
  }

  displayDescription(idMenuItemToDisplay: MenuId): void {
    this.idDescription = idMenuItemToDisplay;
  }

  // Navigation button
  backToPreviousPage(url: string): string {
    if (url === '/draw/guide') {
      return '/draw';
    } else if (url === '/guide') {
      return '/home';
    }
    return '/guide';
  }

  previous(): void {
    this.idDescription--;
    this.navigationIsClicked = true;
  }

  next(): void {
    this.idDescription++;
    this.navigationIsClicked = true;

  }

  isFirstDescription(): boolean {
    return (this.idDescription === MenuId.WELCOME);
  }

  isLastDescription(): boolean {
    return (this.idDescription === MenuId.GRID);
  }

  // Description of the user guide
  getDescriptionParagraphs(): string[] {
    for (const description of this.descriptions) {
      if (description.id === this.idDescription) {
        return description.paragraphs;
      }
    }
    return ['Pas de description associé à cet élément'];
  }

  getDescriptionTitle(): string {
    for (const description of this.descriptions) {
      if (description.id === this.idDescription) {
        return description.title;
      }
    }
    return 'Pas de titre associé à cet élément';
  }

}
