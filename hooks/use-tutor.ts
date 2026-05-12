import { useQuery } from '@tanstack/react-query';

import { tutorKeys } from '@/hooks/use-tutors';
import { getTutorById } from '@/services/tutor.service';

export function useTutor(id: string) {
  return useQuery({
    queryKey: tutorKeys.detail(id),
    queryFn: () => getTutorById(id),
    enabled: Boolean(id),
  });
}
