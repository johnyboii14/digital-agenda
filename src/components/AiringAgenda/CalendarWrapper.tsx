// src/components/CalendarWrapper.tsx

import { Calendar as BigCalendar, CalendarProps } from 'react-big-calendar';
import React from 'react';

// ✅ Use type assertion to bypass React 18 JSX error
const CalendarWrapper = BigCalendar as unknown as React.FC<CalendarProps<object, object>>;

export default CalendarWrapper;
