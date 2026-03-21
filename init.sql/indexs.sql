CREATE INDEX idx_chats_user_id ON chats (user_id);

CREATE UNIQUE INDEX idx_payments_user_id ON payments (user_id);

CREATE UNIQUE INDEX idx_role_applications_user_id ON role_applications (user_id);


