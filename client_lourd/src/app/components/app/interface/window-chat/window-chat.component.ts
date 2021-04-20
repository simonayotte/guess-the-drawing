import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy } from '@angular/core';
import {CdkPortal,DomPortalOutlet} from '@angular/cdk/portal';

@Component({
  selector: 'app-window-chat',
  templateUrl: './window-chat.component.html',
  styleUrls: ['./window-chat.component.scss']
})
export class WindowChatComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal) portal: CdkPortal;
  // @ViewChild(CdkPortal, { static: true }) portal: CdkPortal;

  private externalWindow: Window|null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector){}


  ngOnInit(){
    this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');
 
    if (this.externalWindow) {
      const host = new DomPortalOutlet(
        this.externalWindow.document.body,
        this.componentFactoryResolver,
        this.applicationRef,
        this.injector
        );
  
      host.attach(this.portal);
    }
  }

  ngOnDestroy(){
    if (this.externalWindow) {
      this.externalWindow.close()
    }
  }

}
