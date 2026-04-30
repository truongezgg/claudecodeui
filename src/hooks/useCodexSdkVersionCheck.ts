import { useEffect, useState } from 'react';
import { authenticatedFetch } from '../utils/api';

export interface CodexSdkVersionInfo {
  packageName: string;
  currentVersion: string | null;
  latestVersion: string | null;
  updateAvailable: boolean;
  upgradeCommand: string;
}

const POLL_INTERVAL_MS = 60 * 60 * 1000;

export const useCodexSdkVersionCheck = () => {
  const [info, setInfo] = useState<CodexSdkVersionInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const response = await authenticatedFetch('/api/codex/sdk-version');
        if (!response.ok) return;
        const data = (await response.json()) as CodexSdkVersionInfo;
        if (!cancelled) setInfo(data);
      } catch {
        // Silent fail — surfacing this would be noisier than helpful.
      }
    };

    check();
    const interval = window.setInterval(check, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return info;
};
