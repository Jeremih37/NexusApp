import { db } from '@/lib/db'

export const userService = {
  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } })
  },

  async findDefault() {
    return db.user.findFirst({ where: { role: 'user' } })
  },

  async upsert(data: { name: string; email: string; avatar?: string }) {
    return db.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        avatar: data.avatar,
      },
      create: {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: 'user',
      },
    })
  },
}
