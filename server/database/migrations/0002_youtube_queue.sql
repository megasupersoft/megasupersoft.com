CREATE TABLE IF NOT EXISTS youtube_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  privacy TEXT NOT NULL DEFAULT 'public',
  blob_key TEXT,
  video_id TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_youtube_queue_status ON youtube_queue(status);
