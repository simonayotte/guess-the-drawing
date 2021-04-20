import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Router } from '@angular/router';
import data from './tutorial-content.json';
import { TutorialSectionContent } from './tutorial-section-content';

enum SECTION_INDEXES {
  WELCOME,
  SIGNIN,
  SIGNUP,
  MAIN_MENU,
  LOBBIES,
  CHANNELS,
  CHAT,
  GAME_VIEW,
  PEN,
  COLORS,
  ERASER,
  GRID,
  UNDO_REDO,
  CLASSIC,
  SOLO,
  COOP,
  BATTLE_ROYAL,
  DIFFICULTY,
  END_GUIDE,
}

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

// tslint:disable-next-line: no-any --- disable here because there is not really a type that match the enum
  public readonly SECTION_INDEXES: any = SECTION_INDEXES;

  public contentIndex: number = 0;
  public lastIndex: number = data.guideContent.length - 1;
  public currentlyDisplayedContent: TutorialSectionContent = data.guideContent[this.contentIndex];

  @ViewChildren(MatExpansionPanel) viewCategories: QueryList<MatExpansionPanel>;
  // to view all categories to expand or collapse them
  // to allow expand/collapse with buttons and manually:

  public goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  public switchExpandSubjects(): void {
    this.viewCategories.forEach((subject) => {
        subject.open();
    });
  }

  public incrementContentIndex(): void {
    if (this.contentIndex < this.lastIndex && this.contentIndex >= 0) {
      this.currentlyDisplayedContent = data.guideContent[++this.contentIndex];
    }
  }

  public decrementContentIndex(): void {
    if (this.contentIndex > 0 && this.contentIndex <= this.lastIndex) {
      this.currentlyDisplayedContent = data.guideContent[--this.contentIndex];
    }
  }

  // Using the index passed in parameter, verifies that the index is valid and loads the new content
  // at the specified index accordingly
  public loadNewGuideContent(index: number): void {
    this.contentIndex = (index >= 0 && index <= this.lastIndex) ? index : 0;
    this.currentlyDisplayedContent = data.guideContent[this.contentIndex];
  }

  // @HostListener(data.keyDown.arrowRight, [data.keyDown.event])
  // public incrementContentIndexShortCut(event: KeyboardEvent): void {
  //   event.preventDefault();
  //   this.incrementContentIndex();
  //   this.switchExpandSubjects();
  // }

  // @HostListener(data.keyDown.arrowLeft, [data.keyDown.event])
  // public decrementContentIndexShortCut(event: KeyboardEvent): void {
  //   event.preventDefault();
  //   this.decrementContentIndex();
  //   this.switchExpandSubjects();
  // }

}
