import { WorldCupSDK } from '../../src/index.js';

const sdk = new WorldCupSDK({
  providers: {
    footballApi: { apiKey: process.env['FOOTBALL_API_KEY'] },
  },
});

async function main() {
  const groups = await sdk.fifa.groups.list();
  console.log(`Tournament has ${groups.length} groups\n`);

  const allStandings = await sdk.fifa.standings.all();

  for (const [groupCode, standings] of Object.entries(allStandings)) {
    console.log(`--- Group ${groupCode} ---`);
    standings.forEach(s => {
      const gd = s.goalDifference >= 0 ? `+${s.goalDifference}` : `${s.goalDifference}`;
      console.log(
        `  ${s.position}. ${s.teamId.padEnd(20)} P:${s.played} W:${s.won} D:${s.drawn} L:${s.lost} GD:${gd} Pts:${s.points}`,
      );
    });
    console.log();

    const tiebreak = await sdk.intelligence.tiebreak.simulate(groupCode as any);
    console.log(`  Projected qualifiers: ${tiebreak.qualifiers.join(', ')}`);
    console.log();
  }
}

main().catch(console.error);
