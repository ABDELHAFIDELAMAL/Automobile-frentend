import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
  standalone: true,
})
export class Header implements OnInit {
  title: string = 'Home';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.extractTitle();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.extractTitle();
    });
  }

  private extractTitle(): void {
    let route = this.router.routerState.snapshot.root;
    let lastValidTitle = this.title;

    while (route) {
      if (route.data && route.data['title']) {
        lastValidTitle = route.data['title'];
      }
      route = route.firstChild!;
    }

    this.title = lastValidTitle;
    this.cdr.detectChanges();
  }
}
