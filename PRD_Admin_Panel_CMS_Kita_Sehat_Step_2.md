# PRD — Kita-Sehat.id NG Step 2: Admin Panel CMS Powerful, WYSIWYG Editor & Editorial Workflow

**Project:** Kita-Sehat.id NG  
**Step:** Step 2 — Admin Panel Development  
**Target:** Google Antigravity ready  
**Primary Goal:** Membangun admin panel CMS se-powerful WordPress, tetapi lebih ringan, modern, aman, dan disesuaikan untuk portal berita kesehatan Kita-Sehat.id.  
**Frontend Stack:** Next.js, TypeScript, Tailwind CSS  
**Backend Stack:** Existing Step 3 Backend, Next.js API Routes / Node.js, Prisma ORM, PostgreSQL  
**Design Direction:** Professional national news CMS, WordPress-inspired, clean, fast, editorial-friendly  
**Brand:** Kita-Sehat.id — Informasi Kesehatan Keluarga  
**Tagline:** `#HidupSehatMulaiSekarang`

---

## 1. Executive Summary

Step 2 adalah pengembangan **Admin Panel CMS** untuk Kita-Sehat.id NG. Step ini sempat ditunda karena backend dan route content pada Step 3 perlu disiapkan lebih dulu. Sekarang admin panel harus mengikuti struktur backend yang sudah dirancang, terutama database Prisma dan entity seperti Article, Category, Tag, Author, AdvertisementBanner, StaticPage, SiteSetting, dan NewsletterSubscriber.

Admin panel ini harus terasa familiar untuk pengguna yang sudah terbiasa menggunakan WordPress, tetapi dibuat lebih modern, fokus, cepat, dan nyaman. Target pengguna adalah tim redaksi, editor, admin konten, dan owner yang ingin mengelola artikel kesehatan, banner iklan, halaman statis, kategori, tag, SEO, dan pengaturan website.

Admin panel harus memberikan pengalaman:

- Mudah digunakan oleh non-programmer.
- Powerful untuk redaksi profesional.
- Mendukung WYSIWYG editor yang nyaman.
- SEO-ready.
- Mobile-aware, namun tetap dioptimalkan untuk desktop.
- Aman untuk pengelolaan konten.
- Siap dikembangkan menjadi editorial workflow lengkap.

---

## 2. Background

Website lama Kita-Sehat.id menggunakan WordPress + Elementor. WordPress memang familiar untuk banyak user, tetapi terasa berat dan menyulitkan ketika ingin melakukan perombakan desain dan pengembangan sistem yang lebih custom.

Kita-Sehat.id NG akan dibangun dengan:

- Public site modern berbasis Next.js.
- Backend Prisma + PostgreSQL.
- Admin panel custom yang lebih clean.
- CMS experience yang meniru kemudahan WordPress, tetapi tidak membebani sistem.

Admin panel harus menjadi pusat kerja redaksi.

---

## 3. Main Objective

Membangun admin panel CMS untuk Kita-Sehat.id yang mampu mengelola:

1. Artikel kesehatan.
2. Kategori.
3. Tag.
4. Author/penulis.
5. Banner iklan.
6. Halaman statis.
7. Site settings.
8. Subscriber newsletter.
9. Dashboard editorial.
10. Draft, publish, archive.
11. SEO artikel dan page.
12. Preview konten sebelum publish.
13. WYSIWYG editor powerful.
14. Media/image handling awal.
15. Role-ready architecture untuk tahap keamanan lanjutan.

---

## 4. Product Principles

Admin panel harus mengikuti prinsip berikut:

### 4.1 Familiar like WordPress

User yang terbiasa WordPress harus langsung paham:

- Sidebar menu kiri.
- Dashboard ringkasan.
- Menu Posts/Articles.
- Add New Article.
- Categories.
- Tags.
- Media.
- Pages.
- Settings.
- Publish panel.
- Preview button.
- Draft status.

### 4.2 Modern like National News CMS

Tampilan harus terlihat seperti admin panel untuk media nasional:

- Clean.
- Cepat.
- Tidak ramai.
- Table management kuat.
- Filter lengkap.
- Bulk action.
- Status editorial jelas.
- UI profesional.

### 4.3 Writer-first Experience

Fokus utama admin panel adalah menulis artikel dengan nyaman:

- Judul besar.
- Editor luas.
- Toolbar lengkap.
- Autosave-ready.
- Preview konten.
- SEO panel.
- Cover image.
- Category & tag selection.
- Publish scheduler.
- Reading time.
- Medical disclaimer block.

### 4.4 Safe and Controlled

Karena ini website kesehatan, admin panel harus mendorong konten yang bertanggung jawab:

- Disclaimer medis.
- Field reviewer/medical contributor ready.
- SEO description wajib.
- Category wajib.
- Excerpt wajib.
- Cover image alt wajib.
- Status draft sebelum publish.

---

## 5. Recommended Libraries

### 5.1 Core UI

Gunakan:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React Icons
- TanStack Table
- React Hook Form
- Zod
- Sonner atau React Hot Toast
- Recharts untuk dashboard chart
- date-fns untuk formatting tanggal
- clsx / tailwind-merge

Install:

```bash
npm install @tanstack/react-table react-hook-form zod @hookform/resolvers date-fns lucide-react sonner recharts clsx tailwind-merge
```

### 5.2 WYSIWYG Editor Recommendation

Admin panel harus menggunakan editor yang powerful, modern, dan cocok untuk CMS.

Rekomendasi utama:

## Option A — Tiptap Editor

**Recommended.**

Alasan:

- Modern.
- Extensible.
- Cocok untuk Next.js.
- Bisa custom toolbar.
- Bisa support heading, image, link, quote, table, checklist.
- Bisa disimpan sebagai HTML atau JSON.
- Bisa dibuat seperti WordPress block editor ringan.

Install:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-highlight @tiptap/extension-character-count
```

Recommended extensions:

- StarterKit
- Image
- Link
- Placeholder
- Table
- TextAlign
- Underline
- Highlight
- CharacterCount
- BulletList
- OrderedList
- Blockquote
- CodeBlock
- HorizontalRule

## Option B — Editor.js

Cocok jika ingin block-style editor mirip WordPress Gutenberg, tetapi implementasi dan output rendering butuh perhatian lebih.

## Option C — TinyMCE / CKEditor

Lebih familiar seperti classic WordPress editor, tetapi dependency dan lisensi perlu diperhatikan.

### Final Decision

Untuk Step 2 gunakan:

```txt
Tiptap sebagai WYSIWYG editor utama.
```

Output konten disimpan dalam field:

```txt
Article.content
```

Format awal:

```txt
HTML string
```

Alasan memilih HTML:

- Mudah dirender di public site.
- Cocok dengan schema Step 3.
- Lebih cepat untuk integrasi awal.
- Bisa dikembangkan ke JSON block di masa depan.

---

## 6. Backend Alignment

Admin panel harus mengikuti entity dari Step 3:

- Author
- Category
- Article
- Tag
- ArticleTag
- MediaAsset
- AdvertisementBanner
- StaticPage
- SiteSetting
- NewsletterSubscriber

Admin panel harus menggunakan API existing atau menambahkan admin API baru.

Recommended admin route namespace:

```txt
/app/api/admin/*
```

Alasan:

- Public API tetap bersih.
- Admin API bisa diamankan dengan middleware.
- Role-based access lebih mudah.
- CRUD admin tidak bercampur dengan public read API.

---

## 7. Admin Panel URL Structure

### 7.1 Admin Pages

```txt
/admin
/admin/login
/admin/dashboard

/admin/articles
/admin/articles/new
/admin/articles/[id]/edit
/admin/articles/preview/[id]

/admin/categories
/admin/tags
/admin/authors

/admin/media
/admin/banners
/admin/pages
/admin/newsletter
/admin/settings

/admin/profile
/admin/audit-log
```

### 7.2 Admin API Routes

```txt
/api/admin/auth/login
/api/admin/auth/logout
/api/admin/me

/api/admin/dashboard

/api/admin/articles
/api/admin/articles/[id]
/api/admin/articles/[id]/publish
/api/admin/articles/[id]/archive
/api/admin/articles/[id]/duplicate
/api/admin/articles/[id]/preview

/api/admin/categories
/api/admin/categories/[id]

/api/admin/tags
/api/admin/tags/[id]

/api/admin/authors
/api/admin/authors/[id]

/api/admin/media
/api/admin/media/[id]

/api/admin/banners
/api/admin/banners/[id]

/api/admin/pages
/api/admin/pages/[id]

/api/admin/newsletter
/api/admin/settings
/api/admin/audit-log
```

---

## 8. Authentication & Security

### 8.1 Phase Approach

Karena Step 3 sebelumnya belum mendefinisikan User/Admin model secara penuh, Step 2 harus menambahkan model baru untuk admin authentication.

Tambahkan entity:

- AdminUser
- AdminRole
- AuditLog

### 8.2 Login Requirement

Admin panel minimal memiliki:

- Email
- Password
- Session/JWT
- Logout
- Protected route middleware
- Password hashing menggunakan bcrypt
- Role ready

Recommended install:

```bash
npm install bcryptjs jose
npm install -D @types/bcryptjs
```

### 8.3 Role

Role awal:

| Role | Permission |
|---|---|
| SUPER_ADMIN | Full access |
| EDITOR | Manage article, page, category, tag, banner |
| AUTHOR | Create and edit own article |
| VIEWER | Read only dashboard |

### 8.4 Admin Security Requirement

- Password wajib di-hash.
- API admin wajib protected.
- Middleware redirect ke `/admin/login` jika belum login.
- Jangan expose passwordHash di response.
- Tambahkan audit log untuk aksi penting.
- Form request wajib divalidasi dengan Zod.
- Delete menggunakan confirmation modal.
- Bulk delete harus double confirmation.
- Publish artikel harus validasi field wajib.

---

## 9. Additional Prisma Schema for Admin Panel

Tambahkan model berikut ke `schema.prisma`:

```prisma
enum AdminRoleName {
  SUPER_ADMIN
  EDITOR
  AUTHOR
  VIEWER
}

model AdminUser {
  id           String        @id @default(cuid())
  name         String
  email        String        @unique
  passwordHash String
  avatarUrl    String?
  role         AdminRoleName @default(AUTHOR)
  isActive     Boolean       @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  auditLogs    AuditLog[]

  @@map("admin_users")
}

model AuditLog {
  id          String    @id @default(cuid())
  adminUserId String?
  adminUser   AdminUser? @relation(fields: [adminUserId], references: [id], onDelete: SetNull)
  action      String
  entity      String
  entityId    String?
  description String?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime  @default(now())

  @@index([adminUserId])
  @@index([entity])
  @@index([createdAt])
  @@map("audit_logs")
}
```

### Optional Enhancement to Existing Article Model

Tambahkan field berikut jika ingin editorial workflow lebih kuat:

```prisma
model Article {
  // existing fields...

  createdByAdminId String?
  updatedByAdminId String?
  reviewedBy       String?
  reviewedAt       DateTime?
  scheduledAt      DateTime?
  allowIndexing    Boolean   @default(true)
  canonicalUrl     String?
}
```

Catatan:

Untuk implementasi awal, field optional ini boleh ditunda jika ingin menjaga schema tetap sederhana. Namun untuk CMS nasional, field ini sangat direkomendasikan.

---

## 10. Admin Seed User

Tambahkan ke seed:

```ts
import bcrypt from "bcryptjs";

const passwordHash = await bcrypt.hash("AdminKitaSehat123!", 10);

await prisma.adminUser.upsert({
  where: { email: "admin@kita-sehat.id" },
  update: {},
  create: {
    name: "Admin Kita Sehat",
    email: "admin@kita-sehat.id",
    passwordHash,
    role: "SUPER_ADMIN",
    isActive: true,
  },
});
```

Credential local development:

```txt
Email: admin@kita-sehat.id
Password: AdminKitaSehat123!
```

Catatan:

Setelah production, password wajib diganti.

---

## 11. Admin Layout Requirement

### 11.1 Desktop Layout

Desktop admin panel menggunakan layout:

```txt
+------------------------------------------------------+
| Topbar: Search, quick create, notification, profile  |
+-------------+----------------------------------------+
| Sidebar     | Main Content                           |
|             |                                        |
| Dashboard   | Page Title                             |
| Articles    | Breadcrumb                             |
| Categories  | Cards / Tables / Forms                 |
| Tags        |                                        |
| Media       |                                        |
| Banners     |                                        |
| Pages       |                                        |
| Settings    |                                        |
+-------------+----------------------------------------+
```

### 11.2 Sidebar Menu

Sidebar menu:

1. Dashboard
2. Articles
   - All Articles
   - Add New
   - Drafts
   - Published
   - Archived
3. Categories
4. Tags
5. Authors
6. Media
7. Banners
8. Pages
9. Newsletter
10. Settings
11. Audit Log
12. Profile

### 11.3 Topbar

Topbar harus memiliki:

- Global search input
- Quick add article button
- Preview public site button
- Notification icon
- User profile dropdown
- Logout

### 11.4 Mobile Admin

Admin panel harus responsive, tetapi penggunaan utama tetap desktop.

Mobile behavior:

- Sidebar menjadi drawer.
- Table menjadi card list.
- Editor tetap bisa dipakai, tetapi ada warning kecil: “Untuk pengalaman menulis terbaik, gunakan desktop/tablet.”

---

## 12. Dashboard Page

URL:

```txt
/admin/dashboard
```

### 12.1 Dashboard Cards

Tampilkan cards:

- Total Articles
- Published Articles
- Draft Articles
- Categories
- Authors
- Newsletter Subscribers
- Active Banners
- Total Views

### 12.2 Editorial Overview

Tampilkan:

- Artikel terbaru dibuat
- Draft terakhir
- Artikel populer
- Artikel belum lengkap SEO
- Banner aktif
- Subscriber terbaru

### 12.3 Chart

Gunakan Recharts.

Chart awal:

- Article published per week
- Views by category
- Subscriber growth sample

### 12.4 Dashboard UX

Dashboard harus terasa sebagai “command center” redaksi.

Komponen:

- Welcome message
- Quick actions:
  - Write New Article
  - Manage Banner
  - Add Category
  - View Public Site
- Recent activity / audit log

---

## 13. Article Management

### 13.1 Article List Page

URL:

```txt
/admin/articles
```

Article list harus menggunakan table powerful.

Gunakan:

```txt
TanStack Table + shadcn/ui
```

Columns:

- Checkbox
- Cover thumbnail
- Title
- Category
- Author
- Status
- Featured
- Hero
- Popular
- Views
- Published Date
- Updated Date
- Actions

Features:

- Search title
- Filter by status
- Filter by category
- Filter by author
- Filter by featured
- Filter by hero
- Sort by latest
- Sort by view count
- Pagination
- Bulk action:
  - Publish
  - Move to draft
  - Archive
  - Delete
- Row action:
  - Edit
  - Preview
  - Duplicate
  - Publish/Unpublish
  - Archive
  - Delete

### 13.2 Article Status

Status:

- DRAFT
- PUBLISHED
- ARCHIVED

UI badge:

- Draft: gray
- Published: green/brand primary
- Archived: red/orange

### 13.3 Article Form Page

URL:

```txt
/admin/articles/new
/admin/articles/[id]/edit
```

Article form harus mirip experience WordPress classic editor + modern SEO panel.

Layout desktop:

```txt
+------------------------------------------------------+
| Title input large                                    |
+------------------------------------------------------+
| Main editor area                  | Publish panel     |
| WYSIWYG editor                    | Status            |
|                                   | Visibility        |
|                                   | Category          |
|                                   | Tags              |
|                                   | Cover image       |
|                                   | Featured/Hero     |
|                                   | Publish button    |
+------------------------------------------------------+
| SEO panel                                            |
| Excerpt panel                                        |
| Medical disclaimer panel                             |
+------------------------------------------------------+
```

### 13.4 Article Required Fields

Sebelum publish, wajib validasi:

- Title
- Slug
- Excerpt
- Content
- Category
- Author
- Cover image
- Cover image alt
- SEO title
- SEO description
- Published date

Jika field belum lengkap, tampilkan checklist “Article Readiness”.

### 13.5 Article Readiness Checklist

Tampilkan panel:

```txt
Article Readiness
[✓] Title filled
[✓] Content has minimum 300 words
[✓] Category selected
[✓] Excerpt filled
[✓] Cover image set
[✓] Image alt text filled
[✓] SEO title filled
[✓] SEO description filled
[✓] Medical disclaimer included
```

Jika belum lengkap, button Publish disabled atau tampilkan confirmation.

---

## 14. WYSIWYG Editor Requirement

### 14.1 Editor Library

Gunakan:

```txt
Tiptap
```

### 14.2 Toolbar

Toolbar editor harus memiliki:

- Paragraph
- Heading 2
- Heading 3
- Bold
- Italic
- Underline
- Highlight
- Bullet list
- Numbered list
- Blockquote
- Link
- Image
- Table
- Align left
- Align center
- Align right
- Horizontal rule
- Undo
- Redo
- Clear formatting
- Medical disclaimer block
- Info box block
- Warning box block

### 14.3 Custom Content Blocks

Buat custom block / shortcut:

#### Medical Disclaimer Block

```html
<div class="medical-disclaimer">
  <strong>Disclaimer Medis:</strong>
  Artikel ini bersifat informasi umum dan tidak menggantikan konsultasi langsung dengan dokter atau tenaga kesehatan profesional.
</div>
```

#### Health Tips Box

```html
<div class="health-tip">
  <strong>Tips Sehat:</strong>
  Mulai dari kebiasaan kecil yang konsisten dan mudah dilakukan setiap hari.
</div>
```

#### Warning Box

```html
<div class="health-warning">
  <strong>Perhatian:</strong>
  Segera hubungi tenaga medis jika gejala memburuk atau berlangsung lama.
</div>
```

### 14.4 Editor UX

Editor harus memiliki:

- Floating toolbar atau sticky toolbar.
- Placeholder: “Mulai tulis artikel kesehatan di sini…”
- Word count.
- Character count.
- Estimated reading time.
- Autosave indicator.
- Last saved timestamp.
- Fullscreen writing mode.
- Preview mode.

### 14.5 Content Output

Konten disimpan sebagai HTML di:

```txt
Article.content
```

Sanitasi HTML harus diperhatikan di public rendering.

Recommended library untuk rendering aman:

```bash
npm install isomorphic-dompurify
```

---

## 15. SEO Panel

Setiap artikel dan static page wajib memiliki SEO panel.

Fields:

- SEO Title
- SEO Description
- SEO Keywords
- Canonical URL
- Allow indexing toggle
- Social preview title
- Social preview description
- Social preview image

Untuk schema awal, gunakan field existing:

- seoTitle
- seoDescription
- seoKeywords

Optional future fields:

- canonicalUrl
- allowIndexing
- ogTitle
- ogDescription
- ogImage

### 15.1 SEO Preview

Tampilkan preview seperti Google result:

```txt
Kita-Sehat.id
https://kita-sehat.id/berita/slug-artikel
SEO Title Here
SEO description here...
```

### 15.2 SEO Validation

Tampilkan indikator:

- SEO title ideal 40–60 characters.
- SEO description ideal 120–160 characters.
- Slug tidak terlalu panjang.
- Keyword terisi.
- Cover image ada.

---

## 16. Category Management

URL:

```txt
/admin/categories
```

Features:

- List category
- Add category
- Edit category
- Delete category jika belum dipakai
- Reorder category
- Active/inactive toggle
- Category color
- Description
- Slug auto-generate

Fields:

- name
- slug
- description
- color
- order
- isActive

UX:

- Gunakan table.
- Tampilkan jumlah artikel per kategori.
- Warn jika kategori masih punya artikel saat ingin delete.

---

## 17. Tag Management

URL:

```txt
/admin/tags
```

Features:

- List tag
- Add tag
- Edit tag
- Delete tag
- Search tag
- Show article count

Fields:

- name
- slug

UX:

- Simple table.
- Bisa quick add dari article editor.
- Slug auto-generate.

---

## 18. Author Management

URL:

```txt
/admin/authors
```

Features:

- List author
- Add author
- Edit author
- Delete author jika belum punya artikel
- Avatar URL
- Bio
- Role/contributor label

Fields:

- name
- slug
- email
- avatarUrl
- bio
- role

UX:

- Card/table hybrid.
- Author profile preview.
- Show article count.

---

## 19. Media Management

URL:

```txt
/admin/media
```

Step awal media management bisa menggunakan URL-based image.

Features:

- List media asset
- Add media by URL
- Edit alt text
- Edit caption
- Attach to article
- Delete unused media
- Preview image grid

Fields:

- url
- altText
- caption
- type
- articleId

Future enhancement:

- Upload local/server.
- Upload S3-compatible storage.
- Image optimization.
- CDN.

UX:

- Grid view.
- List view.
- Search media.
- Filter by article.
- Copy URL button.

---

## 20. Banner Advertisement Management

URL:

```txt
/admin/banners
```

Features:

- List banner
- Add banner
- Edit banner
- Activate/deactivate banner
- Schedule banner start/end date
- Placement management
- Preview banner
- Target URL
- Title and description

Fields:

- name
- placement
- imageUrl
- targetUrl
- title
- description
- isActive
- startDate
- endDate

Placement:

- HEADER_TOP
- BELOW_HERO
- SIDEBAR
- ARTICLE_MIDDLE
- ARTICLE_BOTTOM
- MOBILE_STICKY

UX:

- Placement badge.
- Active status.
- Preview modal.
- Date schedule display.
- Warning if image dimension not ideal.

Recommended dimension guide:

| Placement | Recommended Size |
|---|---|
| HEADER_TOP | 970x90 |
| BELOW_HERO | 1200x180 |
| SIDEBAR | 300x600 |
| ARTICLE_MIDDLE | 728x90 |
| ARTICLE_BOTTOM | 728x90 |
| MOBILE_STICKY | 360x80 |

---

## 21. Static Page Management

URL:

```txt
/admin/pages
/admin/pages/[id]/edit
```

Manage:

- Tentang Kami
- Kebijakan Privasi
- Disclaimer Medis
- Kontak
- Pedoman Konten

Features:

- WYSIWYG editor
- SEO panel
- Active/inactive toggle
- Preview page
- Slug management

Fields:

- title
- slug
- content
- seoTitle
- seoDescription
- isActive

UX:

- Mirip article editor, tetapi lebih sederhana.
- Tidak membutuhkan category/tag.

---

## 22. Newsletter Management

URL:

```txt
/admin/newsletter
```

Features:

- List subscriber
- Search subscriber
- Filter active/inactive
- Export CSV
- Disable subscriber
- Show source
- Show created date

Fields:

- email
- name
- source
- isActive
- createdAt

UX:

- Table simple.
- Export button.
- Subscriber count cards.

---

## 23. Site Settings

URL:

```txt
/admin/settings
```

Setting groups:

### 23.1 General

- Site name
- Tagline
- Campaign tagline
- Contact email

### 23.2 Brand

- Primary color: `#0098b0`
- Secondary color: `#103174`
- Accent color: `#2596be`
- Logo URL

### 23.3 SEO

- Meta title
- Meta description
- Default OG image
- Robots indexing default

### 23.4 Social

- Instagram URL
- Facebook URL
- TikTok URL
- YouTube URL

### 23.5 Medical Content

- Default disclaimer text
- Medical review label
- Editorial guideline link

UX:

- Settings form grouped by tabs.
- Save setting button.
- Reset to default optional.
- Preview brand color.

---

## 24. Audit Log

URL:

```txt
/admin/audit-log
```

Log actions:

- Login
- Logout
- Create article
- Update article
- Publish article
- Archive article
- Delete article
- Update settings
- Update banner
- Update page

Fields:

- adminUser
- action
- entity
- entityId
- description
- ipAddress
- userAgent
- createdAt

UX:

- Table.
- Filter by user.
- Filter by action.
- Filter by date.
- Search entity.

---

## 25. Admin API CRUD Requirements

### 25.1 Articles CRUD

#### GET `/api/admin/articles`

Query:

```txt
?page=1&limit=10&status=DRAFT&category=nutrisi&q=keyword
```

Return paginated articles.

#### POST `/api/admin/articles`

Create article.

Payload:

```json
{
  "title": "Judul Artikel",
  "slug": "judul-artikel",
  "excerpt": "Ringkasan artikel",
  "content": "<p>Konten artikel</p>",
  "coverImage": "https://example.com/image.jpg",
  "coverImageAlt": "Alt image",
  "status": "DRAFT",
  "categoryId": "category-id",
  "authorId": "author-id",
  "tagIds": ["tag-id-1"],
  "seoTitle": "SEO title",
  "seoDescription": "SEO description",
  "seoKeywords": "keyword 1, keyword 2",
  "isFeatured": false,
  "isHero": false,
  "isPopular": false
}
```

#### PATCH `/api/admin/articles/[id]`

Update article.

#### DELETE `/api/admin/articles/[id]`

Delete or soft-delete article.

Recommended:

- For MVP, delete hard only if safe.
- For production, prefer archive.

#### POST `/api/admin/articles/[id]/publish`

Publish article after validation.

#### POST `/api/admin/articles/[id]/archive`

Archive article.

#### POST `/api/admin/articles/[id]/duplicate`

Duplicate article as draft.

---

## 26. Form Validation

Gunakan Zod schema.

### 26.1 Article Validation

```ts
import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(5, "Slug minimal 5 karakter"),
  excerpt: z.string().min(30, "Excerpt minimal 30 karakter"),
  content: z.string().min(100, "Konten artikel terlalu pendek"),
  coverImage: z.string().url("Cover image harus berupa URL valid").optional(),
  coverImageAlt: z.string().min(5, "Alt image wajib diisi"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  authorId: z.string().min(1, "Author wajib dipilih"),
  seoTitle: z.string().min(10, "SEO title wajib diisi"),
  seoDescription: z.string().min(50, "SEO description wajib diisi"),
  seoKeywords: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isHero: z.boolean().default(false),
  isPopular: z.boolean().default(false),
});
```

### 26.2 Banner Validation

```ts
export const bannerFormSchema = z.object({
  name: z.string().min(3),
  placement: z.enum([
    "HEADER_TOP",
    "BELOW_HERO",
    "SIDEBAR",
    "ARTICLE_MIDDLE",
    "ARTICLE_BOTTOM",
    "MOBILE_STICKY",
  ]),
  imageUrl: z.string().url(),
  targetUrl: z.string().url().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
```

---

## 27. UI Design System

### 27.1 Brand Colors

Gunakan brand color:

```txt
Primary: #0098b0
Secondary: #103174
Accent: #2596be
```

### 27.2 Admin Visual Style

Admin panel harus:

- Clean white background.
- Sidebar navy/deep blue subtle.
- Primary action menggunakan `#0098b0`.
- Important highlight menggunakan `#2596be`.
- Heading dan strong section menggunakan `#103174`.
- Banyak whitespace.
- Border soft.
- Shadow minimal.
- Rounded modern.

### 27.3 Component Style

Components:

- Card
- Button
- Badge
- Table
- Dialog
- Sheet/drawer
- Dropdown menu
- Tabs
- Tooltip
- Input
- Select
- Date picker
- Toast
- Command palette

### 27.4 Typography

Gunakan:

- Font sans-serif modern.
- Heading bold.
- Table text readable.
- Editor typography harus nyaman untuk menulis panjang.

---

## 28. UX Details Inspired by WordPress

### 28.1 Familiar Patterns

Adopsi pola WordPress:

- “Add New”
- “Edit”
- “Preview”
- “Publish”
- “Move to Draft”
- “Categories”
- “Tags”
- “Featured Image”
- “Excerpt”
- “Permalink”
- “Status”

### 28.2 Improved Patterns

Tingkatkan dari WordPress:

- Faster interface.
- SEO panel built-in.
- Article readiness checklist.
- Medical disclaimer shortcut.
- Banner placement preview.
- Cleaner media handling.
- Better dashboard.
- More modern table filters.
- Autosave indicator.

---

## 29. Autosave Requirement

Autosave sangat penting untuk editor.

### 29.1 Behavior

- Saat user menulis, autosave setiap 20–30 detik.
- Autosave hanya untuk artikel berstatus DRAFT.
- Tampilkan status:
  - Saving...
  - Saved
  - Last saved 14:32
  - Failed to save
- Jangan autosave jika content kosong total.
- Debounce input agar tidak terlalu sering call API.

### 29.2 MVP

Untuk MVP Step 2, autosave bisa dibuat sederhana:

- Debounced save button.
- Manual save.
- Autosave optional.

Namun UI harus sudah disiapkan.

---

## 30. Preview Requirement

Admin harus bisa preview artikel sebelum publish.

URL:

```txt
/admin/articles/preview/[id]
```

Preview menampilkan artikel menggunakan styling public site, namun dengan admin header:

```txt
Preview Mode — This article is not published yet
```

Data preview boleh mengambil draft article berdasarkan ID dari admin API.

---

## 31. Image Handling Requirement

### 31.1 MVP

Karena upload storage mungkin belum disiapkan, MVP menggunakan:

- Image URL input.
- Preview image.
- Alt text.
- Caption.
- Attach to article.

### 31.2 Future

Siapkan struktur untuk:

- Local upload.
- S3-compatible object storage.
- Cloudflare R2.
- Image optimization.
- Image cropping.
- Media library drag/drop.

---

## 32. Accessibility

Admin panel harus memperhatikan:

- Keyboard navigable.
- Label jelas.
- Button punya aria-label jika icon only.
- Contrast cukup.
- Modal bisa ditutup dengan Esc.
- Form error readable.
- Table action accessible.

---

## 33. Empty State

Setiap module harus memiliki empty state.

Contoh:

### Articles Empty State

```txt
Belum ada artikel.
Mulai tulis artikel kesehatan pertama untuk Kita-Sehat.id.
[Create New Article]
```

### Banners Empty State

```txt
Belum ada banner iklan.
Tambahkan banner untuk header, bawah hero, atau area artikel.
[Add Banner]
```

---

## 34. Loading and Error State

### 34.1 Loading

Gunakan skeleton:

- Dashboard card skeleton.
- Table skeleton.
- Editor loading state.
- Form loading state.

### 34.2 Error

Gunakan alert:

```txt
Data gagal dimuat. Periksa koneksi atau coba beberapa saat lagi.
[Retry]
```

---

## 35. Content Safety for Health Website

Karena Kita-Sehat.id adalah portal kesehatan, tambahkan fitur:

1. Default medical disclaimer.
2. Article readiness checklist.
3. Warning jika artikel tidak memiliki disclaimer.
4. Field “Reviewed by” optional.
5. Label “Informasi ini tidak menggantikan konsultasi medis.”
6. SEO tidak boleh clickbait berlebihan.

---

## 36. Acceptance Criteria

Step 2 dianggap selesai jika:

### Authentication

- [ ] Admin bisa login.
- [ ] Admin bisa logout.
- [ ] Protected route aktif.
- [ ] Password hashed.
- [ ] Admin seed user tersedia.

### Dashboard

- [ ] Dashboard menampilkan total artikel.
- [ ] Dashboard menampilkan draft/published.
- [ ] Dashboard menampilkan artikel populer.
- [ ] Dashboard menampilkan quick actions.

### Article Management

- [ ] Artikel list tampil dengan table.
- [ ] Search artikel berfungsi.
- [ ] Filter status berfungsi.
- [ ] Filter kategori berfungsi.
- [ ] Create article berfungsi.
- [ ] Edit article berfungsi.
- [ ] Publish article berfungsi.
- [ ] Archive article berfungsi.
- [ ] Duplicate article berfungsi.
- [ ] Delete/Archive confirmation tersedia.
- [ ] WYSIWYG editor Tiptap berjalan.
- [ ] SEO panel tersedia.
- [ ] Cover image preview tersedia.
- [ ] Category dan tag selection tersedia.
- [ ] Preview article tersedia.

### CMS Management

- [ ] Category CRUD berjalan.
- [ ] Tag CRUD berjalan.
- [ ] Author CRUD berjalan.
- [ ] Banner CRUD berjalan.
- [ ] Static Page CRUD berjalan.
- [ ] Newsletter list berjalan.
- [ ] Site settings berjalan.

### UX

- [ ] Sidebar admin tersedia.
- [ ] Topbar tersedia.
- [ ] UI responsive.
- [ ] Loading state tersedia.
- [ ] Empty state tersedia.
- [ ] Toast notification tersedia.
- [ ] Form validation tersedia.

### Security

- [ ] Admin API protected.
- [ ] Error production tidak expose stack.
- [ ] Audit log dibuat untuk aksi penting.

---

## 37. Development Task List for Google Antigravity

Gunakan task list berikut:

```txt
Build Kita-Sehat.id NG Step 2 Admin Panel CMS.

Context:
The project already has Step 3 backend design using Next.js, Prisma ORM, PostgreSQL, and public content routes. Now build an admin panel that follows the backend schema and can manage the content before integrating it deeply with the public site.

Tech:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- PostgreSQL
- Tiptap WYSIWYG Editor
- TanStack Table
- React Hook Form
- Zod
- Sonner
- Lucide React
- Recharts

Main requirements:
1. Create admin layout with sidebar and topbar.
2. Create admin login page.
3. Add AdminUser and AuditLog models to Prisma schema.
4. Use bcryptjs for password hashing.
5. Protect all /admin routes and /api/admin routes.
6. Create admin dashboard.
7. Create article management:
   - list
   - search
   - filter
   - pagination
   - create
   - edit
   - publish
   - archive
   - duplicate
   - preview
8. Use Tiptap as the WYSIWYG editor.
9. Add toolbar:
   - heading
   - bold
   - italic
   - underline
   - list
   - quote
   - link
   - image
   - table
   - align
   - undo
   - redo
   - medical disclaimer block
   - health tips block
   - warning block
10. Add SEO panel for article and pages.
11. Add article readiness checklist.
12. Add category CRUD.
13. Add tag CRUD.
14. Add author CRUD.
15. Add media management MVP using image URL.
16. Add banner ads management:
   - HEADER_TOP
   - BELOW_HERO
   - SIDEBAR
   - ARTICLE_MIDDLE
   - ARTICLE_BOTTOM
   - MOBILE_STICKY
17. Add static page management.
18. Add newsletter subscriber list and export CSV.
19. Add site settings grouped by General, Brand, SEO, Social, Medical Content.
20. Add audit log list.
21. Use brand colors:
   - #0098b0
   - #103174
   - #2596be
22. Make the interface professional, clean, powerful, and familiar to WordPress users.
23. Do not build public frontend in this step.
24. Make all UI mobile responsive but prioritize desktop editorial workflow.
25. Ensure all API responses use the existing standard:
   { success, message, data, meta }
```

---

## 38. Recommended Development Sequence

Ikuti urutan ini agar development tidak berantakan:

### Phase 1 — Admin Foundation

1. Add AdminUser and AuditLog model.
2. Add seed admin user.
3. Build login.
4. Build protected layout.
5. Build sidebar and topbar.
6. Build dashboard.

### Phase 2 — Article CMS Core

1. Build article list.
2. Build article create/edit form.
3. Integrate Tiptap editor.
4. Add category/tag/author selection.
5. Add SEO panel.
6. Add cover image.
7. Add publish/draft/archive.

### Phase 3 — Supporting Content

1. Category CRUD.
2. Tag CRUD.
3. Author CRUD.
4. Media URL library.
5. Banner CRUD.
6. Static Page CRUD.

### Phase 4 — Operational Tools

1. Newsletter list.
2. Settings.
3. Audit log.
4. Export tools.
5. Dashboard charts.

### Phase 5 — Polish

1. Loading skeletons.
2. Empty states.
3. Toast.
4. Confirmation modal.
5. Responsive drawer.
6. Error handling.
7. UI polish.

---

## 39. Final Notes

Admin panel Kita-Sehat.id NG harus terasa seperti CMS profesional untuk website nasional, bukan sekadar CRUD dashboard biasa.

Karakter admin panel yang harus muncul:

- Familiar seperti WordPress.
- Lebih cepat dari WordPress.
- Lebih clean dari WordPress.
- Lebih fokus untuk editorial health content.
- Memiliki WYSIWYG editor nyaman.
- Memiliki SEO built-in.
- Memiliki banner management.
- Aman untuk production.
- Siap dikembangkan menjadi CMS besar.

Target akhirnya:

```txt
Redaksi Kita-Sehat.id bisa menulis, mengelola, mempublish, dan mengatur website kesehatan keluarga secara mandiri tanpa perlu masuk ke database atau menyentuh kode.
```
