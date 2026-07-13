# API overview

All API endpoints use the `/api/v1` prefix and return a consistent JSON envelope containing `success`, `message`, and `data`; paginated responses also include `meta`. Authentication is accepted through the HTTP-only `token` cookie and, for API clients, a bearer token.

## Endpoint groups

| Prefix | Main responsibilities | Access |
|---|---|---|
| `/auth` | Register, login/logout, current user, profile update, password change/reset | Public plus authenticated account actions |
| `/admin/users` | Paginated user CRUD | Administrator |
| `/academic-profile` | Profile, onboarding steps, completion | Authenticated owner |
| `/universities` | Catalogue, country filter, personalized recommendations, catalogue CRUD | Public reads; student recommendations; admin writes |
| `/scholarships` | Scholarship catalogue and CRUD | Public reads; admin writes |
| `/applications` | Create, submit, list, update, delete, assignments | Record- and role-scoped |
| `/documents` | Upload, list, download, verify, delete | Owner reads/writes; admin oversight |
| `/counsellors` | Directory, assigned students, counsellor profile, admin CRUD | Mixed public and role-scoped |
| `/appointments` | Student booking and role-scoped schedules | Authenticated, role-scoped |
| `/messages` | Conversations, messages, read receipts | Conversation participants |
| `/notifications` | List, unread count, mark read, delete | Authenticated owner |
| `/visa` | Create, list, update, reassign, delete visa cases | Record- and role-scoped |
| `/analytics` | Totals, regions, universities, growth, success rate | Administrator |

## Important constraints

- Students can start visa tracking only from their own accepted application and only once per application.
- Counsellors can access only applications, appointments, students, and visa cases assigned to them.
- Conversations require real user IDs; only participants can read, send, or mark messages read.
- Recommendation results are calculated on the server from the authenticated student's saved academic profile.
- Document files are never exposed through the public static upload route.
- Administrators cannot delete themselves or remove their own administrator role.

Request bodies are validated with Zod. Validation failures return HTTP 400; missing authentication returns 401; insufficient role or record access returns 403; missing records return 404; conflicts such as duplicate visa cases return 409.
