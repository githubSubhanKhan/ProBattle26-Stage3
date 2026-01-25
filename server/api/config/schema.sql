CREATE TYPE user_role AS ENUM ('SEEKER', 'PROVIDER', 'MODERATOR');
CREATE TYPE price_type AS ENUM ('HOURLY', 'FIXED');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  rating FLOAT DEFAULT 0,
  city VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2),
  price_type price_type,
  availability_start TIMESTAMP,
  availability_end TIMESTAMP,
  location_h3 VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  seeker_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES users(id),
  booking_start TIMESTAMP NOT NULL,
  booking_end TIMESTAMP NOT NULL,
  status booking_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_time ON bookings(service_id, booking_start, booking_end);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50),
  performed_by UUID REFERENCES users(id),
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_services_h3 ON services(location_h3);

SELECT
  u.id AS user_id,
  u.full_name AS user_name,
  u.role AS user_type,
  MAX(m.content) FILTER (
    WHERE m.created_at = (
      SELECT MAX(created_at)
      FROM messages
      WHERE 
        (sender_id = u.id AND receiver_id = $1)
        OR
        (sender_id = $1 AND receiver_id = u.id)
    )
  ) AS last_message,
  MAX(m.created_at) AS timestamp,
  COUNT(*) FILTER (
    WHERE m.is_read = false AND m.receiver_id = $1
  ) AS unread_count
FROM users u
LEFT JOIN messages m
  ON (
    (m.sender_id = u.id AND m.receiver_id = $1)
    OR
    (m.sender_id = $1 AND m.receiver_id = u.id)
  )
WHERE u.id != $1
  AND u.full_name ILIKE '%' || $2 || '%'
GROUP BY u.id, u.full_name, u.role
ORDER BY timestamp DESC NULLS LAST;