import pool from '../../src/db.js'

async function createTables() {
  try {
    console.log('🔄 Creating database tables...')

    // Create rooms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        owner_id UUID,
        is_locked BOOLEAN DEFAULT false,
        current_url VARCHAR(2048),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        is_owner BOOLEAN DEFAULT false,
        has_control BOOLEAN DEFAULT false,
        cursor_x INT DEFAULT 0,
        cursor_y INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      )
    `)

    // Create chat_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY,
        room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code)
    `)

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_room_id ON users(room_id)
    `)

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_room_id ON chat_messages(room_id)
    `)

    console.log('✅ Database tables created successfully')
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    throw error
  }
}

async function runMigration() {
  try {
    await createTables()
    console.log('✅ Migration completed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
