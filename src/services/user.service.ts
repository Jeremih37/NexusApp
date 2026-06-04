import { db } from '@/lib/db'

export const userService = {
  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } })
  },

  async findDefault() {
    return db.user.findFirst({ where: { role: 'user' } })
  },
}
