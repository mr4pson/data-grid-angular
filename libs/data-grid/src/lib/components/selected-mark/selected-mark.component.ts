import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pe-data-grid-selected-mark',
  templateUrl: './selected-mark.component.html',
  styleUrls: ['./selected-mark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeDataGridSelectedMarkComponent {
  @Input() selected: boolean;
}
