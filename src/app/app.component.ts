import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationStart, NavigationCancel, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

import { DataService } from './services/data/data.service';
import { StaticDataService } from './services/staticData/static-data.service';
import { TitleService } from './services/title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

	subscription: Subscription;

	private urlAccepted: string[] = ['/', '/guide', '/admin', '/subscribe', '/authentication', '/account', '/who-we-are', '/about-this-website', '/help-us', '/all-guides', '/members', '/404' ];
	private urlAdmin: string[] = ['/admin'];

	realms: any;

  public menuIsOpen: any = {
    main: false,
    user: false
  };

	constructor(
		public dataService: DataService,
		private staticDataService: StaticDataService,
		private titleService: TitleService,
		private router: Router,
		public title: Title,
		private ccService: NgcCookieConsentService) {
		this.dataService.loading = true;

		this.subscription = this.titleService.getTitle().subscribe((newTitle) => this.setTitle(newTitle));

		dataService.init();
	}

	ngAfterViewInit(): void {
		this.router.events
		.subscribe((event) => {
			if(event instanceof NavigationStart) {
				this.dataService.loading = true;
			}
			else if (
				event instanceof NavigationEnd ||
				event instanceof NavigationCancel
			) {
				if( this.urlAccepted.indexOf(event.url) != -1 ) {

					if ( this.urlAdmin.indexOf(event.url) != -1 && ( this.dataService.user == undefined || ( this.dataService.user && this.dataService.user.roles.indexOf('administrator') == -1 ) ) ) {
						this.router.navigate(['/']);
					}

					this.dataService.loading = false;
				}
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

  openMenu(name): void {
    this.menuIsOpen[name] = true;
  }

  closeMenu(name): void {
    this.menuIsOpen[name] = false;
  }

	setTitle(newTitle: any): void {
		this.title.setTitle( newTitle );
	}

	logout(): void {
		window.localStorage.removeItem('user');
		this.dataService.user = undefined;
		this.dataService.isAdmin = false;
	}
}
