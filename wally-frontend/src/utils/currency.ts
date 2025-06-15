export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatNumber = (
  number: number,
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale).format(number)
}

export const formatCompactCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  if (amount >= 1000000) {
    return `${formatCurrency(amount / 1000000, currency, locale).replace(/\.0+/, '')}M`
  } else if (amount >= 1000) {
    return `${formatCurrency(amount / 1000, currency, locale).replace(/\.0+/, '')}K`
  }
  return formatCurrency(amount, currency, locale)
}
