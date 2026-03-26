# Multi-Tenant CRM System

A production-ready multi-tenant CRM built with Django REST Framework and React.
Each organization operates independently with strict data isolation, role-based
access control, and JWT authentication.

---

## Tech Stack

- **Backend:** Django 5, Django REST Framework, PostgreSQL
- **Frontend:** React, Vite, Axios
- **Auth:** JWT (djangorestframework-simplejwt)
- **Storage:** AWS S3 (django-storages + boto3)
- **Other:** django-filter, django-cors-headers, python-decouple

---

## Project Structure
```
crm-project/
├── backend/
│   ├── accounts/        # User, Organization models + auth API
│   ├── crm/             # Company, Contact models + CRUD API
│   ├── logs/            # ActivityLog model + log API
│   ├── core/            # Custom permission classes
│   ├── config/          # Django settings, urls, wsgi
│   ├── .env.example     # Environment variable template
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance with JWT interceptor
    │   ├── context/     # AuthContext, ThemeContext
    │   ├── components/  # Layout, ProtectedRoute
    │   └── pages/       # Login, Dashboard, Companies, Logs
    └── package.json
```

---

## Features

- Multi-tenant data isolation — every query scoped to the user's organization
- Role-based access control — Admin, Manager, Staff with different permissions
- JWT authentication — access and refresh tokens
- Company and Contact CRUD with soft delete
- Search, filter, and pagination on all list endpoints
- Activity logging — every CREATE, UPDATE, DELETE automatically recorded
- AWS S3 logo upload for companies (falls back to local storage)
- Versioned API — /api/v1/

---

## Backend Setup

### 1. Navigate to backend folder
```
cd backend
```

### 2. Create and activate virtual environment
```
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

### 3. Install dependencies
```
pip install -r requirements.txt
```

### 4. Set up environment variables
```
cp .env.example .env
```
Open `.env` and fill in your values:
- `SECRET_KEY` — any long random string
- `DEBUG` — True for development
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` — PostgreSQL details
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_REGION_NAME` — set to `placeholder` to use local storage

### 5. Run migrations
```
python manage.py migrate
```

### 6. Create superuser
```
python manage.py createsuperuser
```

### 7. Start backend server
```
python manage.py runserver
```
Backend runs at: http://127.0.0.1:8000

---

## Frontend Setup

### 1. Navigate to frontend folder
```
cd frontend
```

### 2. Install dependencies
```
npm install
```

### 3. Start frontend
```
npm run dev
```
Frontend runs at: http://localhost:5173

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login/ | Login and get JWT tokens |
| POST | /api/v1/auth/register/ | Register a new user |
| GET | /api/v1/auth/me/ | Get current user info |
| POST | /api/v1/auth/token/refresh/ | Refresh access token |

### CRM
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/crm/companies/ | List companies (paginated) |
| POST | /api/v1/crm/companies/ | Create a company |
| GET | /api/v1/crm/companies/{id}/ | Get company detail |
| PUT | /api/v1/crm/companies/{id}/ | Update a company |
| DELETE | /api/v1/crm/companies/{id}/ | Soft delete a company |
| GET | /api/v1/crm/contacts/ | List contacts (paginated) |
| POST | /api/v1/crm/contacts/ | Create a contact |
| GET | /api/v1/crm/contacts/{id}/ | Get contact detail |
| PUT | /api/v1/crm/contacts/{id}/ | Update a contact |
| DELETE | /api/v1/crm/contacts/{id}/ | Soft delete a contact |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/logs/ | List activity logs for your org |

---

## Role Permissions

| Action | Admin | Manager | Staff |
|--------|-------|---------|-------|
| View | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ |
| Edit | ✅ | ✅ | ❌ |
| Delete | ✅ | ❌ | ❌ |

---

## AWS S3

The S3 integration is fully implemented using django-storages and boto3.
Set real AWS credentials in `.env` to activate S3 storage.
When `AWS_ACCESS_KEY_ID` is set to `placeholder`, the app automatically
falls back to local media storage for development.

---

## Admin Panel

Access Django admin at: http://127.0.0.1:8000/admin/

Manage Organizations, Users, Companies, Contacts, and Activity Logs directly.
