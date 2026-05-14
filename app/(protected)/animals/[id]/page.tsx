'use client';

import { ArrowLeft, Edit2, Mars, Trash2, Users, Venus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnimal } from '@/hooks/use-animal';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';
import { DeleteConfirmationModal } from '../_components/delete-confirmation-modal';

function speciesEmoji(esp: string) {
  return esp === 'Cão' ? '🐶' : '🐱';
}

export default function AnimalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const animalId = params.id as string;

  const { data: animal, isLoading: isLoadingAnimal } = useAnimal(animalId);
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isProtector = currentUser?.role === 'Protetor';
  const isLoading = isLoadingAnimal || isLoadingUser;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simular exclusão
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/animals');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="size-5" />
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 space-y-6 p-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </Card>

          <Card className="h-fit space-y-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="p-4 md:p-7">
        <Link href="/animals">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Animal não encontrado</p>
        </div>
      </div>
    );
  }

  const adopted = animal.status === 'Adotado';

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/animals">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{animal.nome}</h1>
          <p className="text-sm text-muted-foreground">{animal.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <Card className="md:col-span-2 space-y-6 p-6">
          {/* Species Emoji Section */}
          <div className="flex h-40 items-center justify-center rounded-lg bg-muted/50 text-6xl">
            {speciesEmoji(animal.esp)}
          </div>

          {/* Status and Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Informações Básicas</h2>
              <Badge
                className={cn(
                  'h-auto gap-1.5 rounded-full border-transparent px-3 py-1 text-xs font-semibold',
                  adopted
                    ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    adopted ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-400',
                  )}
                />
                {adopted ? 'Adotado' : 'Acolhimento'}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Espécie" value={animal.esp} />
              <InfoField label="Raça" value={animal.raca} />
              <InfoField
                label="Sexo"
                value={
                  <div className="flex items-center gap-2">
                    {animal.sexo === 'Macho' ? (
                      <Mars className="size-4 text-blue-600" />
                    ) : (
                      <Venus className="size-4 text-pink-600" />
                    )}
                    <span>{animal.sexo}</span>
                  </div>
                }
              />
              <InfoField label="Cor" value={animal.cor} />
              <InfoField label="Peso Inicial" value={`${animal.peso.toFixed(1)} kg`} />
              {animal.pesoAt && <InfoField label="Peso Atual" value={`${animal.pesoAt.toFixed(1)} kg`} />}
            </div>
          </div>

          {/* Location and Observations */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-lg font-semibold text-foreground">Detalhes Adicionais</h2>

            <div className="space-y-3">
              <InfoField label="Localização" value={animal.local} />
              <InfoField label="Data de Registro" value={animal.data} />
              {animal.obs && <InfoField label="Observações" value={animal.obs} />}
            </div>
          </div>
        </Card>

        {/* Sidebar with Actions */}
        {!isProtector && (
          <Card className="h-fit space-y-3 p-6">
            <h3 className="font-semibold text-foreground">Ações</h3>

            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href={`/animals/${animal.id}/edit`}>
                <Edit2 className="mr-2 size-4" />
                Editar
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="mr-2 size-4" />
              Excluir
            </Button>

            {adopted ? (
              <Button variant="outline" size="sm" className="w-full justify-start" disabled>
                <Users className="mr-2 size-4" />
                Vincular Tutor
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/animals/${animal.id}/link-tutor`}>
                  <Users className="mr-2 size-4" />
                  Vincular Tutor
                </Link>
              </Button>
            )}
          </Card>
        )}
      </div>

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title="Excluir animal"
        description={`Tem certeza que deseja excluir ${animal.nome}? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
      />
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
