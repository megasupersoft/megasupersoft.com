-- Posts table: stores social media posts
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  platforms TEXT NOT NULL DEFAULT '[]', -- JSON array of platform names
  status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, published, failed
  scheduled_at TEXT, -- ISO 8601 timestamp
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  author TEXT NOT NULL
);

-- Social metrics cache: refreshed by cron
CREATE TABLE IF NOT EXISTS social_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  metric TEXT NOT NULL, -- followers, posts, views, etc.
  value REAL NOT NULL DEFAULT 0,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Releases tracker
CREATE TABLE IF NOT EXISTS releases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT NOT NULL,
  version TEXT NOT NULL,
  notes TEXT,
  published_at TEXT,
  github_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_metrics_platform ON social_metrics(platform, recorded_at);
CREATE INDEX IF NOT EXISTS idx_releases_product ON releases(product, published_at);
