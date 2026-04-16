import { useMemo, useState } from 'react';
import { ReservationListResponse } from '@/shared/types';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const useCalendarNavigation = (data: ReservationListResponse[]) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const days: Array<{
      date: number | null;
      reservations: ReservationListResponse[];
      dayOfWeek: number;
    }> = [];

    for (let date = 1; date <= daysInMonth; date++) {
      const d = new Date(year, month, date);
      const dayOfWeek = d.getDay();
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const dayReservations = data.filter((item) => item.reservationDate === dateStr);
      days.push({ date, reservations: dayReservations, dayOfWeek });
    }

    const firstWeekday = days.length > 0 ? days[0].dayOfWeek : 0;
    for (let i = 0; i < firstWeekday; i++) {
      days.unshift({ date: null, reservations: [], dayOfWeek: -1 });
    }

    const remainingInLastWeek = days.length % 7;
    if (remainingInLastWeek !== 0) {
      for (let i = 0; i < 7 - remainingInLastWeek; i++) {
        days.push({ date: null, reservations: [], dayOfWeek: -1 });
      }
    }

    return days;
  }, [year, month, data]);

  const today = new Date();
  const isToday = (date: number | null) => {
    if (date === null) return false;
    return date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return { year, month, calendarDays, isToday, handlePrevMonth, handleNextMonth, handleToday };
};
