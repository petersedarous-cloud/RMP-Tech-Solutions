ALTER TABLE public.orders
  ADD COLUMN payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN payment_provider text,
  ADD COLUMN payment_reference text,
  ADD COLUMN paid_at timestamptz;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('unpaid','pending','paid','failed','refunded')),
  ADD CONSTRAINT orders_payment_method_check CHECK (payment_method IN ('whatsapp','request','card'));

CREATE INDEX IF NOT EXISTS orders_payment_reference_idx ON public.orders (payment_reference);