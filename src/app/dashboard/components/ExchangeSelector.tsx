'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Exchange } from '@/types/market';
import { TrendingUp } from 'lucide-react';

interface ExchangeSelectorProps {
  value: Exchange;
  onChange: (exchange: Exchange) => void;
  className?: string;
}

export function ExchangeSelector({ value, onChange, className }: ExchangeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TrendingUp className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(val) => onChange(val as Exchange)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Exchange" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NSE">NSE - National Stock Exchange</SelectItem>
          <SelectItem value="BSE">BSE - Bombay Stock Exchange</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

