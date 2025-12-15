// بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
// GitHubDB SDK - Standardized and Enhanced Version

interface CloudinaryConfig {
  uploadPreset?: string
  cloudName?: string
  apiKey?: string
  apiSecret?: string
}

interface SMTPConfig {
  host?: string
  port?: number
  user?: string
  pass?: string
  from?: string
}

interface AuthConfig {
  requireEmailVerification?: boolean
  otpTriggers?: string[]
  sessionDuration?: number
}

interface SchemaDefinition {
  required?: string[]
  types?: Record<string, string>
  defaults?: Record<string, any>
}

interface UniversalSDKConfig {
  owner: string
  repo: string
  token: string
  branch?: string
  basePath?: string
  mediaPath?: string
  cloudinary?: CloudinaryConfig
  smtp?: SMTPConfig
  templates?: Record<string, string>
  schemas?: Record<string, SchemaDefinition>
  auth?: AuthConfig
}

interface User {
  id?: string
  uid?: string
  email: string
  password?: string
  googleId?: string
  verified?: boolean
  roles?: string[]
  permissions?: string[]
  name?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

interface Session {
  token: string
  user: User
  created: number
  expires: number
}

interface OTPRecord {
  otp: string
  created: number
  reason: string
}

interface AuditLogEntry {
  action: string
  data: any
  timestamp: number
  userId?: string
}

interface QueryBuilder<T = any> {
  where(fn: (item: T) => boolean): QueryBuilder<T>
  sort(field: string, dir?: "asc" | "desc"): QueryBuilder<T>
  limit(count: number): QueryBuilder<T>
  offset(count: number): QueryBuilder<T>
  project(fields: string[]): QueryBuilder<Partial<T>>
  exec(): Promise<T[]>
  count(): Promise<number>
  first(): Promise<T | null>
}

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  [key: string]: any
}

interface QueuedWrite {
  collection: string
  data: any[]
  resolve: (value: any) => void
  reject: (reason?: any) => void
  retries: number
  timestamp: number
}

class UniversalSDK {
  private owner: string
  private repo: string
  private token: string
  private branch: string
  private basePath: string
  private mediaPath: string
  private cloudinary: CloudinaryConfig
  private smtp: SMTPConfig
  private templates: Record<string, string>
  private schemas: Record<string, SchemaDefinition>
  private authConfig: AuthConfig
  private sessionStore: Map<string, Session> = new Map()
  private otpMemory: Map<string, OTPRecord> = new Map()
  private auditLog: Map<string, AuditLogEntry[]> = new Map()
  private cache: Map<string, { data: any[]; etag?: string; sha?: string; timestamp: number }> = new Map()
  private subscribers: Map<string, Set<Function>> = new Map()
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map()
  private writeQueue: QueuedWrite[] = []
  private isProcessingQueue = false
  private initialized = false
  private initPromise: Promise<void> | null = null

  constructor(config: UniversalSDKConfig) {
    this.owner = config.owner
    this.repo = config.repo
    this.token = config.token
    this.branch = config.branch || "main"
    this.basePath = config.basePath || "db"
    this.mediaPath = config.mediaPath || "media"
    this.cloudinary = config.cloudinary || {}
    this.smtp = config.smtp || {}
    this.templates = config.templates || {}
    this.authConfig = {
      requireEmailVerification: config.auth?.requireEmailVerification ?? false,
      otpTriggers: config.auth?.otpTriggers || [],
      sessionDuration: config.auth?.sessionDuration || 7 * 24 * 60 * 60 * 1000, // 7 days
    }
    this.schemas = {
      users: {
        required: ["email"],
        types: {
          email: "string",
          password: "string",
          name: "string",
          verified: "boolean",
          roles: "array",
          permissions: "array",
        },
      },
      ...config.schemas,
    }
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
  }

  private async request(path: string, method = "GET", body: any = null, etag?: string): Promise<any> {
    const url =
      `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}` +
      (method === "GET" ? `?ref=${this.branch}` : "")

    const headers: Record<string, string> = this.headers()
    if (etag) {
      headers["If-None-Match"] = etag
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        cache: "no-store",
      })

      if (res.status === 304) {
        return { notModified: true }
      }

      if (res.status === 404) {
        return { notFound: true }
      }

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`GitHub API Error (${res.status}): ${errorText}`)
      }

      if (res.status === 204) {
        return { success: true }
      }

      const json = await res.json()
      return { ...json, etag: res.headers.get("ETag") }
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        return { notFound: true }
      }
      throw error
    }
  }

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return

    if (this.initPromise) {
      await this.initPromise
      return
    }

    this.initPromise = this._initialize()
    await this.initPromise
  }

  private async _initialize(): Promise<void> {
    try {
      // Check if db folder exists
      const dbCheck = await this.request(this.basePath)

      if (dbCheck.notFound) {
        // Create initial db structure with a placeholder
        await this.request(`${this.basePath}/.gitkeep`, "PUT", {
          message: "Initialize database structure",
          content: btoa("# GitHubDB Storage\n"),
          branch: this.branch,
        })
      }

      this.initialized = true
    } catch (error) {
      console.error("SDK initialization error:", error)
      // Still mark as initialized to prevent infinite loops
      this.initialized = true
    }
  }

  async get<T = any>(collection: string, force = false): Promise<T[]> {
    await this.ensureInitialized()

    const cacheEntry = this.cache.get(collection)
    const cacheAge = cacheEntry ? Date.now() - cacheEntry.timestamp : Number.POSITIVE_INFINITY

    // Return cached data if fresh (less than 5 seconds old) and not forcing
    if (cacheEntry && !force && cacheAge < 5000) {
      return cacheEntry.data
    }

    try {
      const res = await this.request(`${this.basePath}/${collection}.json`, "GET", null, cacheEntry?.etag)

      if (res.notModified && cacheEntry) {
        // Update timestamp
        cacheEntry.timestamp = Date.now()
        return cacheEntry.data
      }

      if (res.notFound) {
        this.cache.set(collection, { data: [], etag: undefined, sha: undefined, timestamp: Date.now() })
        return []
      }

      const data = JSON.parse(atob(res.content))
      this.cache.set(collection, {
        data,
        etag: res.etag,
        sha: res.sha,
        timestamp: Date.now(),
      })
      this.notifySubscribers(collection, data)
      return data
    } catch (e) {
      if ((e as Error).message.includes("Not Found") || (e as Error).message.includes("404")) {
        this.cache.set(collection, { data: [], etag: undefined, sha: undefined, timestamp: Date.now() })
        return []
      }
      throw e
    }
  }

  private notifySubscribers(collection: string, data: any[]) {
    const subs = this.subscribers.get(collection)
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(data)
        } catch (e) {
          console.error("Subscriber callback error:", e)
        }
      })
    }
  }

  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    if (!this.subscribers.has(collection)) {
      this.subscribers.set(collection, new Set())
    }
    this.subscribers.get(collection)!.add(callback)

    // Start polling if not already
    if (!this.pollingIntervals.has(collection)) {
      const intervalId = setInterval(() => this.pollCollection(collection), 5000)
      this.pollingIntervals.set(collection, intervalId)
    }

    // Immediately provide current data
    const cached = this.cache.get(collection)
    if (cached) {
      callback(cached.data)
    } else {
      this.get(collection).then((data) => callback(data as T[]))
    }

    return () => this.unsubscribe(collection, callback)
  }

  unsubscribe(collection: string, callback: Function) {
    const subs = this.subscribers.get(collection)
    if (subs) {
      subs.delete(callback)
      if (subs.size === 0) {
        const interval = this.pollingIntervals.get(collection)
        if (interval) {
          clearInterval(interval)
          this.pollingIntervals.delete(collection)
        }
      }
    }
  }

  private async pollCollection(collection: string) {
    try {
      await this.get(collection, true)
    } catch (error) {
      console.error(`Polling failed for ${collection}:`, error)
    }
  }

  async getItem<T = any>(collection: string, key: string): Promise<T | null> {
    const arr = await this.get<T>(collection)
    return arr.find((x: any) => x.id === key || x.uid === key) || null
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.writeQueue.length === 0) {
      return
    }

    this.isProcessingQueue = true
    const write = this.writeQueue[0]

    try {
      const { collection, data, resolve } = write

      // Always fetch latest sha before writing to avoid conflicts
      const file = await this.request(`${this.basePath}/${collection}.json`).catch(() => ({ sha: undefined }))

      const result = await this.request(`${this.basePath}/${collection}.json`, "PUT", {
        message: `Update ${collection} - ${new Date().toISOString()}`,
        content: btoa(JSON.stringify(data, null, 2)),
        branch: this.branch,
        sha: file.sha,
      })

      if (result.success || result.content) {
        this.writeQueue.shift()
        // Update cache with new sha
        this.cache.set(collection, {
          data,
          etag: result.etag,
          sha: result.content?.sha,
          timestamp: Date.now(),
        })
        this.notifySubscribers(collection, data)
        resolve(data)
      } else {
        throw new Error("Write failed")
      }
    } catch (error: any) {
      if ((error.message.includes("409") || error.message.includes("conflict")) && write.retries < 5) {
        write.retries++
        // Exponential backoff
        await new Promise((res) => setTimeout(res, Math.pow(2, write.retries) * 100))
      } else {
        write.reject(error)
        this.writeQueue.shift()
      }
    } finally {
      this.isProcessingQueue = false
      if (this.writeQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100)
      }
    }
  }

  private save<T = any>(collection: string, data: T[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      // Optimistic update
      const cached = this.cache.get(collection)
      this.cache.set(collection, {
        ...cached,
        data,
        timestamp: Date.now(),
      } as any)
      this.notifySubscribers(collection, data)

      this.writeQueue.push({
        collection,
        data,
        resolve,
        reject,
        retries: 0,
        timestamp: Date.now(),
      })

      if (!this.isProcessingQueue) {
        this.processQueue()
      }
    })
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    const arr = await this.get<T>(collection)
    const schema = this.schemas[collection]

    if (schema?.defaults) {
      item = { ...schema.defaults, ...item }
    }

    this.validateSchema(collection, item)

    const maxId = Math.max(0, ...arr.map((x: any) => Number.parseInt(x.id) || 0))
    const id = (maxId + 1).toString()
    const uid = crypto.randomUUID()
    const now = new Date().toISOString()

    const newItem = {
      uid,
      id,
      createdAt: now,
      updatedAt: now,
      ...item,
    } as T & { id: string; uid: string }

    arr.push(newItem)
    await this.save(collection, arr)
    this._audit(collection, newItem, "insert")

    return newItem
  }

  async bulkInsert<T = any>(collection: string, items: Partial<T>[]): Promise<(T & { id: string; uid: string })[]> {
    const arr = await this.get<T>(collection)
    const schema = this.schemas[collection]
    const base = Math.max(0, ...arr.map((x: any) => Number.parseInt(x.id) || 0))
    const now = new Date().toISOString()

    const newItems = items.map((item, i) => {
      if (schema?.defaults) {
        item = { ...schema.defaults, ...item }
      }
      this.validateSchema(collection, item)
      return {
        uid: crypto.randomUUID(),
        id: (base + i + 1).toString(),
        createdAt: now,
        updatedAt: now,
        ...item,
      } as T & { id: string; uid: string }
    })

    await this.save(collection, [...arr, ...newItems])
    newItems.forEach((n) => this._audit(collection, n, "insert"))

    return newItems
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.get(collection, true)
    const arr = [...(this.cache.get(collection)?.data || [])]
    const itemIndex = arr.findIndex((x: any) => x.id === key || x.uid === key)

    if (itemIndex === -1) {
      throw new Error(`Item with key "${key}" not found in collection "${collection}".`)
    }

    const updatedItem = {
      ...arr[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.validateSchema(collection, updatedItem)
    arr[itemIndex] = updatedItem

    await this.save(collection, arr)
    this._audit(collection, updatedItem, "update")

    return updatedItem
  }

  async upsert<T = any>(collection: string, key: string, data: Partial<T>): Promise<T & { id: string; uid: string }> {
    const existing = await this.getItem<T>(collection, key)
    if (existing) {
      return this.update(collection, key, data) as Promise<T & { id: string; uid: string }>
    }
    return this.insert(collection, { ...data, id: key } as Partial<T>)
  }

  async delete<T = any>(collection: string, key: string): Promise<void> {
    const arr = await this.get<T>(collection)
    const deleted = arr.filter((x: any) => x.id === key || x.uid === key)
    const filtered = arr.filter((x: any) => x.id !== key && x.uid !== key)

    await this.save(collection, filtered)
    deleted.forEach((d) => this._audit(collection, d, "delete"))
  }

  async bulkDelete<T = any>(collection: string, keys: string[]): Promise<T[]> {
    const arr = await this.get<T>(collection)
    const filtered = arr.filter((x: any) => !keys.includes(x.id) && !keys.includes(x.uid))
    const deleted = arr.filter((x: any) => keys.includes(x.id) || keys.includes(x.uid))

    await this.save(collection, filtered)
    deleted.forEach((d) => this._audit(collection, d, "delete"))

    return deleted
  }

  private validateSchema(collection: string, item: any): void {
    const schema = this.schemas[collection]
    if (!schema) return
      ; (schema.required || []).forEach((r) => {
        if (!(r in item) || item[r] === undefined || item[r] === null) {
          throw new Error(`Missing required field: ${r}`)
        }
      })

    Object.entries(item).forEach(([k, v]) => {
      if (v === undefined || v === null) return

      const t = schema.types?.[k]
      if (t) {
        const valid =
          (t === "string" && typeof v === "string") ||
          (t === "number" && typeof v === "number") ||
          (t === "boolean" && typeof v === "boolean") ||
          (t === "object" && typeof v === "object" && !Array.isArray(v)) ||
          (t === "array" && Array.isArray(v)) ||
          (t === "date" && (v instanceof Date || !isNaN(Date.parse(v as string)))) ||
          (t === "uuid" && typeof v === "string")

        if (!valid) {
          throw new Error(`Field ${k} should be ${t}, got ${typeof v}`)
        }
      }
    })
  }

  queryBuilder<T = any>(collection: string): QueryBuilder<T> {
    let chain = Promise.resolve().then(() => this.get<T>(collection))
    let limitVal: number | null = null
    let offsetVal = 0

    const qb: QueryBuilder<T> = {
      where(fn: (item: T) => boolean) {
        chain = chain.then((arr) => arr.filter(fn))
        return qb
      },
      sort(field: string, dir: "asc" | "desc" = "asc") {
        chain = chain.then((arr) =>
          [...arr].sort((a: any, b: any) => {
            const aVal = a[field]
            const bVal = b[field]
            if (aVal === bVal) return 0
            const result = aVal > bVal ? 1 : -1
            return dir === "asc" ? result : -result
          }),
        )
        return qb
      },
      limit(count: number) {
        limitVal = count
        return qb
      },
      offset(count: number) {
        offsetVal = count
        return qb
      },
      project(fields: string[]) {
        chain = chain.then((arr) =>
          arr.map((item: any) => {
            const o: any = {}
            fields.forEach((f) => {
              if (f in item) o[f] = item[f]
            })
            return o
          }),
        )
        return qb as QueryBuilder<any>
      },
      async exec() {
        let result = await chain
        if (offsetVal > 0) {
          result = result.slice(offsetVal)
        }
        if (limitVal !== null) {
          result = result.slice(0, limitVal)
        }
        return result
      },
      async count() {
        const result = await chain
        return result.length
      },
      async first() {
        const result = await this.exec()
        return result[0] || null
      },
    }

    return qb
  }

  // Authentication Methods
  hashPassword(password: string): string {
    const salt = crypto.randomUUID()
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const hash = btoa(String.fromCharCode(...new Uint8Array(data)))
    return `${salt}$${hash}`
  }

  verifyPassword(password: string, hashString: string): boolean {
    const [salt, hash] = hashString.split("$")
    if (!salt || !hash) return false
    const encoder = new TextEncoder()
    const data = encoder.encode(password + salt)
    const testHash = btoa(String.fromCharCode(...new Uint8Array(data)))
    return testHash === hash
  }

  async register(email: string, password: string, profile: Partial<User> = {}): Promise<User> {
    if (!this.validateEmailFormat(email)) {
      throw new Error("Invalid email format")
    }

    const users = await this.get<User>("users")
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email already registered")
    }

    const hashed = this.hashPassword(password)
    const user = await this.insert<User>("users", {
      email: email.toLowerCase(),
      password: hashed,
      verified: !this.authConfig.requireEmailVerification,
      roles: ["user"],
      permissions: [],
      ...profile,
    })

    if (this.authConfig.otpTriggers?.includes("register")) {
      await this.sendOTP(email, "registration")
    }

    return user
  }

  async login(email: string, password: string): Promise<{ token: string; user: User } | { otpRequired: boolean }> {
    const users = await this.get<User>("users")
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user || !user.password || !this.verifyPassword(password, user.password)) {
      throw new Error("Invalid credentials")
    }

    if (this.authConfig.requireEmailVerification && !user.verified) {
      throw new Error("Please verify your email first")
    }

    if (this.authConfig.otpTriggers?.includes("login")) {
      await this.sendOTP(email, "login")
      return { otpRequired: true }
    }

    const token = await this.createSession(user)
    return { token, user: this.sanitizeUser(user) }
  }

  async createSession(user: User): Promise<string> {
    const token = crypto.randomUUID()
    const now = Date.now()
    const session = {
      token,
      userId: user.id || user.uid,
      created: now,
      expires: now + (this.authConfig.sessionDuration || 7 * 24 * 60 * 60 * 1000),
    }

    // Store in DB instead of memory
    await this.insert("sessions", session)
    return token
  }

  async getSession(token: string): Promise<Session | null> {
    // Try memory first (cache)
    // But mostly fetch from DB
    const sessions = await this.get<any>("sessions")
    const sessionData = sessions.find(s => s.token === token)

    if (!sessionData) return null

    if (Date.now() > sessionData.expires) {
      await this.delete("sessions", sessionData.id)
      return null
    }

    // Reconstruct full session object by fetching user
    const users = await this.get<User>("users")
    const user = users.find(u => u.id === sessionData.userId || u.uid === sessionData.userId)

    if (!user) return null

    return {
      token: sessionData.token,
      user: this.sanitizeUser(user),
      created: sessionData.created,
      expires: sessionData.expires
    }
  }

  refreshSession(token: string): Session | null {
    const session = this.getSession(token)
    if (!session) return null

    session.created = Date.now()
    session.expires = Date.now() + (this.authConfig.sessionDuration || 7 * 24 * 60 * 60 * 1000)
    return session
  }

  async destroySession(token: string): Promise<boolean> {
    const sessions = await this.get<any>("sessions")
    const session = sessions.find(s => s.token === token)
    if (session) {
      await this.delete("sessions", session.id)
      return true
    }
    return false
  }

  async getCurrentUser(token: string): Promise<User | null> {
    const session = await this.getSession(token)
    return session?.user || null
  }

  private sanitizeUser(user: User): User {
    const { password, ...safeUser } = user
    return safeUser as User
  }

  validateEmailFormat(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async sendOTP(email: string, reason = "verify"): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    this.otpMemory.set(email.toLowerCase(), { otp, created: Date.now(), reason })

    // Send via email API
    await this.sendEmail(
      email,
      `Your OTP Code`,
      `
      <div style="font-family: 'Amiri', serif; direction: rtl; text-align: center; padding: 20px;">
        <h2>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>Reason: ${reason}</p>
      </div>
    `,
    )

    return otp
  }

  verifyOTP(email: string, otp: string): boolean {
    const rec = this.otpMemory.get(email.toLowerCase())
    if (!rec || rec.otp !== otp) {
      throw new Error("Invalid OTP")
    }
    if (Date.now() - rec.created > 10 * 60 * 1000) {
      this.otpMemory.delete(email.toLowerCase())
      throw new Error("OTP expired")
    }
    this.otpMemory.delete(email.toLowerCase())
    return true
  }

  async verifyEmail(email: string, otp: string): Promise<User> {
    this.verifyOTP(email, otp)

    const users = await this.get<User>("users")
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users[userIndex].verified = true
    await this.save("users", users)

    return this.sanitizeUser(users[userIndex])
  }

  async requestPasswordReset(email: string): Promise<void> {
    const users = await this.get<User>("users")
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      // Don't reveal if email exists
      return
    }

    await this.sendOTP(email, "password-reset")
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<boolean> {
    this.verifyOTP(email, otp)

    const users = await this.get<User>("users")
    const i = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())

    if (i === -1) {
      throw new Error("User not found")
    }

    users[i].password = this.hashPassword(newPassword)
    users[i].updatedAt = new Date().toISOString()
    await this.save("users", users)

    return true
  }

  hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false
    if (user.roles?.includes("admin")) return true
    return (user.permissions || []).includes(permission)
  }

  hasRole(user: User | null, role: string): boolean {
    if (!user) return false
    return (user.roles || []).includes(role)
  }

  async assignRole(userId: string, role: string): Promise<User> {
    const users = await this.get<User>("users")
    const user = users.find((u) => u.id === userId || u.uid === userId)

    if (!user) throw new Error("User not found")

    user.roles = [...new Set([...(user.roles || []), role])]
    user.updatedAt = new Date().toISOString()
    await this.save("users", users)

    return this.sanitizeUser(user)
  }

  async removeRole(userId: string, role: string): Promise<User> {
    const users = await this.get<User>("users")
    const user = users.find((u) => u.id === userId || u.uid === userId)

    if (!user) throw new Error("User not found")

    user.roles = (user.roles || []).filter((r) => r !== role)
    user.updatedAt = new Date().toISOString()
    await this.save("users", users)

    return this.sanitizeUser(user)
  }

  // Email using Nodemailer (via API route)
  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      })

      if (!response.ok) {
        throw new Error("Email send failed")
      }

      return true
    } catch (error) {
      console.error("Email send error:", error)
      return false
    }
  }

  // Export/Import
  async exportCollection(collection: string): Promise<string> {
    const data = await this.get(collection)
    return JSON.stringify(data, null, 2)
  }

  async importCollection<T = any>(collection: string, json: string, overwrite = false): Promise<T[]> {
    const arr = JSON.parse(json)
    const base = overwrite ? [] : await this.get(collection)
    const now = new Date().toISOString()

    const processed = arr.map((it: any, i: number) => ({
      uid: it.uid || crypto.randomUUID(),
      id: it.id || (base.length + i + 1).toString(),
      createdAt: it.createdAt || now,
      updatedAt: now,
      ...it,
    }))

    const final = overwrite ? processed : [...base, ...processed]
    await this.save(collection, final)

    return processed
  }

  async listCollections(): Promise<string[]> {
    try {
      const res = await this.request(this.basePath)
      if (res.notFound || !Array.isArray(res)) return []
      return res.filter((f: any) => f.name.endsWith(".json")).map((f: any) => f.name.replace(".json", ""))
    } catch {
      return []
    }
  }

  // Audit logging
  private _audit(collection: string, data: any, action: string, userId?: string): void {
    const logs = this.auditLog.get(collection) || []
    logs.push({ action, data, timestamp: Date.now(), userId })
    this.auditLog.set(collection, logs.slice(-100))
  }

  getAuditLog(collection?: string): AuditLogEntry[] | Map<string, AuditLogEntry[]> {
    if (collection) {
      return this.auditLog.get(collection) || []
    }
    return this.auditLog
  }

  // Utility methods
  status(): Record<string, any> {
    return {
      owner: this.owner,
      repo: this.repo,
      connected: !!this.token,
      initialized: this.initialized,
      collections: [...this.cache.keys()],
      queueLength: this.writeQueue.length,
      time: new Date().toISOString(),
    }
  }

  version(): string {
    return "0.0.12"
  }

  isReady(): boolean {
    return !!(this.owner && this.repo && this.token && this.initialized)
  }
}

export default UniversalSDK
export type {
  UniversalSDKConfig,
  CloudinaryConfig,
  SMTPConfig,
  AuthConfig,
  SchemaDefinition,
  User,
  Session,
  QueryBuilder,
  CloudinaryUploadResult,
  OTPRecord,
  AuditLogEntry,
}
