# Database Migrations

이 디렉토리는 Prisma 데이터베이스 마이그레이션을 포함합니다.

## 마이그레이션 실행 방법

### 개발 환경

```bash
# 새 마이그레이션 적용
npx prisma migrate dev

# 특정 마이그레이션 적용
npx prisma migrate deploy
```

### 프로덕션 환경

```bash
# 프로덕션 데이터베이스에 마이그레이션 적용
npx prisma migrate deploy
```

## 수동 마이그레이션

데이터베이스 연결이 없는 경우, 각 마이그레이션 폴더의 `migration.sql` 파일을 직접 실행할 수 있습니다.

### 20250611000000_add_avatar_to_contractor

**목적**: Contractor 테이블에 avatar 필드 추가

**SQL:**
```sql
ALTER TABLE "contractor" ADD COLUMN "avatar" VARCHAR(500);
CREATE INDEX "contractor_avatar_idx" ON "contractor"("avatar") WHERE "avatar" IS NOT NULL;
```

**영향**: 사용자 프로필에 아바타 이미지 URL 저장 가능

**롤백 방법:**
```sql
DROP INDEX IF EXISTS "contractor_avatar_idx";
ALTER TABLE "contractor" DROP COLUMN "avatar";
```

## 주의사항

1. **프로덕션 마이그레이션**: 프로덕션 환경에서는 `migrate deploy`를 사용하세요.
2. **백업**: 마이그레이션 실행 전 반드시 데이터베이스 백업을 수행하세요.
3. **테스트**: 스테이징 환경에서 먼저 테스트한 후 프로덕션에 적용하세요.
4. **다운타임**: 대규모 테이블에 인덱스 추가 시 다운타임이 발생할 수 있습니다.
