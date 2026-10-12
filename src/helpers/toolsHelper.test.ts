import { describe, it, expect, vi } from 'vitest'
import Swal from 'sweetalert2'
import {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  formatRupiah,
  formatDateTime,
} from './toolsHelper'

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}))

describe('toolsHelper', () => {
  it('memanggil Swal.fire untuk showSuccessDialog', async () => {
    await showSuccessDialog('Berhasil disimpan')
    expect(SwapFire()).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'success',
        title: 'Berhasil',
        text: 'Berhasil disimpan',
      })
    )
  })

  it('memanggil Swal.fire untuk showErrorDialog', async () => {
    await showErrorDialog('Terjadi galat')
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Terjadi galat',
      })
    )
  })

  it('mengembalikan true saat dialog konfirmasi disetujui', async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as any)
    const result = await showConfirmDialog('Hapus?', 'Apakah yakin?')
    expect(result).toBe(true)
  })

  it('mengembalikan false saat dialog konfirmasi dibatalkan', async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as any)
    const result = await showConfirmDialog('Hapus?', 'Apakah yakin?')
    expect(result).toBe(false)
  })

  it('formatRupiah memformat angka ke format mata uang IDR', () => {
    const formatted = formatRupiah(50000)
    expect(formatted).toContain('50.000')
    expect(formatted).toContain('Rp')
  })

  it('formatRupiah menangani nilai kosong, string angka, dan nilai tidak valid', () => {
    expect(formatRupiah()).toBe('-')
    expect(formatRupiah(undefined)).toBe('-')
    expect(formatRupiah(null as any)).toBe('-')
    expect(formatRupiah('')).toBe('-')
    expect(formatRupiah('abc')).toBe('-')
    expect(formatRupiah(NaN)).toBe('-')
    expect(formatRupiah('1500')).toBe('Rp 1.500')
    expect(formatRupiah(0)).toBe('Rp 0')
  })

  it('formatDateTime memformat tanggal ISO ke format Indonesia', () => {
    expect(formatDateTime('')).toBe('-')
    expect(formatDateTime('invalid-date')).toBe('-')
    const validFormatted = formatDateTime('2026-03-15T10:30:00Z')
    expect(validFormatted).not.toBe('-')
  })
})

function SwapFire() {
  return Swal.fire
}