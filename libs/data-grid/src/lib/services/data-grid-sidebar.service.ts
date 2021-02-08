import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PeDataGridSidebarService {
  readonly toggleFilters$ = new BehaviorSubject<void>(null);
}
