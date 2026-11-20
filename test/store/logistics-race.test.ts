import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processLogisticsData } from '@/utils/logistics-processor';
import { useLogisticsStore } from '@/store/logistics-store';
import type { ProcessedLogisticsData, RawLogisticsData } from '@/types/logistics';
vi.mock('@/utils/logistics-processor', () => ({ processLogisticsData: vi.fn() }));
const row = (id: string, timestamp = 1): RawLogisticsData => ({ id, vehicleId: id, timestamp, longitude: 127, latitude: 37.5, status: 'pending' });
describe('concurrent vehicle updates', () => {
  beforeEach(() => {
    vi.mocked(processLogisticsData).mockReset();
    useLogisticsStore.setState({ rawData: [], visibleData: [], isLoading: false, error: null });
  });
  it('keeps the newest processing result when older work finishes last', async () => {
    let finishOld!: (value: ProcessedLogisticsData[]) => void;
    vi.mocked(processLogisticsData).mockImplementationOnce(() => new Promise(resolve => { finishOld = resolve; })).mockResolvedValueOnce([]);
    const old = useLogisticsStore.getState().setRawData([row('old')]);
    await useLogisticsStore.getState().setRawData([row('new')]);
    finishOld([{ id: 'old' } as ProcessedLogisticsData]);
    await old;
    expect(useLogisticsStore.getState().rawData[0].id).toBe('new');
    expect(useLogisticsStore.getState().visibleData).toEqual([]);
  });
  it('retains separate batches and replaces a vehicle only with a newer update', async () => {
    vi.mocked(processLogisticsData).mockResolvedValue([]);
    const store = useLogisticsStore.getState();
    store.updateDataBatch([row('a', 2)]);
    store.updateDataBatch([row('b'), row('a', 3)]);
    store.updateDataBatch([row('a', 1)]);
    expect(useLogisticsStore.getState().rawData.map(x => [x.id,x.timestamp])).toEqual([['a',3],['b',1]]);
  });
});
