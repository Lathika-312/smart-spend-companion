import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useExpenses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const todayExpenses = useQuery({
    queryKey: ['expenses', 'today', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('expenses')
        .select('*, categories(*)')
        .eq('expense_date', today)
        .order('expense_time', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const allExpenses = useQuery({
    queryKey: ['expenses', 'all', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*, categories(*)')
        .order('expense_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addExpense = useMutation({
    mutationFn: async (expense: { amount: number; description: string; category_id: string; expense_date: string; is_recurring?: boolean; recurring_interval?: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert({ ...expense, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; amount?: number; description?: string; category_id?: string }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  return { todayExpenses, allExpenses, addExpense, updateExpense, deleteExpense };
}

export function useCategories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const categories = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addCategory = useMutation({
    mutationFn: async (category: { name: string; icon: string; color: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({ ...category, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; icon?: string; color?: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { categories, addCategory, updateCategory, deleteCategory };
}

export function useIncome() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const income = useQuery({
    queryKey: ['income', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('income')
        .select('*')
        .order('income_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addIncome = useMutation({
    mutationFn: async (inc: { amount: number; description: string; income_date: string }) => {
      const { data, error } = await supabase
        .from('income')
        .insert({ ...inc, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
    },
  });

  return { income, addIncome };
}

export function useBudgets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const budgets = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from('budgets')
        .select('*, categories(*)')
        .eq('month', now.getMonth() + 1)
        .eq('year', now.getFullYear());
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const upsertBudget = useMutation({
    mutationFn: async (budget: { category_id: string; amount: number; month: number; year: number }) => {
      const { data, error } = await supabase
        .from('budgets')
        .upsert({ ...budget, user_id: user!.id }, { onConflict: 'user_id,category_id,month,year' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return { budgets, upsertBudget };
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profile = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user!.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return { profile, updateProfile };
}
