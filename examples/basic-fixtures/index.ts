import { WorldCupSDK } from '../../src/index.js';

const sdk = new WorldCupSDK({
  providers: {
    footballApi: { apiKey: process.env['FOOTBALL_API_KEY'] },
  },
  cache: { ttlSeconds: 60 },
});

async function main() {
  const allFixtures = await sdk.fifa.fixtures.list();
  console.log(`Total fixtures: ${allFixtures.length}`);

  const groupAFixtures = await sdk.fifa.fixtures.list({ groupCode: 'A' });
  console.log(`Group A fixtures: ${groupAFixtures.length}`);

  const liveFixtures = await sdk.fifa.fixtures.live();
  console.log(`Live right now: ${liveFixtures.length}`);

  const groupAStandings = await sdk.fifa.standings.group('A');
  console.log('Group A standings:');
  groupAStandings.forEach(s => {
    console.log(`  ${s.position}. ${s.teamId} — ${s.points} pts (${s.won}W ${s.drawn}D ${s.lost}L)`);
  });
}

main().catch(console.error);
