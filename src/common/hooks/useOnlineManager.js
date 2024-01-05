import { onlineManager } from '@tanstack/react-query';

export function useOnlineManager() {
  onlineManager.setOnline(true);
}
