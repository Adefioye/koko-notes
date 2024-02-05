1. Generate SQL required to get the data in sqlite db.
```
sqlite3 prisma/data.db .dump > data.sql
```

2. Create first data migration using the following
```
npx prisma migrate dev --name init
```

3. Seeding database with prisma after setting up script with `prisma CLI`
```
npx prisma db seed
```

