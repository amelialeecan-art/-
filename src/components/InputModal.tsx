/**
 * 숫자/텍스트 입력 모달 (설정·온보딩 값 수정용)
 */
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useColors } from '../state/AppContext';
import { radius } from '../theme/typography';
import { AppButton } from './AppButton';

interface InputModalProps {
  visible: boolean;
  title: string;
  initialValue: string;
  /** 숫자 키패드 사용 */
  numeric?: boolean;
  unit?: string;
  placeholder?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export function InputModal({
  visible,
  title,
  initialValue,
  numeric,
  unit,
  placeholder,
  onClose,
  onSubmit,
}: InputModalProps) {
  const c = useColors();
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    if (visible) setText(initialValue);
  }, [visible, initialValue]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.center}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: c.card, borderColor: c.line }]}
            onPress={() => {}}
          >
            <Text style={[styles.title, { color: c.tx }]}>{title}</Text>
            <View style={[styles.inputWrap, { backgroundColor: c.inset, borderColor: c.line }]}>
              <TextInput
                value={text}
                onChangeText={setText}
                keyboardType={numeric ? 'number-pad' : 'default'}
                placeholder={placeholder}
                placeholderTextColor={c.tx3}
                style={[styles.input, { color: c.tx }]}
                autoFocus
                selectionColor={c.lime}
              />
              {unit ? <Text style={[styles.unit, { color: c.tx2 }]}>{unit}</Text> : null}
            </View>
            <View style={styles.actions}>
              <View style={styles.flex}>
                <AppButton label="취소" variant="secondary" onPress={onClose} />
              </View>
              <View style={styles.flex}>
                <AppButton
                  label="저장"
                  onPress={() => {
                    onSubmit(text.trim());
                    onClose();
                  }}
                />
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
  },
  unit: {
    fontSize: 15,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
});
