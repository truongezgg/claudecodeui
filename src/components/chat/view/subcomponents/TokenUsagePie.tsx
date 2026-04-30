import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../../../shared/view/ui';

type TokenUsagePieProps = {
  used: number;
  total: number;
};

export default function TokenUsagePie({ used, total }: TokenUsagePieProps) {
  const { t } = useTranslation('chat');
  const [isOpen, setIsOpen] = useState(false);

  // Token usage visualization component
  // Only bail out on missing values or non‐positive totals; allow used===0 to render 0%
  if (used == null || total == null || total <= 0) return null;

  const percentage = Math.min(100, (used / total) * 100);
  const remaining = Math.max(0, total - used);
  const detailsText = t('tokenUsage.details', {
    defaultValue: '{{used}} / {{total}} tokens',
    used: used.toLocaleString(),
    total: total.toLocaleString(),
  });
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on usage level
  const getColor = () => {
    if (percentage < 50) return '#3b82f6'; // blue
    if (percentage < 75) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-2 rounded-lg px-1.5 text-xs text-gray-600 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:bg-accent/80 dark:text-gray-400"
          title={detailsText}
          aria-label={t('tokenUsage.ariaLabel', {
            defaultValue: 'View token usage details: {{details}}',
            details: detailsText,
          })}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90 transform" aria-hidden="true">
            {/* Background circle */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-300 dark:text-gray-600"
            />
            {/* Progress circle */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              fill="none"
              stroke={getColor()}
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span>{percentage.toFixed(1)}%</span>
        </button>
      </DialogTrigger>

      <DialogContent className="mx-4 max-w-sm p-4">
        <DialogTitle className="not-sr-only text-base font-semibold text-foreground">
          {t('tokenUsage.title', { defaultValue: 'Token usage' })}
        </DialogTitle>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between gap-4">
            <span>{t('tokenUsage.used', { defaultValue: 'Used' })}</span>
            <span className="font-medium text-foreground">{used.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>{t('tokenUsage.total', { defaultValue: 'Total' })}</span>
            <span className="font-medium text-foreground">{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>{t('tokenUsage.remaining', { defaultValue: 'Remaining' })}</span>
            <span className="font-medium text-foreground">{remaining.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-2">
            <span>{t('tokenUsage.contextUsed', { defaultValue: 'Context used' })}</span>
            <span className="font-semibold text-foreground">{percentage.toFixed(1)}%</span>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
          onClick={() => setIsOpen(false)}
        >
          {t('tokenUsage.close', { defaultValue: 'Close' })}
        </button>
      </DialogContent>
    </Dialog>
  );
}
