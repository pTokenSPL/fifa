import { WorldCupSDK } from '../../src/index.js';

const sdk = new WorldCupSDK({
  cache: { ttlSeconds: 30 },
});

async function pollLiveScores(intervalMs = 30000) {
  console.log('Polling live scores every', intervalMs / 1000, 'seconds...\n');

  async function tick() {
    const live = await sdk.fifa.fixtures.live();

    if (live.length === 0) {
      console.log('[no live matches right now]');
    } else {
      for (const match of live) {
        const score = `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;
        const minute = match.minute ? `${match.minute}'` : 'LIVE';
        console.log(`${match.homeTeamId} ${score} ${match.awayTeamId}  [${minute}]`);

        const goals = await sdk.fifa.events.goals(match.id);
        goals.forEach(g => {
          const label = g.type === 'own_goal' ? '(OG)' : '';
          console.log(`   ⚽ ${g.minute}' ${g.playerId ?? 'Unknown'} ${label}`);
        });
      }
    }

    console.log('---', new Date().toISOString());
    sdk.clearCache();
  }

  await tick();
  setInterval(tick, intervalMs);
}

pollLiveScores().catch(console.error);
