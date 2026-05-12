import { useQuery } from '@tanstack/react-query';

import { getTutors } from '@/services/tutor.service';

export const tutorKeys = {
  all: ['tutors'] as const,
  detail: (id: string) => ['tutors', id] as const,
};

export function useTutors() {
  return useQuery({
    queryKey: tutorKeys.all,
    queryFn: getTutors,
  });
}
