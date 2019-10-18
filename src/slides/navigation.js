import {
  fromEvent,
  of,
} from 'rxjs';
import {
  filter,
  tap,
  merge,
  throttleTime,
  take,
} from 'rxjs/operators'
import { Slide } from './slide';

import './slides.css';
import './slides-loader.css';

export class Slides {
  pages = [];
  activeIndex = 0;

  hashPrefix;
  throttleTiming;
  pageSelector;
  slideSettings;

  constructor({
    pageSelector = '.js-slide',
    hashPrefix = 'slide_',
    throttleTiming = 1500,
  } = {}, slideSettings = {}) {
    this.pageSelector = pageSelector;
    this.hashPrefix = hashPrefix;
    this.throttleTiming = throttleTiming;
    this.slideSettings = slideSettings;
    this.activeIndex = this.getWindowId();

    fromEvent(document, 'DOMContentLoaded')
      .pipe(
        merge(of(document.readyState).pipe(filter(state => state === 'complete'))),
        take(1)
      )
      .subscribe(() => this.init());
  }

  init() {
    this.setWindowHash(this.activeIndex);
    this.setPages(this.pageSelector);
    this.initNavigation();
    this.pageActivation();
  }

  setPages(pageSelector) {
    this.pages = [...document.querySelectorAll(pageSelector)]
      .map(el => new Slide(el, this.slideSettings));
  }

  pageActivation() {
    this.pages.forEach((page, i) => {
      page[ i > this.activeIndex ? 'deactivate' : 'activate']();
    });
  }

  initNavigation() {
    const wheelUp$ = fromEvent(window, 'wheel', { passive: false })
      .pipe(
        tap(event => event.preventDefault()),
        filter(e => e.deltaY < 0),
      );

    const keyUp$ = fromEvent(document, 'keydown')
      .pipe(
        filter(event => event.keyCode === 38 || event.keyCode === 37),
      );

    const wheelDown$ = fromEvent(window, 'wheel', { passive: false })
      .pipe(
        tap(event => event.preventDefault()),
        filter(e => e.deltaY > 0),
      );

    const keyDown$ = fromEvent(document, 'keydown')
      .pipe(
        filter(event => event.keyCode === 40 || event.keyCode === 39)
      );

    wheelUp$
      .pipe(
        filter(() => this.isNavigationAllowed()),
        throttleTime(this.throttleTiming),
        merge(keyUp$),
        filter(() => this.isBackwardAllowed()),
      )
      .subscribe(() => this.goBackward());

    wheelDown$
      .pipe(
        filter(() => this.isNavigationAllowed()),
        throttleTime(this.throttleTiming),
        merge(keyDown$),
        filter(() => this.isForwardAllowed()),
      )
      .subscribe(() => this.goForward());
  }

  hash(id) {
    return `${this.hashPrefix}${id}`;
  }

  idFromHash(hash) {
    const idRegexp = new RegExp(`#${this.hashPrefix}([0-9]+)`);
    return +hash.replace(idRegexp, '$1');
  }

  setWindowHash(index) {
    window.location.hash = this.hash(index + 1);
  }

  getWindowId() {
    return Math.max(this.idFromHash(window.location.hash) - 1, 0);
  }

  isNavigationAllowed() {
    return !this.pages[this.activeIndex].isAnimated;
  }

  isForwardAllowed() {
    return this.activeIndex < this.pages.length - 1;
  }

  isBackwardAllowed() {
    return this.activeIndex > 0;
  }

  goForward() {
    if (!this.pages[this.activeIndex].forward()) {
      this.activeIndex++;
      this.pages[this.activeIndex].forward();
      window.location.hash = this.hash(this.activeIndex + 1);
    }
  }

  goBackward() {
    this.pages[this.activeIndex].backward();
    this.activeIndex--;
    window.location.hash = this.hash(this.activeIndex + 1);
  }
}
