import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';

import {
  AvatarComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardSubtitleDirective,
  CardTitleDirective,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular-pro';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { getStyle } from '@coreui/utils';
import { WidgetsDropdownVerticalComponent } from '../widgets/widgets-dropdown-vertical/widgets-dropdown-vertical.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

const avatar2 = './assets/images/avatars/2.jpg';
const avatar3 = './assets/images/avatars/3.jpg';
const avatar1 = './assets/images/avatars/1.jpg';
const avatar4 = './assets/images/avatars/4.jpg';
const avatar5 = './assets/images/avatars/5.jpg';
const avatar6 = './assets/images/avatars/6.jpg';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    NgStyle,
    AvatarComponent,
    ButtonDirective,
    CardComponent,
    CardBodyComponent,
    CardSubtitleDirective,
    CardTitleDirective,
    ChartjsComponent,
    ColComponent,
    IconDirective,
    ProgressComponent,
    RowComponent,
    TableDirective,
    WidgetsDropdownVerticalComponent
  ]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  readonly #salesChartRef: WritableSignal<any> = signal(undefined);
  readonly #trafficChartRef: WritableSignal<any> = signal(undefined);

  readonly #chartRefsEffect = effect(() => {
    if (this.#salesChartRef() && this.#trafficChartRef()) {
      this.updateChartOnColorModeChange();
    }
  });

  public salesChart: IChartProps = {};
  public trafficChart: IChartProps = {};

  public progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 }
  ];
  public progressGroupExample2 = [
    { title: 'Male', icon: 'cilUser', value: 53 },
    { title: 'Female', icon: 'cilUserFemale', value: 43 }
  ];
  public progressGroupExample3 = [
    { title: 'Organic Search', icon: 'cibGoogle', percent: 56, value: '191,235' },
    { title: 'Facebook', icon: 'cibFacebook', percent: 15, value: '51,223' },
    { title: 'Twitter', icon: 'cibTwitter', percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: 'cibLinkedin', percent: 8, value: '27,319' }
  ];
  public tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 10, 2023'
      },
      country: { name: 'USA', flag: 'cifUs' },
      usage: {
        value: 50,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success'
      },
      activity: '10 seconds ago'
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 10, 2023'
      },
      country: { name: 'Brazil', flag: 'cifBr' },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'info'
      },
      activity: '5 minutes ago'
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 10, 2023' },
      country: { name: 'India', flag: 'cifIn' },
      usage: {
        value: 74,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'warning'
      },
      activity: '1 hour ago'
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 10, 2023' },
      country: { name: 'France', flag: 'cifFr' },
      usage: {
        value: 98,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'danger'
      },
      activity: '1 week ago'
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tadeáš',
        new: true,
        registered: 'Jan 10, 2023'
      },
      country: { name: 'Spain', flag: 'cifEs' },
      usage: {
        value: 22,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'primary'
      },
      activity: '3 months ago'
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik Dávid',
        new: true,
        registered: 'Jan 10, 2023'
      },
      country: { name: 'Poland', flag: 'cifPl' },
      usage: {
        value: 43,
        period: 'Jun 11, 2023 - Jul 10, 2023',
        color: 'success'
      },
      activity: '1 year ago'
    }
  ];

  ngOnInit(): void {
    this.listenColorModeChange();
    this.initCharts();
  }

  initCharts(): void {
    this.salesChart = this.#chartsData.salesChart;
    this.trafficChart = this.#chartsData.trafficChart;
  }

  handleChartRef($chartRef: any, chartName: string) {
    if ($chartRef) {
      switch (chartName) {
        case 'traffic':
          this.#trafficChartRef.set($chartRef);
          break;
        case 'sales':
          this.#salesChartRef.set($chartRef);
          break;
      }
    }
  }

  listenColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.updateChartOnColorModeChange();
    });
    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  updateChartOnColorModeChange() {
    if (this.#trafficChartRef()) {
      setTimeout(() => {
        const scales = { ...this.#trafficChartRef().options.scales };
        scales.x.grid.color = getStyle('--cui-border-color-translucent');
        scales.x.ticks.color = getStyle('--cui-body-color');
        scales.y.grid.color = getStyle('--cui-border-color-translucent');
        scales.y.ticks.color = getStyle('--cui-body-color');
        this.#trafficChartRef().update();
      });
    }
    if (this.#salesChartRef()) {
      setTimeout(() => {
        this.#salesChartRef().data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
        this.#salesChartRef().update();
      });
    }
  }
}
