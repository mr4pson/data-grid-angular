import { Component } from '@angular/core';

@Component({
  selector: 'pe-data-grid-image-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 97 91">
      <defs>
        <filter id="u464hafcja" width="262.3%" height="577.8%" x="-81.1%" y="-238.9%" filterUnits="objectBoundingBox">
          <feOffset dx="4" dy="4" in="SourceAlpha" result="shadowOffsetOuter1"/>
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="20"/>
          <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g fill="#FFF">
          <g filter="url(#u464hafcja)" transform="translate(-278 -356) translate(301 380)">
            <g>
              <path d="M7.074.723h14.652c1.011 0 1.831.82 1.831 1.832v10.76l-3.516-3.517c-.415-.418-1.09-.422-1.509-.007l-.007.007-1.2 1.195c-.416.42-1.095.422-1.514.005l-.005-.005L12.6 7.788c-.417-.42-1.096-.422-1.515-.005l-.005.005-5.838 5.792V2.546C5.248 1.538 6.067.723 7.074.723M22.02 0H6.781C5.466 0 4.4 1.059 4.4 2.366v11.632c0 1.306 1.066 2.366 2.381 2.366h15.238c1.315 0 2.381-1.06 2.381-2.366V2.357C24.395 1.053 23.33 0 22.019 0" transform="translate(8.6 7)"/>
              <path fill-rule="nonzero" d="M4.399 3.6v.8H2.781c-1.045 0-1.9.802-1.976 1.82L.8 6.365v11.632c0 1.035.808 1.885 1.833 1.96l.148.006h15.238c1.045 0 1.9-.803 1.976-1.82l.005-.146v-1.999h.8v1.999c0 1.471-1.155 2.674-2.612 2.76l-.169.006H2.781c-1.478 0-2.688-1.148-2.776-2.598L0 17.998V6.366c0-1.472 1.155-2.674 2.612-2.761L2.78 3.6h1.618z" transform="translate(8.6 7)"/>
            </g>
          </g>
        </g>
      </g>
    </svg>
  `,
  styles: [`
    svg {
      transform: scale(4.5);
      padding-top: 4px;
    }
  `],
})
export class PeDataGridImageIconComponent {
}
