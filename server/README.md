# ⚙️ Backend Tech Stack

The Axiom CMS backend is built using a modular **MVC-inspired architecture** with feature-based organization, secure authentication, authorization, validation, and optimized MongoDB queries.

## 🛠️ Core Technologies

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **MongoDB** — NoSQL database
- **Mongoose** — ODM and schema management
- **JWT** — Access & refresh token authentication
- **bcrypt** — Password hashing + pepper 
- **Nodemailer** — Email verification and authentication emails
- **dotenv** — Environment variable management
- **Slugify** — SEO-friendly URL slug generation

---

# 🏗️ Architecture

Axiom CMS follows a **feature-based MVC architecture**.

```text
src/
├── features/
│   ├── auth/
│   ├── users/
│   ├── posts/
│   ├── categories/
│   ├── tags/
│   ├── comments/
│   └── likes/
│
├── middlewares/
│   ├── authentication.js
│   ├── authorization.js
│   ├── ownership.js
│
├── utils/
├── config/
├── app.js ( server )
