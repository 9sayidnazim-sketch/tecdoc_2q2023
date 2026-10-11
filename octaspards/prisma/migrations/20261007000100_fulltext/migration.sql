-- Full-text search on part names/descriptions/numbers.
-- A STORED generated tsvector column keeps itself in sync on every insert/update.
-- 'simple' config is language-neutral so it works for brand names, numbers and English/Arabic text alike.
ALTER TABLE "Part"
  ADD COLUMN "searchVector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce("partNumber", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce("nameAr", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce("description", '')), 'C')
  ) STORED;

CREATE INDEX "Part_searchVector_idx" ON "Part" USING GIN ("searchVector");

-- Trigram index on part names for typo-tolerant name matching
CREATE INDEX "Part_name_trgm_idx" ON "Part" USING GIN ("name" gin_trgm_ops);
