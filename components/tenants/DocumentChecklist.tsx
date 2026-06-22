import { useState } from 'react';
import { View, Text, Pressable, Modal as RNModal } from 'react-native';
import { Image } from 'expo-image';
import { ALL_DOCS } from '../../constants/documents';
import { useTenantDocuments } from '../../lib/db/hooks';
import { CheckIcon } from '../icons';
import type { Tenant } from '../../types';

// One document checklist, shared by the tenant panel and the room panel so the
// SAME tenant's documents behave identically wherever they're opened:
//  - the tick is automatic (it reflects whether a scan is actually on file)
//  - each row has explicit Add / View (thumbnail) / Remove actions
export function DocumentChecklist({ tenant, onAdd, onRemove }: {
  tenant: Tenant;
  onAdd: (tenant: Tenant, label: string) => void;
  onRemove: (tenant: Tenant, label: string) => void;
}) {
  const [viewScan, setViewScan] = useState<string | null>(null);
  // Scans now live in a subcollection (merged with any legacy inline photos).
  const photos = useTenantDocuments(tenant.id, tenant.documentPhotos);
  const scanCount = Object.keys(photos).length;

  return (
    <View className="mt-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-[11px] font-sans-semibold uppercase tracking-wide text-muted-2">Documents</Text>
        <Text className={`font-mono-semibold text-[12px] ${scanCount === ALL_DOCS.length ? 'text-ok' : 'text-warn'}`}>{scanCount}/{ALL_DOCS.length}</Text>
      </View>
      {ALL_DOCS.map((d) => {
        const scan = photos[d];
        const has = !!scan;
        return (
          <View key={d} className="flex-row items-center gap-2.5 rounded-md px-1 py-[6px]">
            {/* Tick is automatic — it reflects whether a scan is on file, not a manual toggle */}
            <View className={`h-[18px] w-[18px] items-center justify-center rounded-[5px] border ${has ? 'border-accent bg-accent' : 'border-border bg-surface-2'}`}>{has && <CheckIcon size={11} color="#FBF8F0" />}</View>
            <Text className={`flex-1 text-[13px] ${has ? 'text-text-2' : 'text-soft'}`}>{d}</Text>
            {scan ? (
              <View className="flex-row items-center gap-2">
                <Pressable onPress={() => setViewScan(scan)} className="active:opacity-70"><Image source={{ uri: scan }} style={{ width: 34, height: 24, borderRadius: 4 }} contentFit="cover" /></Pressable>
                <Pressable onPress={() => onRemove(tenant, d)} className="rounded-md px-2 py-1 active:bg-bad-bg"><Text className="text-[11.5px] font-sans-semibold text-bad">Remove</Text></Pressable>
              </View>
            ) : (
              <Pressable onPress={() => onAdd(tenant, d)} className="rounded-md border border-border bg-surface px-2.5 py-1 active:bg-surface-2"><Text className="text-[11.5px] font-sans-semibold text-brand">Add</Text></Pressable>
            )}
          </View>
        );
      })}

      {/* Full-screen scan preview — the "View" action on a document */}
      {viewScan && (
        <RNModal visible transparent animationType="fade" onRequestClose={() => setViewScan(null)}>
          <Pressable onPress={() => setViewScan(null)} style={{ flex: 1, backgroundColor: 'rgba(10,20,15,0.92)' }} className="items-center justify-center p-6">
            <Image source={{ uri: viewScan }} style={{ width: '100%', height: '82%', borderRadius: 12 }} contentFit="contain" />
            <Text className="mt-4 text-[13px] font-sans-medium text-[#DCE7E1]">Tap anywhere to close</Text>
          </Pressable>
        </RNModal>
      )}
    </View>
  );
}
