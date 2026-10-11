import Swal from 'sweetalert2'

export const showSuccessDialog = async (message: string) => {
  return Swal.fire({
    icon: 'success',
    title: 'Berhasil',
    text: message,
    timer: 1500,
    showConfirmButton: false,
  })
}

export const showErrorDialog = async (message: string) => {
  return Swal.fire({
    icon: 'error',
    title: 'Terjadi Kesalahan',
    text: message,
  })
}

export const showConfirmDialog = async (title: string, text: string): Promise<boolean> => {
  const result = await Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  })
  return Boolean(result.isConfirmed)
}

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}