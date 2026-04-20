import { AvailableTime } from '@/shared/types';

/**
 * 1週間先から1ヶ月先までの日付リスト（土日除外）を返す
 */
export const DATE_UNTIL_NEXT_MONTH: string[] = Array.from({ length: 24 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 7);
  return date;
})
  .filter((date) => date.getDay() !== 0 && date.getDay() !== 6)
  .map((date) => date.toISOString().split('T')[0]);

// 利用可能な時間テーブル（09:00〜20:00, 30分刻み）
export const TIME_TABLE: AvailableTime[] = Array.from({ length: 22 }, (_, i) => {
  const startHour = 9 + Math.floor((i * 30) / 60);
  const startMinute = (i * 30) % 60;
  const endHour = 9 + Math.floor((i * 30 + 30) / 60);
  const endMinute = (i * 30 + 30) % 60;

  return {
    startTime: `${startHour < 10 ? '0' + startHour : startHour}:${startMinute === 0 ? '00' : '30'}`,
    endTime: `${endHour < 10 ? '0' + endHour : endHour}:${endMinute === 0 ? '00' : '30'}`,
    isAvailable: undefined,
  };
});
