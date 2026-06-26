import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getTutors, type ListTutorsParams } from '@/services/tutor.service';

export const tutorKeys = {
  all: ['tutors'] as const,
  list: (params: ListTutorsParams) => ['tutors', 'list', params] as const,
  detail: (id: string) => ['tutors', id] as const,
};

export function useTutors(params: ListTutorsParams = {}) {
  return useQuery({
    queryKey: tutorKeys.list(params),
    queryFn: () => getTutors(params),
    placeholderData: keepPreviousData,
  });
}
