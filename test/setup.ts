/**
 * VITest 설정 파일
 */

import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup();
});


