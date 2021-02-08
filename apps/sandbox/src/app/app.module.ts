import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { PeDataGridModule, PeDataGridSidebarService } from '@pe/data-grid';
import { PeSidebarModule } from '@pe/sidebar';
import { PeFiltersModule } from '@pe/filters';
// import { HeaderInfoModule } from '@pe/header-info';

import { AppComponent } from './app.component';
import { ELEMENT_FACTORIES, PebRendererModule } from '@pe/builder-renderer';

// declare var PayeverStatic: any;
// PayeverStatic.IconLoader.loadIcons([
//   'set',
//   'apps',
//   'settings',
//   'builder',
//   'dock',
//   'edit-panel',
//   'social',
//   'dashboard',
//   'notification',
//   'commerceos',
//   'widgets',
//   'payment-methods',
//   'shipping',
// ]);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PeDataGridModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PeSidebarModule,
    PeFiltersModule,
    PebRendererModule.forRoot({elements: {}}),
    // HeaderInfoModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  static forRoot(config: any): ModuleWithProviders<PeDataGridModule> {
    return {
      ngModule: PeDataGridModule,
      providers: [
        {
          provide: ELEMENT_FACTORIES,
          useValue: config?.elements,
        },
        ...config.plugins || [].map(pluginCtor => ({
          provide: pluginCtor,
          useClass: pluginCtor,
        })),
      ],
    };
  }
}
