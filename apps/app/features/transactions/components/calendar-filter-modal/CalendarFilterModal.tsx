import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Icon } from "@/components/icons/Icon";
import i18n, { t } from "@/lib/i18n";

import {
  calendarFilterModalColors,
  styles,
} from "./calendarFilterModal.styles";
import { CalendarFilterModalProps, DateRange } from "@repo/shared-types";

const WEEK_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function CalendarFilterModal({
  visible,
  selectedRange,
  onClose,
  onApply,
}: CalendarFilterModalProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [draftRange, setDraftRange] = useState<DateRange>(selectedRange);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const { BLACK } = calendarFilterModalColors;

  const monthDays = useMemo(() => {
    return getCalendarMonthDays(currentMonth);
  }, [currentMonth]);

  const monthTitle = useMemo(() => {
    return currentMonth.toLocaleDateString(i18n.locale, {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  function handleClose() {
    setDraftRange(selectedRange);
    onClose();
  }

  function handlePreviousMonth() {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() - 1);
      return next;
    });
  }

  function handleNextMonth() {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  }

  function handleSelectDay(date: Date) {
    setDraftRange((prev) => {
      if (!prev.startDate || prev.endDate) {
        return {
          startDate: date,
          endDate: null,
        };
      }

      if (isSameDay(prev.startDate, date)) {
        return {
          startDate: null,
          endDate: null,
        };
      }

      if (date < prev.startDate) {
        return {
          startDate: date,
          endDate: prev.startDate,
        };
      }

      return {
        startDate: prev.startDate,
        endDate: date,
      };
    });
  }

  function handleClear() {
    setDraftRange({
      startDate: null,
      endDate: null,
    });
  }

  function handleApply() {
    onApply(draftRange);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={[styles.backdrop, isDesktop && styles.backdropDesktop]}
        onPress={handleClose}
      >
        <Pressable
          style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
              {t("transactions.calendarFilter.title")}
            </Text>

            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={15} color={BLACK} />
            </Pressable>
          </View>

          <View style={styles.monthHeader}>
            <Pressable
              onPress={handlePreviousMonth}
              style={styles.monthArrowButton}
            >
              <Icon
                name="arrowLeft"
                size={20}
                strokeWidth={1.5}
                color={BLACK}
              />
            </Pressable>

            <Text
              style={[styles.monthTitle, isDesktop && styles.monthTitleDesktop]}
            >
              {monthTitle}
            </Text>

            <Pressable
              onPress={handleNextMonth}
              style={styles.monthArrowButton}
            >
              <Icon
                name="arrowRight"
                size={20}
                strokeWidth={1.5}
                color={BLACK}
              />
            </Pressable>
          </View>

          <View style={styles.weekDaysRow}>
            {WEEK_DAY_KEYS.map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {t(`common.weekDays.${day}`)}
              </Text>
            ))}
          </View>

          <View style={[styles.daysGrid, isDesktop && styles.daysGridDesktop]}>
            {monthDays.map((day, index) => {
              if (!day) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={[
                      styles.dayCell,
                      isDesktop && styles.dayCellDesktop,
                    ]}
                  />
                );
              }

              const isStart =
                draftRange.startDate && isSameDay(day, draftRange.startDate);

              const isEnd =
                draftRange.endDate && isSameDay(day, draftRange.endDate);

              const isBetween =
                draftRange.startDate &&
                draftRange.endDate &&
                day > draftRange.startDate &&
                day < draftRange.endDate;

              const isSelected = isStart || isEnd;

              return (
                <Pressable
                  key={day.toISOString()}
                  style={[
                    styles.dayCell,
                    isDesktop && styles.dayCellDesktop,
                    isBetween && styles.dayCellBetween,
                    isSelected && styles.dayCellSelected,
                    isSelected && isDesktop && styles.dayCellSelectedDesktop,
                    isStart && draftRange.endDate && styles.dayCellStart,
                    isEnd && styles.dayCellEnd,
                  ]}
                  onPress={() => handleSelectDay(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isBetween && styles.dayTextBetween,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.actions, isDesktop && styles.actionsDesktop]}>
            <Pressable style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>
                {t("transactions.calendarFilter.clear")}
              </Text>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>
                {t("transactions.calendarFilter.applyFilter")}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function getCalendarMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const firstWeekDay = getMondayBasedWeekDay(firstDayOfMonth);
  const totalDays = lastDayOfMonth.getDate();

  const days: Array<Date | null> = [];

  for (let i = 0; i < firstWeekDay; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getMondayBasedWeekDay(date: Date) {
  const day = date.getDay();

  if (day === 0) {
    return 6;
  }

  return day - 1;
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}