import Swal from 'sweetalert2'

export async function showSuccessDialog(message: string): Promise<void> {
  await Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    confirmButtonColor: '#0284c7',
  })
}

export async function showErrorDialog(message: string): Promise<void> {
  await Swal.fire({
    icon: 'error',
    title: 'Terjadi Kesalahan',
    text: message,
    confirmButtonColor: '#b91c1c',
  })
}

export async function showConfirmDialog(title: string, message: string): Promise<boolean> {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#64748b',
  })
  return Boolean(result.isConfirmed)
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}