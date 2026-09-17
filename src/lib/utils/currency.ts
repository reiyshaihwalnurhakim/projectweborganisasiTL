export function formatRupiah(amount: number | string | any): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  
  if (isNaN(num)) return 'Rp 0'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}
