-- Migration: 008_vietnamese_mock_data.sql
-- Description: Vietnamese-style mock data for testing
-- Date: 2024-01-01
-- Temporarily disable RLS for data population
SET session_replication_role = replica;
-- Add unique constraint to account_number if it doesn't exist
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bank_accounts_account_number_key'
) THEN
ALTER TABLE public.bank_accounts
ADD CONSTRAINT bank_accounts_account_number_key UNIQUE (account_number);
END IF;
END $$;
-- Ensure the ABC Company tenant exists
INSERT INTO public.tenants (id, name, slug, domain, is_active, settings)
VALUES (
        '550e8400-e29b-41d4-a716-446655440001',
        'ABC Company Ltd',
        'abc-company',
        'abc.example.com',
        true,
        '{}'::jsonb
    ) ON CONFLICT (id) DO
UPDATE
SET name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    domain = EXCLUDED.domain,
    is_active = EXCLUDED.is_active;
-- Ensure the ABC branch exists
INSERT INTO public.branches (
        name,
        code,
        address,
        phone,
        email,
        tenant_id,
        is_active
    )
VALUES (
        'ABC Head Office',
        'ABC-HQ-MAIN',
        '123 Business District, Ho Chi Minh City, Vietnam',
        '+84-28-1234-5678',
        'hq@abc-company.vn',
        '550e8400-e29b-41d4-a716-446655440001',
        true
    ) ON CONFLICT (tenant_id, code) DO
UPDATE
SET name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;
-- Ensure the bank account exists
INSERT INTO public.bank_accounts (
        account_number,
        account_name,
        bank_name,
        branch_id,
        tenant_id,
        balance,
        is_active
    )
VALUES (
        'ABC1234567890',
        'ABC Main Account',
        'Vietcombank',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        500000000,
        true
    ) ON CONFLICT (account_number) DO
UPDATE
SET account_name = EXCLUDED.account_name,
    bank_name = EXCLUDED.bank_name,
    balance = EXCLUDED.balance;
-- Insert Vietnamese customer mock data
INSERT INTO public.customers (
        customer_code,
        full_name,
        phone,
        email,
        address,
        branch_id,
        tenant_id,
        total_balance,
        last_transaction_date,
        is_active,
        created_at
    )
VALUES (
        'CUST0001',
        'Công ty TNHH ABC Technology',
        '0123456789',
        'info@abc-tech.com.vn',
        '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -85000000,
        NOW() - INTERVAL '5 days',
        true,
        NOW() - INTERVAL '90 days'
    ),
    (
        'CUST0002',
        'Công ty CP XYZ Trading',
        '0987654321',
        'contact@xyz-trading.vn',
        '456 Đường Lê Lợi, Quận 3, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -72000000,
        NOW() - INTERVAL '3 days',
        true,
        NOW() - INTERVAL '85 days'
    ),
    (
        'CUST0003',
        'Công ty TNHH DEF Manufacturing',
        '0369852147',
        'hello@def-mfg.com.vn',
        '789 Đường Võ Văn Tần, Quận 7, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -65000000,
        NOW() - INTERVAL '2 days',
        true,
        NOW() - INTERVAL '80 days'
    ),
    (
        'CUST0004',
        'Công ty TNHH GHI Logistics',
        '0258741963',
        'info@ghi-logistics.vn',
        '321 Đường Hai Bà Trưng, Quận 1, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -45000000,
        NOW() - INTERVAL '7 days',
        true,
        NOW() - INTERVAL '75 days'
    ),
    (
        'CUST0005',
        'Công ty CP JKL Construction',
        '0147258369',
        'contact@jkl-construction.com.vn',
        '654 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -38000000,
        NOW() - INTERVAL '1 day',
        true,
        NOW() - INTERVAL '70 days'
    ),
    (
        'CUST0006',
        'Công ty TNHH MNO Services',
        '0951753468',
        'service@mno-services.vn',
        '987 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -28000000,
        NOW() - INTERVAL '4 days',
        true,
        NOW() - INTERVAL '65 days'
    ),
    (
        'CUST0007',
        'Công ty CP PQR Electronics',
        '0753951842',
        'sales@pqr-electronics.com.vn',
        '147 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -52000000,
        NOW() - INTERVAL '6 days',
        true,
        NOW() - INTERVAL '60 days'
    ),
    (
        'CUST0008',
        'Công ty TNHH STU Food & Beverage',
        '0159357246',
        'info@stu-fnb.vn',
        '258 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -19000000,
        NOW() - INTERVAL '8 days',
        true,
        NOW() - INTERVAL '55 days'
    ),
    (
        'CUST0009',
        'Công ty CP VWX Pharmaceutical',
        '0246813579',
        'contact@vwx-pharma.com.vn',
        '369 Đường Lý Tự Trọng, Quận 1, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -41000000,
        NOW() - INTERVAL '9 days',
        true,
        NOW() - INTERVAL '50 days'
    ),
    (
        'CUST0010',
        'Công ty TNHH YZ Retail',
        '0135792468',
        'business@yz-retail.vn',
        '741 Đường Pasteur, Quận 3, TP.HCM',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ-MAIN'
        ),
        '550e8400-e29b-41d4-a716-446655440001',
        -33000000,
        NOW() - INTERVAL '10 days',
        true,
        NOW() - INTERVAL '45 days'
    ) ON CONFLICT (tenant_id, customer_code) DO
UPDATE
SET full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    total_balance = EXCLUDED.total_balance;
-- Generate sample transactions for each customer
DO $$
DECLARE customer_record RECORD;
bank_account_id UUID;
branch_id UUID;
target_tenant_id UUID := '550e8400-e29b-41d4-a716-446655440001';
transaction_counter INTEGER := 1;
num_transactions INTEGER;
i INTEGER;
is_payment BOOLEAN;
base_amount DECIMAL;
amount DECIMAL;
transaction_date TIMESTAMP;
BEGIN -- Get bank account and branch IDs
SELECT id INTO bank_account_id
FROM public.bank_accounts
WHERE account_number = 'ABC1234567890';
SELECT id INTO branch_id
FROM public.branches
WHERE code = 'ABC-HQ-MAIN';
-- Loop through each customer
FOR customer_record IN
SELECT id,
    full_name,
    total_balance
FROM public.customers
WHERE tenant_id = target_tenant_id LOOP -- Generate 5-15 transactions per customer
    num_transactions := 5 + FLOOR(RANDOM() * 10);
FOR i IN 1..num_transactions LOOP -- 70% charges, 30% payments
is_payment := RANDOM() > 0.7;
-- Calculate amount based on customer balance
base_amount := ABS(customer_record.total_balance) / num_transactions;
amount := base_amount * (0.8 + RANDOM() * 0.4);
-- Random transaction date within last 60 days
transaction_date := NOW() - (RANDOM() * INTERVAL '60 days');
-- Insert transaction
INSERT INTO public.transactions (
        transaction_code,
        customer_id,
        bank_account_id,
        branch_id,
        tenant_id,
        transaction_type,
        amount,
        description,
        reference_number,
        transaction_date,
        created_at
    )
VALUES (
        'TXN' || LPAD(transaction_counter::TEXT, 6, '0'),
        customer_record.id,
        bank_account_id,
        branch_id,
        target_tenant_id,
        CASE
            WHEN is_payment THEN 'payment'::transaction_type
            ELSE 'charge'::transaction_type
        END,
        ROUND(amount),
        CASE
            WHEN is_payment THEN 'Thanh toán công nợ từ ' || customer_record.full_name
            ELSE 'Bán hàng cho ' || customer_record.full_name
        END,
        'REF' || LPAD(transaction_counter::TEXT, 6, '0'),
        transaction_date,
        transaction_date
    ) ON CONFLICT (tenant_id, transaction_code) DO NOTHING;
transaction_counter := transaction_counter + 1;
END LOOP;
END LOOP;
RAISE NOTICE 'Generated approximately % transactions',
transaction_counter - 1;
END $$;
-- Re-enable RLS
SET session_replication_role = DEFAULT;
-- Success message
SELECT 'Vietnamese mock data populated successfully!' as result;