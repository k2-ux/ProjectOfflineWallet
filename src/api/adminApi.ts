import { http } from './httpClient';

export const fetchAdminStats = async () => {
  return http('/admin/stats', {
    method: 'GET',
  });
};
