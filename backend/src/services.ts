import pool from './db.js'
import { User, Room, RoomUser } from './types.js'
import { generateId } from './utils.js'

export class UserService {
  static async createUser(name: string, roomId: string, isOwner: boolean): Promise<User> {
    const id = generateId()
    const result = await pool.query(
      `INSERT INTO users (id, name, room_id, is_owner, has_control, cursor_x, cursor_y)
       VALUES ($1, $2, $3, $4, $5, 0, 0)
       RETURNING id, name, room_id as "roomId", is_owner as "isOwner", has_control as "hasControl", cursor_x as "cursorX", cursor_y as "cursorY", created_at as "createdAt"`,
      [id, name, roomId, isOwner, isOwner]
    )
    return result.rows[0]
  }

  static async getUserById(userId: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, name, room_id as "roomId", is_owner as "isOwner", has_control as "hasControl", cursor_x as "cursorX", cursor_y as "cursorY", created_at as "createdAt"
       FROM users WHERE id = $1`,
      [userId]
    )
    return result.rows[0] || null
  }

  static async getUsersByRoom(roomId: string): Promise<User[]> {
    const result = await pool.query(
      `SELECT id, name, room_id as "roomId", is_owner as "isOwner", has_control as "hasControl", cursor_x as "cursorX", cursor_y as "cursorY", created_at as "createdAt"
       FROM users WHERE room_id = $1
       ORDER BY created_at ASC`,
      [roomId]
    )
    return result.rows
  }

  static async updateCursor(userId: string, x: number, y: number): Promise<void> {
    await pool.query(
      `UPDATE users SET cursor_x = $1, cursor_y = $2 WHERE id = $3`,
      [x, y, userId]
    )
  }

  static async grantControl(userId: string): Promise<void> {
    await pool.query(
      `UPDATE users SET has_control = true WHERE id = $1`,
      [userId]
    )
  }

  static async revokeControl(userId: string): Promise<void> {
    await pool.query(
      `UPDATE users SET has_control = false WHERE id = $1`,
      [userId]
    )
  }

  static async deleteUser(userId: string): Promise<void> {
    await pool.query(`DELETE FROM users WHERE id = $1`, [userId])
  }
}

export class RoomService {
  static async createRoom(ownerId: string, code: string): Promise<Room> {
    const id = generateId()
    const result = await pool.query(
      `INSERT INTO rooms (id, code, owner_id, is_locked)
       VALUES ($1, $2, $3, false)
       RETURNING id, code, owner_id as "ownerId", is_locked as "isLocked", current_url as "currentUrl", created_at as "createdAt", updated_at as "updatedAt"`,
      [id, code, ownerId]
    )
    return result.rows[0]
  }

  static async getRoomByCode(code: string): Promise<Room | null> {
    const result = await pool.query(
      `SELECT id, code, owner_id as "ownerId", is_locked as "isLocked", current_url as "currentUrl", created_at as "createdAt", updated_at as "updatedAt"
       FROM rooms WHERE code = $1`,
      [code]
    )
    return result.rows[0] || null
  }

  static async getRoomById(roomId: string): Promise<Room | null> {
    const result = await pool.query(
      `SELECT id, code, owner_id as "ownerId", is_locked as "isLocked", current_url as "currentUrl", created_at as "createdAt", updated_at as "updatedAt"
       FROM rooms WHERE id = $1`,
      [roomId]
    )
    return result.rows[0] || null
  }

  static async updateRoomUrl(roomId: string, url: string): Promise<void> {
    await pool.query(
      `UPDATE rooms SET current_url = $1, updated_at = NOW() WHERE id = $2`,
      [url, roomId]
    )
  }

  static async lockRoom(roomId: string, locked: boolean): Promise<void> {
    await pool.query(
      `UPDATE rooms SET is_locked = $1, updated_at = NOW() WHERE id = $2`,
      [locked, roomId]
    )
  }

  static async deleteRoom(roomId: string): Promise<void> {
    await pool.query(`DELETE FROM rooms WHERE id = $1`, [roomId])
  }

  static async getRoomParticipantCount(roomId: string): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE room_id = $1`,
      [roomId]
    )
    return parseInt(result.rows[0].count)
  }
}

export class ChatService {
  static async addMessage(
    roomId: string,
    userId: string,
    message: string
  ): Promise<string> {
    const id = generateId()
    await pool.query(
      `INSERT INTO chat_messages (id, room_id, user_id, message)
       VALUES ($1, $2, $3, $4)`,
      [id, roomId, userId, message]
    )
    return id
  }

  static async getRoomMessages(roomId: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT m.id, m.room_id as "roomId", m.user_id as "userId", u.name as "userName", m.message, m.created_at as "createdAt"
       FROM chat_messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.room_id = $1
       ORDER BY m.created_at ASC
       LIMIT 50`,
      [roomId]
    )
    return result.rows
  }

  static async deleteRoomMessages(roomId: string): Promise<void> {
    await pool.query(`DELETE FROM chat_messages WHERE room_id = $1`, [roomId])
  }
}
