import { WorldCupSDK } from '../../src/index.js';

const sdk = new WorldCupSDK({
  providers: {
    footballApi: { apiKey: process.env['FOOTBALL_API_KEY'] },
  },
});

async function main() {
  const fixtureId = process.argv[2] ?? 'wc26-match-001';

  const fixture = await sdk.fifa.fixtures.byId(fixtureId);
  console.log(`Match: ${fixture.homeTeamId} vs ${fixture.awayTeamId}`);
  console.log(`Status: ${fixture.status}  Score: ${fixture.homeScore ?? '-'} - ${fixture.awayScore ?? '-'}`);
  console.log();

  const events = await sdk.fifa.events.byMatch(fixtureId);
  if (events.length === 0) {
    console.log('No events recorded yet.');
    return;
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);
  for (const event of sorted) {
    const icon =
      event.type === 'goal' ? '⚽' :
      event.type === 'own_goal' ? '⚽(OG)' :
      event.type === 'yellow_card' ? '🟨' :
      event.type === 'red_card' ? '🟥' :
      event.type === 'substitution' ? '🔄' : '•';
    console.log(`  ${event.minute}' ${icon}  ${event.playerId ?? event.teamId}`);
  }

  const narrative = await sdk.intelligence.narratives.forMatch(fixtureId);
  if (narrative.tags.length > 0) {
    console.log('\nMatch narrative tags:', narrative.tags.join(', '));
  }
}

main().catch(console.error);
