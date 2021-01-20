import { NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UserGuideService } from 'src/app/services/user-guide/user-guide.service';
import { MENU_TREE, MenuNode  } from './menu';
import { MenuId } from './menu-id.enum';

@Component({
  selector: 'menu-tree',
  templateUrl: './menu-tree.component.html',
  styleUrls: ['./menu-tree.component.css'],
})
export class MenuTreeComponent {

  treeControl: NestedTreeControl<MenuNode> = new NestedTreeControl<MenuNode>((node) => node.children);
  menu: MatTreeNestedDataSource<MenuNode> = new MatTreeNestedDataSource<MenuNode>();

  constructor(private userGuideService: UserGuideService) {
    this.menu.data = MENU_TREE;
  }

  hasChild = (_: number, category: MenuNode) => !!category.children && category.children.length > 0;

  resetMenuExpansion(): void {
    this.userGuideService.resetMenuExpansion();
  }

  menuIsExpanded(): boolean {
    return this.userGuideService.menuIsExpanded();
  }

  displayDescription(idMenuItemToDisplay: MenuId): void {
    this.userGuideService.displayDescription(idMenuItemToDisplay);
  }

  categoryIsHidden(menuItem: MenuNode): boolean {
    const categoryIsClicked: boolean = this.treeControl.isExpanded(menuItem);
    return this.userGuideService.categoryIsHidden(categoryIsClicked);
  }

  descriptionIsSelected(idMenuItem: MenuId): boolean {
    return this.userGuideService.descriptionIsSelected(idMenuItem);
  }
}
