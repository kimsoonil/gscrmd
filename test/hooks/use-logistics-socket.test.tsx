import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useLogisticsSocket } from '@/hooks/use-logistics-socket';
import { useLogisticsStore } from '@/store/logistics-store';
class FakeSocket {
  static latest: FakeSocket;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose = null; onerror = null;
  close = vi.fn();
  constructor() { FakeSocket.latest = this; }
}
afterEach(() => vi.unstubAllGlobals());
it('flushes a single message on the next frame and discards pending data on disconnect', async () => {
  vi.stubGlobal('WebSocket', FakeSocket);
  const update = vi.spyOn(useLogisticsStore.getState(), 'updateDataBatch').mockImplementation(() => {});
  const { unmount } = renderHook(() => useLogisticsSocket({ url: 'ws://localhost/test', enabled: true }));
  act(() => FakeSocket.latest.onmessage?.({ data: JSON.stringify({ id: 'one' }) }));
  await waitFor(() => expect(update).toHaveBeenCalledWith([{ id: 'one' }]));
  act(() => FakeSocket.latest.onmessage?.({ data: JSON.stringify({ id: 'discard' }) }));
  unmount();
  expect(FakeSocket.latest.close).toHaveBeenCalledOnce();
  expect(update).toHaveBeenCalledTimes(1);
  update.mockRestore();
});
