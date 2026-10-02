<<<<<<< HEAD
# LocalLoop — Project Audit
=======
# Vicinus — Project Audit
>>>>>>> ee27a55 (feat: complete Vicinus backend integration and unified frontend SPA)
> Technical co-founder analysis after full Stitch frontend inspection  
> Date: 2026-10-02 | Hackathon budget: **6 hours**

---

## ✅ Step 1: Workspace Setup — COMPLETE

| Item | Status |
|------|--------|
| `/client` folder (8 Stitch screens) | ✅ Done |
| `/server` empty directory | ✅ Done |
| `/server/.env` with placeholders | ✅ Done |
| Original ZIP deleted | ✅ Done |

---

## 📋 Step 2: Project Audit

### 2A. What Exists vs What Is Incomplete

#### Screens Present (all pure HTML/Tailwind, fully static mock data)

| Screen Folder | Route / Purpose | Status |
|---|---|---|
<<<<<<< HEAD
| `home_localloop_2` | **Home Feed** — hero search, category filter strip, recommended carousel, main post feed (sort/filter), sidebar trending | ✅ UI complete, 100% mock data |
| `share_information_localloop_clean_spacious` | **Create Post** — AI-parse textarea (Gemini mock), form (title, category, location, date, time, validity, link, image), live card preview | ✅ UI complete, fake AI simulation |
| `discover_localloop_amazon_style_browsing` | **Discover** — Amazon-style search results with sidebar category+locality filters, grid of post cards, sort bar | ✅ UI complete, mock data |
| `moderation_localloop_clean_queue` | **Moderation Queue** — tabbed queue (pending/reports/updates/under-review/resolved/expired), Verify/Resolve/Edit/Remove actions per card | ✅ UI complete, mock data |
| `my_activity_localloop_2` | **My Activity** — user profile card with stats, tabbed (My Posts / Helpful Marked / Updates Suggested / Reported / Saved), filter chips | ✅ UI complete, mock data |
| `civic_indigo` | **Design token system v1** (DESIGN.md only) | 📄 Design spec only |
| `civic_indigo_glass` | **Design token system v2** (DESIGN.md only) | 📄 Design spec only |
| `localloop_logo` | Logo asset (screen.png) | 🖼 Asset only |
=======
| `home_Vicinus_2` | **Home Feed** — hero search, category filter strip, recommended carousel, main post feed (sort/filter), sidebar trending | ✅ UI complete, 100% mock data |
| `share_information_Vicinus_clean_spacious` | **Create Post** — AI-parse textarea (Gemini mock), form (title, category, location, date, time, validity, link, image), live card preview | ✅ UI complete, fake AI simulation |
| `discover_Vicinus_amazon_style_browsing` | **Discover** — Amazon-style search results with sidebar category+locality filters, grid of post cards, sort bar | ✅ UI complete, mock data |
| `moderation_Vicinus_clean_queue` | **Moderation Queue** — tabbed queue (pending/reports/updates/under-review/resolved/expired), Verify/Resolve/Edit/Remove actions per card | ✅ UI complete, mock data |
| `my_activity_Vicinus_2` | **My Activity** — user profile card with stats, tabbed (My Posts / Helpful Marked / Updates Suggested / Reported / Saved), filter chips | ✅ UI complete, mock data |
| `civic_indigo` | **Design token system v1** (DESIGN.md only) | 📄 Design spec only |
| `civic_indigo_glass` | **Design token system v2** (DESIGN.md only) | 📄 Design spec only |
| `Vicinus_logo` | Logo asset (screen.png) | 🖼 Asset only |
>>>>>>> ee27a55 (feat: complete Vicinus backend integration and unified frontend SPA)

#### What Is Missing / Incomplete
- ❌ **No real API calls** — zero `fetch`/`axios` calls anywhere. All data is hardcoded HTML.
- ❌ **No authentication** — "AM" / "Rahul Sharma" are hardcoded strings. No login/signup screens.
- ❌ **No Gemini API integration** — the "Structure with AI" button is a hardcoded `setTimeout` simulation.
- ❌ **No `/server`** backend at all (just an empty directory + `.env`).
- ❌ **No routing** — all pages are disconnected `code.html` files; no SPA shell.
- ❌ **No image upload** — upload UI exists but has no real handler.

---

### 2B. Database Models (inferred from UI data structures)

#### Model 1: `Post` (core entity — everything the feed, discover, moderation shows)

```js
{
  _id: ObjectId,
  title: String,              // max 100 chars
  description: String,
  category: String,           // enum: internship | events | announcements | emergencies | infrastructure | lost_found | scholarships | local-issues
  location: String,           // predefined list + free text
  locality: String,           // DBIT/Kurla | Bandra West | Andheri East | Powai Central
  date: String,               // freetext for hackathon ("Tomorrow", "Oct 5")
  time: String,               // freetext
  validUntil: String,         // freetext
  link: String,               // optional URL
  imageUrl: String,           // optional uploaded image
  status: String,             // enum: needs-verification | verified | under-review | resolved | expired
  helpfulCount: Number,       // upvotes
  author: ObjectId → User,
  rawInput: String,           // original WhatsApp/Telegram text before AI parse
  reports: [{ userId, reason, createdAt }],
  suggestedUpdates: [{ userId, text, createdAt }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Model 2: `User`

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  avatarUrl: String,
  locality: String,           // home neighborhood
  role: String,               // enum: resident | moderator | admin
  isVerified: Boolean,        // verified community member badge
  joinedAt: Date,
  stats: {
    postsShared: Number,
    helpfulVotes: Number,
    updatesAccepted: Number
  },
  savedPosts: [ObjectId],     // bookmarks
  helpfulPosts: [ObjectId]    // posts they marked helpful
}
```

#### Model 3: `Notification` (for the bell icon dropdown)

```js
{
  _id: ObjectId,
  userId: ObjectId → User,
  message: String,
  postId: ObjectId → Post,
  read: Boolean,
  createdAt: Date
}
```

---

### 2C. Required API Routes (Hackathon MVP — strict 6h scope)

#### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user from JWT |

#### Posts (`/api/posts`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | List posts (query: `locality`, `category`, `status`, `sort`, `search`, `page`) |
| POST | `/api/posts` | Create post (auth required) |
| GET | `/api/posts/:id` | Get single post |
| PATCH | `/api/posts/:id/helpful` | Toggle helpful (auth required) |
| POST | `/api/posts/:id/report` | Flag a post (auth required) |
| POST | `/api/posts/:id/suggest-update` | Suggest update text (auth required) |

#### Moderation (`/api/moderation`) — moderator/admin role only
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/moderation/queue` | List all posts needing review (tab-aware: pending/reports/updates/resolved) |
| PATCH | `/api/moderation/posts/:id/verify` | Mark post verified |
| PATCH | `/api/moderation/posts/:id/resolve` | Mark post resolved |
| DELETE | `/api/moderation/posts/:id` | Remove/delete post |

#### AI Parse (`/api/ai`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/parse` | Send raw WhatsApp text → Gemini API → return structured form fields |

#### User / My Activity (`/api/users`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me/posts` | Get current user's posts |
| GET | `/api/users/me/saved` | Get saved/bookmarked posts |
| PATCH | `/api/users/me/save/:postId` | Toggle bookmark |
| GET | `/api/users/me/helpful` | Posts user marked helpful |

#### Notifications (`/api/notifications`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications/mark-read` | Mark all read |

---

## 🏗️ Proposed `/server` File Structure

```
server/
├── .env                          ✅ (already created)
├── package.json
├── src/
│   ├── index.js                  # Express app entry, connect MongoDB
│   ├── config/
│   │   └── db.js                 # Mongoose connection
│   ├── middleware/
│   │   ├── auth.js               # JWT verify middleware
│   │   └── requireRole.js        # Role guard (moderator/admin)
│   ├── models/
│   │   ├── User.js               # Mongoose User model
│   │   ├── Post.js               # Mongoose Post model
│   │   └── Notification.js       # Mongoose Notification model
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── posts.routes.js
│   │   ├── moderation.routes.js
│   │   ├── users.routes.js
│   │   ├── ai.routes.js
│   │   └── notifications.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── posts.controller.js
│   │   ├── moderation.controller.js
│   │   ├── users.controller.js
│   │   ├── ai.controller.js
│   │   └── notifications.controller.js
│   └── utils/
│       ├── gemini.js             # Gemini API helper (parse raw text)
│       └── asyncHandler.js       # Catch-all async error wrapper
```

**Stack:** Node.js + Express + Mongoose (MongoDB) + JWT + bcrypt + `@google/generative-ai`

---

## ⏱️ Hackathon Time Allocation Suggestion (6h)

| Phase | Time | Work |
|-------|------|------|
| **Phase 1** | 30 min | `npm init`, install deps, Express boilerplate, Mongoose connect |
| **Phase 2** | 30 min | Models: User, Post, Notification |
| **Phase 3** | 45 min | Auth routes (register, login, /me) + JWT middleware |
| **Phase 4** | 60 min | Posts CRUD (list with filters, create, helpful toggle) |
| **Phase 5** | 30 min | Report + suggest-update endpoints |
| **Phase 6** | 30 min | Moderation queue routes (verify, resolve, delete) |
| **Phase 7** | 30 min | Users/my-activity routes (my posts, saved, helpful) |
| **Phase 8** | 30 min | Gemini AI parse endpoint |
| **Phase 9** | 30 min | Notifications (get + mark-read) |
| **Phase 10** | 15 min | Wire client HTML → real API (update fetch calls) |
| **Buffer** | 30 min | Testing, fix CORS, seed data |

> [!IMPORTANT]
> **Awaiting your confirmation** to start generating backend code.  
> Any changes to the proposed structure above? Should I cut any routes for time?
```
