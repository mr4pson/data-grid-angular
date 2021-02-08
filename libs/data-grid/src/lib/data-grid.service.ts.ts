import { Injectable } from '@angular/core';
import { combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, scan, shareReplay, startWith } from 'rxjs/operators';

import { isSelectableItem, PeDataGridItem } from './interface';

@Injectable()
export class PeDataGridService {
  showReset = false;
  readonly inputItems$ = new ReplaySubject<PeDataGridItem[] | null>(1);
  readonly projectedItems$ = new ReplaySubject<PeDataGridItem[]>(1);
  private readonly resolvedItems$ = combineLatest([this.inputItems$, this.projectedItems$]).pipe(
    map(([items, projectedItems]) => projectedItems.length ? projectedItems : items),
  );
  readonly setSelected$ = new ReplaySubject<string[]>(1);
  readonly selectItem$ = new Subject<PeDataGridItem>();

  readonly selectedItems$: Observable<string[]> = merge(
    this.setSelected$,
    this.selectItem$.pipe(
      map(item => item.id),
    ),
  ).pipe(
    scan((acc: string[], value: string[]) => {
      if (Array.isArray(value)) {
        acc = value;
      } else {
        const index = acc.findIndex(item => item === value);
        acc = index === -1 ? [...acc, value] : acc.filter(item => item !== value);
      }

      return acc;
    }, []),
    startWith([]),
    shareReplay(1),
  );

  readonly items$ = combineLatest([this.resolvedItems$, this.selectedItems$]).pipe(
    map(([items, selectedItems]) => {
      if (items) {
        return items.map(item => {
          if (isSelectableItem(item)) {
            const selected = selectedItems.some(id => id === item.id);
            return { ...item, selected };
          }
          return item;
        });
      }
      return null;
      },
    ),
    shareReplay(1),
  );
}
