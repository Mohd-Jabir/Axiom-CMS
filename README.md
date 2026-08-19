# Axiom CMS

> A modern, full-stack content management system for creating, managing, organizing, and publishing articles.

🌐 **Live Application:** https://axiom-cms.vercel.app

---

## Overview

**Axiom CMS** is a full-stack blogging and content management platform designed around a clean editorial experience.

It allows users to create and manage articles, organize content using categories and tags, publish or archive posts, manage profiles, and control access through role-based permissions.

The application also implements secure authentication using an **access token + refresh token cycle**, allowing authenticated sessions to remain active while maintaining secure API access.

The frontend is designed with a modern, minimal, editorial-style UI with smooth interactions and responsive layouts.

---

## 🚀 Live Demo

### Axiom CMS

**https://axiom-cms.vercel.app**

You can open the live application here:

👉 https://axiom-cms.vercel.app

The application includes:

- Public article browsing
- User registration and login
- Email verification
- Authenticated content management
- Article creation and editing
- Categories and tags
- User profiles
- Role-based access
- Admin dashboard
- Publishing and archiving
- Responsive UI
- Smooth page transitions and animations

---

# ✨ Features

## 🔐 Authentication & Authorization

Axiom uses token-based authentication with an access-token and refresh-token flow.

### Authentication features

- User registration
- User login
- Email verification
- Resend verification email
- Access token authentication
- Refresh token handling
- Protected routes
- Guest-only routes
- Role-based authorization
- Automatic authentication handling
- Secure API requests through Axios

### Supported roles

The application supports role-based permissions such as:

- `user`
- `author`
- `editor`
- `admin`

Different roles can access different parts of the CMS.

---

# 📝 Post Management

Users can manage their articles through a dedicated editorial interface.

### Post features

- Create posts
- Edit posts
- Delete posts
- View posts
- View individual posts
- View posts by slug
- Manage personal posts
- Publish posts
- Archive posts
- Draft posts
- Public/private/unlisted visibility
- Pagination
- Cover images
- Excerpts
- SEO metadata

### Supported content formats

Axiom supports multiple content formats:

- Markdown
- Plain text
- HTML
- JSON

---

# 🏷️ Categories & Tags

Articles can be organized using categories and tags.

### Categories

- Create categories
- Edit categories
- Delete/manage categories
- View category pages
- Associate posts with categories

### Tags

- Create tags
- Edit tags
- Delete/manage tags
- View tag pages
- Associate multiple tags with posts

This allows content to be structured and discovered more easily.

---

# 👤 User Profiles

Axiom provides user profile functionality.

Users can have:

- Profile information
- Username
- First and last name
- Avatar
- Public profile page

Public profiles are accessible through:

```text
/users/:username
