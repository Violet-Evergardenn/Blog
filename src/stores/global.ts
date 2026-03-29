import { create } from 'zustand'

interface GlobalState {
  bootComplete: boolean
  setBootComplete: (state: boolean) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  bootComplete: typeof sessionStorage !== 'undefined' ? !!sessionStorage.getItem('site_booted') : false,
  setBootComplete: (state) => set({ bootComplete: state }),
}))
