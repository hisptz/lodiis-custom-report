import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Fn } from '@iapps/function-analytics';
import {
  NgxDhis2HttpClientService,
  SystemInfo,
} from '@iapps/ngx-dhis2-http-client';
import { find, map, flattenDeep, uniqBy, filter } from 'lodash';

import { PERIOD_FILTER_CONFIG } from '../../constants/period-filter-config.constant';
import { getAvailablePeriods } from '../../helpers/get-available-periods.helper';
import { getSanitizedPeriods } from '../../helpers/get-sanitized-periods.helper';
import { removePeriodFromList } from '../../helpers/remove-period-from-list.helper';
import { PeriodFilterConfig } from '../../models/period-filter-config.model';
import { formatDateToYYMMDD } from '../../helpers/dates-range-picker.helper';
import { getPeriodTypesByFilterType } from '../../helpers/get-period-types-by-filter-type.helper';
import { PeriodFilterType } from '../../models/period-filter-type.model';
import {
  PERIOD_FILTER_TYPES,
  PeriodFilterTypes,
} from '../../constants/period-filter-types.constant';
import { getPeriodFilterTypesByConfig } from '../../helpers/get-period-filter-types-by-config.helper';
import { getCurrentPeriodFilterType } from '../../helpers/get-current-period-filter-type.helper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ngx-dhis2-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.css'],
})
export class PeriodFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedPeriodType: string;
  @Input() selectedPeriods: any[];
  @Input() periodFilterConfig: PeriodFilterConfig;
  @Input() defaultPeriodTypes: string[];

  @Output() update = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() changePeriod = new EventEmitter();

  /* For data range picker */
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  startDate: any;
  endDate: any;
  /** End for data range picker */

  availablePeriods: any[];
  selectedYear: number;
  currentYear: number;
  periodTypes: any[];
  periodInstance: any;
  periodTypeInstance: Fn.PeriodType;
  showPeriodTypeSelection: boolean;
  periodFilterTypes: PeriodFilterType[];
  periodFilterTypeEnum: any;
  currentPeriodFilterType: string;
  selectedPeriodList = [];
  deselectedPeriodList = [];

  constructor(private httpClient: NgxDhis2HttpClientService) {
    this.periodTypeInstance = new Fn.PeriodType();
    this.periodInstance = new Fn.Period();
    /* For data range picker */
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    const currentYear = new Date().getFullYear();
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxStartDate = new Date(currentYear, currentMonth, currentDate);
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDate);
    /** End for data range picker */
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedPeriods && !changes.selectedPeriods.firstChange) {
      this._setPeriodProperties(null);
    }
  }

  ngOnInit() {
    this.periodTypes = getPeriodTypesByFilterType(
      this.periodTypeInstance.get(),
      this.currentPeriodFilterType,
      this.defaultPeriodTypes
    );

    this.periodFilterConfig = {
      ...PERIOD_FILTER_CONFIG,
      ...(this.periodFilterConfig || {}),
    };

    this.periodFilterTypes = getPeriodFilterTypesByConfig(
      PERIOD_FILTER_TYPES,
      this.periodFilterConfig
    );

    this.currentPeriodFilterType = getCurrentPeriodFilterType(
      this.periodFilterTypes,
      this.selectedPeriodType
    );

    this.periodFilterTypeEnum = PeriodFilterTypes;

    const lowestPeriodType = find(this.periodTypes, [
      'id',
      this.periodFilterConfig.lowestPeriodType,
    ]);

    if (lowestPeriodType) {
      this.periodTypes = this.periodTypes.filter(
        (periodType: any) => periodType.rank >= lowestPeriodType.rank
      );
    }

    // Initialize selected periods if not defined
    if (!this.selectedPeriods) {
      this.selectedPeriods = [];
    }

    this._setPeriodProperties(this.selectedPeriodType);
  }

  onSetPeriodFilterType(e, periodFilterType) {
    e.stopPropagation();

    if (
      periodFilterType &&
      this.currentPeriodFilterType !== periodFilterType.value
    ) {
      this.currentPeriodFilterType = periodFilterType.value;
      this.periodTypes = getPeriodTypesByFilterType(
        this.periodTypeInstance.get(),
        this.currentPeriodFilterType,
        this.defaultPeriodTypes
      );

      if (this.periodTypes.length > 0) {
        this.selectedPeriodType = this.periodTypes[0].id;
        this._setPeriodProperties(this.selectedPeriodType);
      }

      if (periodFilterType === PeriodFilterTypes.DATE_RANGE) {
        this.selectedPeriods = [];
      }

      this.startDate = null;
      this.endDate = null;
    }
  }

  getDate(dateValue, type) {
    this.selectedPeriods = [];
    if (type == 'start_date') {
      this.startDate = formatDateToYYMMDD(dateValue);
      this.minEndDate = new Date(
        Number(this.startDate.split('-')[0]),
        Number(this.startDate.split('-')[1]) - 1,
        Number(this.startDate.split('-')[2]) + 1
      );
    } else {
      this.endDate = formatDateToYYMMDD(dateValue);
    }
    if (this.startDate && this.endDate) {
      this.selectedPeriods.push({
        id: 'dates-range',
        type: 'dates-range',
        name: this.startDate + ' to ' + this.endDate,
        dimension: 'ou',
        startDate: {
          id: this.startDate,
          name: this.startDate,
        },
        endDate: {
          id: this.endDate,
          name: this.endDate,
        },
      });
    }
  }

  private _setPeriodProperties(selectedPeriodType) {
    this.httpClient.systemInfo().subscribe((systemInfo: SystemInfo) => {
      this.selectedPeriods = getSanitizedPeriods(
        this.selectedPeriods,
        this.periodFilterConfig,
        systemInfo.keyCalendar
      );

      // Get selected period type if not supplied
      if (!selectedPeriodType) {
        if (this.selectedPeriods[0]) {
          this.selectedPeriodType = this.selectedPeriods[0].type || 'Monthly';
        } else {
          this.selectedPeriodType = 'Monthly';
        }
      }

      this.periodInstance
        .setType(this.selectedPeriodType)
        .setCalendar(systemInfo.keyCalendar)
        .setPreferences({
          childrenPeriodSortOrder:
            this.periodFilterConfig.childrenPeriodSortOrder || 'DESC',
          allowFuturePeriods: true,
        })
        .get();

      this.selectedYear = this.currentYear = this.periodInstance.currentYear();

      this._setAvailablePeriods();
    });
  }

  onSelectPeriod(period, e) {
    e.stopPropagation();

    if (this.periodFilterConfig.singleSelection) {
      this.availablePeriods = this.periodInstance.list();

      // Add back the removed period to the available period if applicable
      this.selectedPeriods = [];
    }

    // Remove selected period to available bucket
    this.availablePeriods = removePeriodFromList(this.availablePeriods, period);

    // Add selected period to selection bucket
    this.selectedPeriods = [...this.selectedPeriods, period];

    if (this.periodFilterConfig.emitOnSelection) {
      this._onUpdatePeriod();
    }
  }
  onClickToSelectPeriod(period, e, type) {
    if (
      this.periodFilterConfig &&
      this.periodFilterConfig.hasOwnProperty('singleSelection') &&
      !this.periodFilterConfig.singleSelection
    ) {
      const { ctrlKey, shiftKey } = e;
      e.stopPropagation();
      switch (type) {
        case 'SELECT': {
          this.updateSelectedPeriodList(period, ctrlKey, shiftKey);
          break;
        }
        case 'DESELECT': {
          this.updateDeselectedPeriodList(period, ctrlKey, shiftKey);
          break;
        }

        default:
          break;
      }
    } else {
      switch (type) {
        case 'SELECT': {
          this.updateSingleSelectedPeriodList(period);
          break;
        }
        case 'DESELECT': {
          this.updateSingleDeselectedPeriodList(period);
          break;
        }

        default:
          break;
      }
    }
  }
  moveSingleSelectedPeriod(availablePeriod, e) {
    this.onSelectPeriod(availablePeriod, e);
    this.selectedPeriodList = [];
  }
  moveSingleDeselectedPeriod(period, e) {
    this.onDeselectPeriod(period, e);
    this.deselectedPeriodList = [];
  }
  updateSingleSelectedPeriodList(period) {
    this.selectedPeriodList = [...[], period];
  }
  updateSingleDeselectedPeriodList(period) {
    this.deselectedPeriodList = [...[], period];
  }
  updateSelectedPeriodList(period, ctrlKey, shiftKey) {
    if ((ctrlKey && shiftKey) || shiftKey) {
      const periodIndex =
        period && period.hasOwnProperty('id') && this.availablePeriods
          ? this.availablePeriods.findIndex(
              (availablePeriod) => availablePeriod.id === period.id
            ) || 0
          : 0;

      this.selectedPeriodList =
        this.availablePeriods && this.availablePeriods.length >= 0
          ? uniqBy(
              [
                ...this.selectedPeriodList,
                ...this.availablePeriods.slice(0, periodIndex + 1),
              ],
              'id'
            ) || this.selectedPeriodList
          : [];
    } else if (ctrlKey) {
      const periodInList =
        period && period.hasOwnProperty('id')
          ? find(
              this.selectedPeriodList || [],
              (selectedPeriod) => selectedPeriod.id === period.id
            )
          : null;
      this.selectedPeriodList =
        periodInList && periodInList.hasOwnProperty('id')
          ? filter(
              this.selectedPeriodList || [],
              (periodListItem) => periodListItem.id !== periodInList.id
            ) || this.selectedPeriodList
          : [...this.selectedPeriodList, period];
    } else {
      this.selectedPeriodList = [...[], period];
    }
  }

  updateDeselectedPeriodList(period, ctrlKey, shiftKey) {
    if ((ctrlKey && shiftKey) || shiftKey) {
      const periodIndex =
        period && period.hasOwnProperty('id') && this.availablePeriods
          ? this.selectedPeriods.findIndex(
              (selectedPeriod) => selectedPeriod.id === period.id
            )
          : 0;

      this.deselectedPeriodList =
        this.selectedPeriods && this.selectedPeriods.length >= 0
          ? uniqBy(
              [
                ...this.deselectedPeriodList,
                ...this.selectedPeriods.slice(0, periodIndex + 1),
              ],
              'id'
            ) || this.deselectedPeriodList
          : [];
    } else if (ctrlKey) {
      const periodInList =
        period && period.hasOwnProperty('id')
          ? find(
              this.deselectedPeriodList || [],
              (deselectedPeriod) => deselectedPeriod.id === period.id
            )
          : null;
      this.deselectedPeriodList =
        periodInList && periodInList.hasOwnProperty('id')
          ? filter(
              this.deselectedPeriodList || [],
              (periodListItem) => periodListItem.id !== periodInList.id
            ) || this.deselectedPeriodList
          : [...this.deselectedPeriodList, period];
    } else {
      this.deselectedPeriodList = [...[], period];
    }
  }

  moveSelectedPeriods(e) {
    this.selectedPeriodList = flattenDeep(
      map(this.selectedPeriodList || [], (periodItem) => {
        this.onSelectPeriod(periodItem, e);
        const periodMoved =
          periodItem && periodItem.hasOwnProperty('id') && periodItem.id
            ? find(
                this.selectedPeriods || [],
                (selectedPeriod) => selectedPeriod.id === periodItem.id
              )
            : null;
        return periodMoved ? [] : periodItem;
      }) || []
    );
  }

  moveDeselectedPeriods(e) {
    this.deselectedPeriodList = flattenDeep(
      map(this.deselectedPeriodList || [], (periodItem) => {
        this.onDeselectPeriod(periodItem, e);
        const periodMoved =
          periodItem && periodItem.hasOwnProperty('id') && periodItem.id
            ? find(
                this.selectedPeriods || [],
                (selectedPeriod) => selectedPeriod.id === periodItem.id
              )
            : null;
        return periodMoved ? periodItem : [];
      }) || []
    );
  }

  isInArray(arr: any[], id) {
    const item = find(arr || [], (arrItem) => arrItem.id === id) || '';
    return item ? true : false;
  }

  onDeselectPeriod(period: any, e) {
    e.stopPropagation();

    // Remove period from selection list
    this.selectedPeriods = removePeriodFromList(this.selectedPeriods, period);

    // Add back the removed period to the available period if applicable
    this._setAvailablePeriods();

    if (this.periodFilterConfig.emitOnSelection) {
      this._onUpdatePeriod();
    }
  }

  onUpdatePeriodType(e, selectedPeriodType: string) {
    e.stopPropagation();
    if (this.periodFilterConfig.resetOnPeriodTypeChange) {
      this.selectedPeriods = [];
    }

    this.showPeriodTypeSelection = false;
    this.selectedPeriodType = selectedPeriodType;
    this.periodInstance.setType(this.selectedPeriodType).get();
    this.currentPeriodFilterType =
      this.selectedPeriodType.indexOf('Relative') !== -1
        ? PeriodFilterTypes.RELATIVE
        : PeriodFilterTypes.FIXED;

    this._setAvailablePeriods();
  }

  pushPeriod(e, direction: string) {
    e.stopPropagation();

    if (direction === 'NEXT') {
      this.selectedYear++;
    } else {
      this.selectedYear--;
    }

    this.periodInstance.setYear(this.selectedYear).get();
    this._setAvailablePeriods();
  }

  onSelectAllPeriods(e) {
    e.stopPropagation();

    // Add all period to selected bucket
    this.selectedPeriods = [...this.availablePeriods, ...this.selectedPeriods];

    // remove all periods from available
    this.availablePeriods = [];

    if (this.periodFilterConfig.emitOnSelection) {
      this._onUpdatePeriod();
    }
  }

  onDeselectAllPeriods(e) {
    e.stopPropagation();
    // remove all items from selected bucket
    this.selectedPeriods = [];

    // add to available period bucket
    this.availablePeriods = getAvailablePeriods([], this.periodInstance.list());

    if (this.periodFilterConfig.emitOnSelection) {
      this._onUpdatePeriod();
    }
  }

  onUpdate(e) {
    e.stopPropagation();
    this._onUpdatePeriod();
  }

  onClose(e) {
    e.stopPropagation();
    this.close.emit(this._getPeriodSelection());
  }

  onTogglePeriodTypeSelection(e) {
    e.stopPropagation();
    this.showPeriodTypeSelection = !this.showPeriodTypeSelection;
  }

  ngOnDestroy() {
    if (this.periodFilterConfig.emitOnDestroy) {
      this.close.emit(this._getPeriodSelection());
    }
  }

  private _getPeriodSelection() {
    return {
      items:
        PeriodFilterTypes.DATE_RANGE == this.currentPeriodFilterType
          ? filter(
              this.selectedPeriods || [],
              (period: any) =>
                period &&
                period.type &&
                `${period.type}`.toLocaleLowerCase() === 'dates-range'
            )
          : filter(
              this.selectedPeriods || [],
              (period: any) =>
                period &&
                period.type &&
                `${period.type}`.toLocaleLowerCase() !== 'dates-range'
            ),
      dimension: 'pe',
      lowestPeriodType: this.periodFilterConfig.lowestPeriodType,
      changed: true,
    };
  }

  private _onUpdatePeriod() {
    this.update.emit(this._getPeriodSelection());
  }

  private _setAvailablePeriods() {
    this.availablePeriods = getAvailablePeriods(
      this.selectedPeriods,
      this.periodInstance.list()
    );
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedPeriods,
      event.previousIndex,
      event.currentIndex
    );
  }
}
