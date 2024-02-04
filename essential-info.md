1. Generate SQL required to get the data in sqlite db.
```
sqlite3 prisma/data.db .dump > data.sql
```

2. Create first data migration using the following
```
npx prisma migrate dev --name init
```
