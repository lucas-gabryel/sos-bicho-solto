'use client';

import { LoaderCircle, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCreateUser } from '@/hooks/use-create-user';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useDeleteUser } from '@/hooks/use-delete-user';
import { useUsers } from '@/hooks/use-users';
import { formatDateToPtBr } from '@/lib/tutor';
import { getRoleLabel } from '@/lib/user';
import type { CreateUserFormValues } from '@/types/user';
import { DeleteConfirmationModal } from '../animals/_components/delete-confirmation-modal';
import { UserFormModal } from './_components/user-form-modal';

export default function UsersPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const canManageUsers = currentUser?.role === 'admin';
  const { data: users = [], isLoading: isUsersLoading } = useUsers({ enabled: canManageUsers });
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false,
    userId: '',
    userName: '',
  });

  useEffect(() => {
    if (isCurrentUserLoading) {
      return;
    }

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    if (currentUser.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [currentUser, isCurrentUserLoading, router]);

  const filteredUsers = users.filter((user) => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [user.name, user.email, getRoleLabel(user.role)].join(' ').toLowerCase().includes(query);
  });

  const handleCreateUser = async (values: CreateUserFormValues) => {
    await createUser.mutateAsync({
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
    });
  };

  const openDeleteModal = (userId: string, userName: string) => {
    setDeleteModal({ open: true, userId, userName });
  };

  const handleConfirmDelete = async () => {
    await deleteUser.mutateAsync(deleteModal.userId);
    setDeleteModal({ open: false, userId: '', userName: '' });
  };

  if (isCurrentUserLoading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm">
          Carregando usuários...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-foreground">Usuários do sistema</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Controle de acesso de administradores e protetores
            </p>
          </div>

          <Button variant="primary" size="default" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="size-4" />
            Novo usuário
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-45 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail ou perfil..."
              className="pl-9 text-[13px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {isUsersLoading ? (
          <div className="rounded-[14px] border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            Carregando usuários...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border py-16 text-muted-foreground">
            <ShieldCheck className="size-10 opacity-30" />
            <p className="text-sm">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-border bg-card">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                  {['Nome', 'E-mail', 'Perfil', 'Criado em', 'Ações'].map((header) => (
                    <TableHead
                      key={header}
                      className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-b border-border">
                    <TableCell className="px-5 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{user.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-[13px] text-foreground">{user.email}</TableCell>
                    <TableCell className="px-5 py-3">
                      <Badge
                        className={
                          user.role === 'admin'
                            ? 'rounded-full border-transparent bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                            : 'rounded-full border-transparent bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        }
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-[12px] text-muted-foreground">
                      {formatDateToPtBr(user.createdAt)}
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteUser.isPending || user.id === currentUser.id}
                        title={
                          user.id === currentUser.id
                            ? 'Não é permitido excluir o próprio usuário com a sessão aberta.'
                            : undefined
                        }
                        onClick={() => openDeleteModal(user.id, user.name)}
                      >
                        <Trash2 className="size-4" />
                        {deleteUser.isPending && deleteUser.variables === user.id ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {isCreateModalOpen ? (
        <UserFormModal
          open={isCreateModalOpen}
          isPending={createUser.isPending}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateUser}
        />
      ) : null}

      {createUser.isPending ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-60 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
          <LoaderCircle className="size-4 animate-spin" />
          Criando usuário...
        </div>
      ) : null}

      <DeleteConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirmDelete}
        title={`Excluir usuário`}
        description={`Deseja excluir o usuário ${deleteModal.userName}? Essa ação remove apenas o cadastro mockado.`}
        isLoading={deleteUser.isPending}
      />

      {deleteUser.isPending ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-60 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
          <LoaderCircle className="size-4 animate-spin" />
          Excluindo usuário...
        </div>
      ) : null}
    </>
  );
}
