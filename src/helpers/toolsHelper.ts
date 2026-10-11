import Swal from 'sweetalert2'

export async function showSuccessDialog(message: string): Promise<void> {
  await Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 1500,
    showConfirmButton: false,
  })
}

export async function showErrorDialog(message: string): Promise<void> {
  await Swal.fire({
    icon: 'error',
    title: 'Terjadi Kesalahan',
    text: message,
  })
}

export async function showConfirmDialog(title: string, text: string): Promise<boolean> {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  })
  return result.isConfirmed
}

export function formatRupiah(amount?: number | string): string {
  if (amount === undefined || amount === null || amount === '') return '-'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '-'
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}