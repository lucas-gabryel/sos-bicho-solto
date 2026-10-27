import { redirect } from 'next/navigation';

export default function RelatorioDoacoesRedirectPage() {
  redirect('/doacoes?tab=relatorio');
}
