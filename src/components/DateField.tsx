/**
 * 날짜 선택 필드. 탭하면 네이티브 DateTimePicker 표시.
 */
import React, { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Field } from './Field';
import { formatSpaced } from '../lib/dateUtils';

interface DateFieldProps {
  label: string;
  /** ISO yyyy-mm-dd */
  value: string;
  onChange: (iso: string) => void;
  focus?: boolean;
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function DateField({ label, value, onChange, focus }: DateFieldProps) {
  const [show, setShow] = useState(false);
  const date = new Date(`${value}T00:00:00`);

  return (
    <>
      <Field
        label={label}
        value={formatSpaced(date)}
        focus={focus}
        numericValue
        onPress={() => setShow(true)}
      />
      {show ? (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, selected) => {
            setShow(Platform.OS === 'ios');
            if (event.type === 'dismissed') {
              setShow(false);
              return;
            }
            if (selected) onChange(toISO(selected));
          }}
        />
      ) : null}
    </>
  );
}
