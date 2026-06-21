import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Linking, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { initials, avatarColor } from '../../lib/domain/tenants';
import { formatINR, monthKey, monthName } from '../../lib/domain/format';
import { calcPayroll, monthRecords, leaveUsed } from '../../lib/domain/payroll';
import { STAFF_ROLE_UI } from '../../constants/staffRole';
import {
  PhoneIcon,
  FileTextIcon,
  PencilIcon,
  TrashIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  XIcon,
} from '../icons';
import type { Staff, Attendance, LeaveRequest, StaffNote } from '../../types';

export function StaffDetailPanel({
  staff,
  attendance,
  leave,
  onClose,
  onPayslip,
  onEdit,
  onAddNote,
  onRemove,
}: {
  staff: Staff | null;
  attendance: Attendance[];
  leave: LeaveRequest[];
  onClose: () => void;
  onPayslip: (id: string) => void;
  onEdit: (id: string) => void;
  onAddNote: (id: string, note: StaffNote) => void;
  onRemove: (id: string) => void;
}) {
  const { width } = useWindowDimensions();
  const panelW = Math.min(width, 430);
  const open = !!staff;
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(open ? 0 : panelW, { duration: 260 }) }],
  }));

  const [draft, setDraft] = useState('');

  const ym = new Date().toISOString().slice(0, 7);
  const currentMonthName = monthName(ym);

  const c = staff ? calcPayroll(staff, monthRecords(attendance, staff.id, ym)) : null;
  const cl = staff?.leave?.cl ?? 12;
  const sl = staff?.leave?.sl ?? 6;
  const clUsed = staff ? leaveUsed(leave, staff.id, 'casual') : 0;
  const slUsed = staff ? leaveUsed(leave, staff.id, 'sick') : 0;

  const handleNote = (type: 'praise' | 'complaint') => {
    if (!staff || !draft.trim()) return;
    onAddNote(staff.id, {
      date: new Date().toISOString().slice(0, 10),
      text: draft.trim(),
      type,
    });
    setDraft('');
  };

  const sortedNotes = staff?.notes ? [...staff.notes].reverse() : [];

  return (
    <>
      {open && <Pressable onPress={onClose} className="absolute inset-0 z-40 bg-overlay" />}
      <Animated.View
        style={[{ position: 'absolute', top: 0, bottom: 0, right: 0, width: panelW, zIndex: 50 }, style]}
        className="bg-bg"
      >
        {staff && (
          <View className="h-full">
            {/* Brand header */}
            <View className="bg-brand px-6 pb-5 pt-6" style={{ position: 'relative' }}>
              <Pressable
                onPress={onClose}
                className="absolute right-[18px] top-[18px] h-8 w-8 items-center justify-center rounded-lg border border-[#ffffff2e] bg-[#ffffff14] active:bg-[#ffffff28]"
              >
                <XIcon size={16} color="#DCE7E1" />
              </Pressable>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-[52px] w-[52px] items-center justify-center rounded-[13px]"
                  style={{ backgroundColor: avatarColor(staff.name) }}
                >
                  <Text className="font-sans-semibold text-[19px] text-[#FBF8F0]">
                    {initials(staff.name)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-[#8FB0A5]">
                    {STAFF_ROLE_UI[staff.role].label}
                  </Text>
                  <Text className="font-serif mt-px text-[22px] text-[#FBF8F0]">{staff.name}</Text>
                  <Text className="mt-0.5 text-[12px] text-[#8FB0A5]">Joined {staff.joinDate}</Text>
                </View>
              </View>
            </View>

            {/* Scrollable body */}
            <ScrollView className="flex-1" contentContainerClassName="px-[22px] py-5 pb-[30px]">

              {/* Call button */}
              {!!staff.phone && (
                <Pressable
                  onPress={() => Linking.openURL('tel:' + staff.phone)}
                  className="mb-3.5 flex-row items-center justify-center gap-2 rounded-[9px] bg-brand py-2.5"
                >
                  <PhoneIcon size={14} color="#F4F1E7" />
                  <Text className="font-sans-semibold text-[13px] text-[#F4F1E7]">{staff.phone}</Text>
                </Pressable>
              )}

              {/* 2-col info grid */}
              <View className="mb-4 flex-row gap-2.5">
                <View className="flex-1 rounded-[10px] border border-border bg-surface px-[13px] py-3">
                  <Text className="font-sans-semibold text-[11px] uppercase tracking-wide text-soft">
                    ID PROOF
                  </Text>
                  <Text className="font-mono mt-[5px] text-[13.5px] text-text-2">
                    {staff.idProof || '—'}
                  </Text>
                </View>
                <View className="flex-1 rounded-[10px] border border-border bg-surface px-[13px] py-3">
                  <Text className="font-sans-semibold text-[11px] uppercase tracking-wide text-soft">
                    MONTHLY SALARY
                  </Text>
                  <Text className="font-mono-semibold mt-[4px] text-base text-ink">
                    {formatINR(staff.salary)}
                  </Text>
                </View>
              </View>

              {/* Attendance card */}
              {c && (
                <View className="mb-4 rounded-[12px] border border-border bg-surface p-4">
                  <View className="mb-3.5 flex-row items-center justify-between">
                    <Text className="font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-2">
                      ATTENDANCE · {currentMonthName.toUpperCase()}
                    </Text>
                    <Text className="font-mono-semibold text-[13px] text-ok">{c.attPct}%</Text>
                  </View>
                  <View className="flex-row gap-2">
                    {/* Present */}
                    <View className="flex-1 items-center rounded-[9px] bg-occ-bg py-[9px]">
                      <Text className="font-mono-semibold text-lg text-ok">{c.present}</Text>
                      <Text className="text-[10.5px] text-muted-2">Present</Text>
                    </View>
                    {/* Late */}
                    <View className="flex-1 items-center rounded-[9px] bg-pend-bg py-[9px]">
                      <Text className="font-mono-semibold text-lg text-warn">{c.late}</Text>
                      <Text className="text-[10.5px] text-muted-2">Late</Text>
                    </View>
                    {/* Absent */}
                    <View className="flex-1 items-center rounded-[9px] bg-maint-bg py-[9px]">
                      <Text className="font-mono-semibold text-lg text-bad">{c.absent}</Text>
                      <Text className="text-[10.5px] text-muted-2">Absent</Text>
                    </View>
                    {/* Leave */}
                    <View className="flex-1 items-center rounded-[9px] bg-surface-2 py-[9px]">
                      <Text className="font-mono-semibold text-lg text-muted-2">{c.leaveD}</Text>
                      <Text className="text-[10.5px] text-muted-2">Leave</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Leave balance card */}
              <View className="mb-4 flex-row gap-5 rounded-[12px] border border-border bg-surface px-4 py-3.5">
                <View className="flex-1">
                  <Text className="font-sans-semibold text-[11px] uppercase tracking-wide text-soft">
                    CASUAL LEAVE
                  </Text>
                  <Text className="font-mono-semibold mt-1 text-[15px] text-text">
                    {cl - clUsed}{' '}
                    <Text className="font-mono text-xs text-soft">/ {cl} left</Text>
                  </Text>
                </View>
                <View className="w-px bg-border" />
                <View className="flex-1">
                  <Text className="font-sans-semibold text-[11px] uppercase tracking-wide text-soft">
                    SICK LEAVE
                  </Text>
                  <Text className="font-mono-semibold mt-1 text-[15px] text-text">
                    {sl - slUsed}{' '}
                    <Text className="font-mono text-xs text-soft">/ {sl} left</Text>
                  </Text>
                </View>
              </View>

              {/* Performance Notes */}
              <Text className="mb-2.5 font-sans-semibold text-[11.5px] uppercase tracking-wide text-muted-2">
                PERFORMANCE NOTES
              </Text>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                multiline
                placeholder="Log a praise or complaint…"
                placeholderTextColor="#9A9A8A"
                className="min-h-[60px] rounded-[9px] border border-border bg-field px-3 py-2.5 text-[13px] text-text"
                style={{ textAlignVertical: 'top' }}
              />
              {/* Praise / Complaint buttons */}
              <View className="mb-3.5 mt-2.5 flex-row gap-2.5">
                <Pressable
                  onPress={() => handleNote('praise')}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border border-occ-bd bg-occ-bg py-2"
                >
                  <ThumbsUpIcon size={14} color="#1E6F5C" />
                  <Text className="font-sans-semibold text-[12.5px] text-ok">Praise</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleNote('complaint')}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border border-maint-bd bg-bad-bg py-2"
                >
                  <ThumbsDownIcon size={14} color="#B94040" />
                  <Text className="font-sans-semibold text-[12.5px] text-bad">Complaint</Text>
                </Pressable>
              </View>

              {/* Notes list */}
              {sortedNotes.length > 0 && (
                <View className="gap-2">
                  {sortedNotes.map((note, i) => (
                    <View
                      key={i}
                      className={`rounded-[9px] px-3 py-2.5 ${note.type === 'praise' ? 'bg-occ-bg' : 'bg-bad-bg'}`}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`mr-1.5 h-[7px] w-[7px] rounded-full ${note.type === 'praise' ? 'bg-ok' : 'bg-bad'}`}
                        />
                        <Text
                          className={`font-sans-bold text-[11px] uppercase ${note.type === 'praise' ? 'text-ok' : 'text-bad'}`}
                        >
                          {note.type === 'praise' ? 'PRAISE' : 'COMPLAINT'}
                        </Text>
                        <Text className="font-mono ml-auto text-[11px] text-soft">{note.date}</Text>
                      </View>
                      <Text className="mt-1.5 text-[13px] text-text-2">{note.text}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Generate Payslip */}
              <Pressable
                onPress={() => onPayslip(staff.id)}
                className="mt-1.5 flex-row items-center justify-center gap-2 rounded-[11px] border border-border bg-surface py-3"
              >
                <FileTextIcon size={15} color="#3A5247" />
                <Text className="font-sans-semibold text-[13.5px] text-ink">Generate Payslip</Text>
              </Pressable>

              {/* Edit + Remove row */}
              <View className="mt-2.5 flex-row gap-2.5">
                <Pressable
                  onPress={() => onEdit(staff.id)}
                  className="flex-1 flex-row items-center justify-center gap-1.5 rounded-[11px] bg-brand py-3"
                >
                  <PencilIcon size={14} color="#F4F1E7" />
                  <Text className="font-sans-semibold text-[13.5px] text-[#F4F1E7]">Edit Details</Text>
                </Pressable>
                <Pressable
                  onPress={() => onRemove(staff.id)}
                  className="w-[46px] items-center justify-center rounded-[11px] border border-maint-bd bg-surface"
                >
                  <TrashIcon size={16} color="#B94040" />
                </Pressable>
              </View>

            </ScrollView>
          </View>
        )}
      </Animated.View>
    </>
  );
}
