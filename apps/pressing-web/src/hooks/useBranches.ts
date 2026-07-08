import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const BRANCHES_KEY = 'branches';

export const useBranches = (tenantId: string) => {
  return useQuery({
    queryKey: [BRANCHES_KEY, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/branches?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (branchData: any) => {
      const { data } = await api.post('/branches', branchData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRANCHES_KEY] });
    },
  });
};
