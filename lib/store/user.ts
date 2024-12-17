import { create } from 'zustand'
import {User} from '@supabase/supabase-js'
import { Iuser } from '../types'
    

interface UserState {
  user: Iuser | null
  setUser: (user: Iuser | null) => void
}

export const useUser = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set((state) => ({user})),
}))