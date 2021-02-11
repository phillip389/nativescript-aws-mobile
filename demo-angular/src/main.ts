// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "@nativescript/angular";

import { AppModule } from "./app/app.module";

import { AwsMobile } from '@nspluginadd/nativescript-aws-mobile';

AwsMobile.init();

platformNativeScriptDynamic().bootstrapModule(AppModule);
