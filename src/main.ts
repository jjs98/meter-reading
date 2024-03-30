import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import {
  ClarityIcons,
  loadCoreIconSet,
  //loadChartIconSet,
  //loadCommerceIconSet,
  loadEssentialIconSet,
  //loadMediaIconSet,
  //loadSocialIconSet,
  //loadTechnologyIconSet,
  //loadTextEditIconSet,
  //loadTravelIconSet,
  vmBugIcon,
  lineChartIcon,
} from '@cds/core/icon';

ClarityIcons.addIcons(lineChartIcon, vmBugIcon);
// loadChartIconSet();
// loadCommerceIconSet();
loadCoreIconSet();
loadEssentialIconSet();
// loadMediaIconSet();
// loadSocialIconSet();
// loadTechnologyIconSet();
// loadTextEditIconSet();
// loadTravelIconSet();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
