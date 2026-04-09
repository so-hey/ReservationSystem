import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabaseのreservationsテーブルから1件取得して接続確認
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercelのcronジョブからのリクエストのみ許可
  const authHeader = req.headers.authorization;

  // 本番環境ではVercelのcron secretで認証
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    console.log('Cron job started at:', new Date().toISOString());

    // Supabaseクライアントの初期化
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase環境変数が設定されていません');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // reservationsテーブルから1件取得
    const { data, error } = await supabase.from('reservations').select('id').limit(1);

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    console.log('Cron job completed successfully.');

    return res.status(200).end();
  } catch (error) {
    console.error('Cron job failed:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
