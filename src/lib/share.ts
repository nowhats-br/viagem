import { Reservation, ExcursionSettings } from '../types';
import { generatePdfBlob } from './pdf';

export const shareTicket = async (
  reservation: Reservation,
  settings: ExcursionSettings,
  ticketElementId: string
): Promise<void> => {
  try {
    const pdfBlob = await generatePdfBlob(ticketElementId);
    const pdfFile = new File([pdfBlob], `passagem-reserva-${reservation.id}.pdf`, { type: 'application/pdf' });

    const passenger = reservation.passengers[0];
    
    const formatDate = (dateString: string) => {
      if (!dateString) return '--/--/----';
      return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    const text = `Olá, ${passenger.name}!\n\n` +
                 `Sua passagem para a 42ª AGO COMADESMA está confirmada. Seguem os detalhes e o bilhete em anexo.\n\n` +
                 `*Passageiro:* ${passenger.name}\n` +
                 `*Poltrona:* ${String(passenger.seat_number).padStart(2, '0')}\n` +
                 `*Tipo:* ${passenger.seat_type.replace('-', ' ')}\n` +
                 `*Embarque:* ${formatDate(settings.start_date)}\n` +
                 `*Retorno:* ${formatDate(settings.end_date)}\n\n` +
                 `Uma ótima viagem!`;

    const shareData = {
      files: [pdfFile],
      title: `Passagem - Reserva #${String(reservation.id).padStart(6, '0')}`,
      text: text,
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // Fallback for desktop or unsupported browsers
      alert('O compartilhamento de arquivos não é suportado neste navegador. O PDF será baixado para que você possa compartilhar manualmente.');
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passagem-reserva-${reservation.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Erro ao compartilhar passagem:', error);
    alert('Não foi possível compartilhar a passagem. Tente novamente.');
  }
};
