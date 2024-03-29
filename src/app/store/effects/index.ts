import { UserEffects } from './user.effects';
import { SystemInfoEffects } from './system-info.effects';
import { RouterEffects } from './router.effects';
import { ReportDataEffects } from './report.effects';
import { GeneratedReportEffects } from './generated-report.effects';
import { CustomReportEffect } from './custom-report.effect.effects';

export const effects: any[] = [
  UserEffects,
  SystemInfoEffects,
  RouterEffects,
  ReportDataEffects,
  GeneratedReportEffects,
  CustomReportEffect,
];
