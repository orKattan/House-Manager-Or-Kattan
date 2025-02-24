declare module 'react-big-calendar' {
  import { ComponentType, ReactNode } from 'react';

  export interface CalendarProps {
    localizer: any;
    events: any[];
    startAccessor: string;
    endAccessor: string;
    style?: React.CSSProperties;
    views?: any;
    defaultView?: any;
    onSelectEvent?: (event: any) => void;
    components?: {
      agenda?: {
        event?: ComponentType<any>;
        date?: ComponentType<any>;
        time?: ComponentType<any>;
      };
    };
  }

  export const Calendar: ComponentType<CalendarProps>;
  export const momentLocalizer: (momentInstance: any) => any;
  export const Views: any;
}
