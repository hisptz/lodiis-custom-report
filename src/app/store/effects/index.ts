import { UserEffects } from './user.effects';
import { SystemInfoEffects } from './system-info.effects';
import { RouterEffects } from './router.effects';
import { ReportDataEffects } from './report.effects';
import { GeneratedReportEffects } from './generated-report.effects';

export const effects: any[] = [
  UserEffects,
  SystemInfoEffects,
  RouterEffects,
  ReportDataEffects,
  GeneratedReportEffects,
];
